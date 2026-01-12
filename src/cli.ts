#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import meow from 'meow';
import appdmg from 'appdmg';
import plist from 'plist';
import Ora from 'ora';
import {execa} from 'execa';
import addLicenseAgreementIfNeeded from './sla.js';
import composeIcon from './compose-icon.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.platform !== 'darwin') {
	console.error('macOS only');
	process.exit(1);
}

interface PlistInfo {
	CFBundleDisplayName?: string;
	CFBundleName?: string;
	CFBundleShortVersionString?: string;
	CFBundleIconFile?: string;
}

interface CliFlags {
	overwrite: boolean;
	versionInFilename: boolean;
	identity?: string;
	dmgTitle?: string;
	codeSign: boolean;
}

const cli = meow(`
	Usage
	  $ create-dmg <app> [destination]

	Options
	  --overwrite                  Overwrite existing DMG with the same name
	  --no-version-in-filename     Exclude version number from DMG filename
	  --identity=<value>           Manually set code signing identity (automatic by default)
	  --dmg-title=<value>          Manually set DMG title (must be <=27 characters) [default: App name]
	  --no-code-sign               Skip code signing the DMG

	Examples
	  $ create-dmg 'Lungo.app'
	  $ create-dmg 'Lungo.app' Build/Releases
`, {
	importMeta: import.meta,
	flags: {
		overwrite: {
			type: 'boolean',
		},
		versionInFilename: {
			type: 'boolean',
			default: true,
		},
		identity: {
			type: 'string',
		},
		dmgTitle: {
			type: 'string',
		},
		codeSign: {
			type: 'boolean',
			default: true,
		},
	},
});

let [inputAppPath] = cli.input;
let destinationPath = cli.input[1];

if (!inputAppPath) {
	console.error('Specify an app');
	process.exit(1);
}

if (!destinationPath) {
	destinationPath = process.cwd();
}

// At this point, both are guaranteed to be defined - create non-nullable references
const appPath = inputAppPath!;
const finalDestinationPath = destinationPath;

const infoPlistPath = path.join(appPath, 'Contents/Info.plist');

let infoPlist: string;
try {
	infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
} catch (error) {
	if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
		console.error(`Could not find \`${path.relative(process.cwd(), appPath)}\``);
		process.exit(1);
	}

	throw error;
}

const ora = Ora('Creating DMG');
ora.start();

async function init(): Promise<void> {
	let appInfo: PlistInfo;
	try {
		appInfo = plist.parse(infoPlist) as PlistInfo;
	} catch {
		const {stdout} = await execa('/usr/bin/plutil', ['-convert', 'xml1', '-o', '-', infoPlistPath]);
		appInfo = plist.parse(stdout) as PlistInfo;
	}

	const appName = appInfo.CFBundleDisplayName ?? appInfo.CFBundleName;
	if (!appName) {
		throw new Error('The app must have `CFBundleDisplayName` or `CFBundleName` defined in its `Info.plist`.');
	}

	const flags = cli.flags as CliFlags;
	const dmgTitle = flags.dmgTitle ?? appName;
	const dmgFilename = flags.versionInFilename
		? `${appName} ${appInfo.CFBundleShortVersionString ?? '0.0.0'}.dmg`
		: `${appName}.dmg`;
	const dmgPath = path.join(finalDestinationPath, dmgFilename);

	if (dmgTitle.length > 27) {
		ora.fail('The disk image title cannot exceed 27 characters. This is a limitation in a dependency: https://github.com/LinusU/node-alias/issues/7');
		process.exit(1);
	}

	if (flags.overwrite) {
		try {
			fs.unlinkSync(dmgPath);
		} catch {}
	}

	const hasAppIcon = appInfo.CFBundleIconFile;
	let composedIconPath: string | undefined;
	if (hasAppIcon) {
		ora.text = 'Creating icon';
		const appIconName = hasAppIcon.replace(/\.icns/, '');
		composedIconPath = await composeIcon(path.join(appPath, 'Contents/Resources', `${appIconName}.icns`));
	}

	const dmgFormat = 'ULFO'; // ULFO requires macOS 10.11+
	const dmgFilesystem = 'APFS'; // APFS requires macOS 10.13+

	const ee = appdmg({
		target: dmgPath,
		basepath: process.cwd(),
		specification: {
			title: dmgTitle,
			icon: composedIconPath,
			//
			// Use transparent background and `background-color` option when this is fixed:
			// https://github.com/LinusU/node-appdmg/issues/135
			background: path.join(__dirname, '..', 'assets', 'dmg-background.png'),
			'icon-size': 160,
			format: dmgFormat,
			filesystem: dmgFilesystem,
			window: {
				size: {
					width: 660,
					height: 400,
				},
			},
			contents: [
				{
					x: 180,
					y: 170,
					type: 'file',
					path: appPath,
				},
				{
					x: 480,
					y: 170,
					type: 'link',
					path: '/Applications',
				},
			],
		},
	});

	ee.on('progress', (info: {type: string; title?: string}) => {
		if (info.type === 'step-begin') {
			ora.text = info.title ?? 'Processing';
		}
	});

	ee.on('finish', () => {
		void (async () => {
			try {
				ora.text = 'Adding Software License Agreement if needed';
				await addLicenseAgreementIfNeeded(dmgPath, dmgFormat);

				if (flags.codeSign) {
					ora.text = 'Code signing DMG';
					let identity: string | undefined;
					if (flags.identity) {
						// We skip identity validation to support both named and SHA-1 formats; let system validate.
						identity = flags.identity;
					} else {
						const {stdout} = await execa('/usr/bin/security', ['find-identity', '-v', '-p', 'codesigning']);
						if (!flags.identity && stdout.includes('Developer ID Application:')) {
							identity = 'Developer ID Application';
						} else if (!flags.identity && stdout.includes('Mac Developer:')) {
							identity = 'Mac Developer';
						} else if (!flags.identity && stdout.includes('Apple Development:')) {
							identity = 'Apple Development';
						}
					}

					if (!identity) {
						const error = new Error('No suitable code signing identity found') as Error & {stderr?: string};
						error.stderr = 'No suitable code signing identity found';
						throw error;
					}

					try {
						await execa('/usr/bin/codesign', ['--sign', identity, dmgPath]);
					} catch (error) {
						const errorMessage = (error as {stderr?: string}).stderr?.trim() ?? error;
						ora.fail(`Code signing failed. The DMG is fine, just not code signed.\n${errorMessage}`);
						process.exit(2);
					}

					const {stderr} = await execa('/usr/bin/codesign', [dmgPath, '--display', '--verbose=2']);

					const match = /^Authority=(.*)$/m.exec(stderr);
					if (!match) {
						ora.fail('Not code signed');
						process.exit(1);
					}

					ora.info(`Code signing identity: ${match[1]}`).start();
				} else {
					ora.info('Code signing skipped').start();
				}

				ora.succeed(`Created "${dmgFilename}"`);
			} catch (error) {
				const errorMessage = (error as {stderr?: string}).stderr?.trim() ?? error;
				ora.fail(`${errorMessage}`);
				process.exit(2);
			}
		})();
	});

	ee.on('error', (error: Error) => {
		ora.fail(`Building the DMG failed. ${error}`);
		process.exit(1);
	});
}

try {
	await init();
} catch (error) {
	ora.fail((error as Error)?.stack || String(error));
	process.exit(1);
}
