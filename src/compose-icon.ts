import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import {promisify} from 'node:util';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execa} from 'execa';
import {temporaryFile} from 'tempy';
import baseGm from 'gm';
import icns from 'icns-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const gm = baseGm.subClass({imageMagick: true});
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

type IcnsImage = Record<string, Buffer>;

/**
 * Filters an object based on a predicate function
 * @param map - Object to filter
 * @param filterFunction - Predicate function to test each entry
 * @returns Filtered object
 */
const filterMap = <T>(
	map: Record<string, T>,
	filterFunction: (entry: [string, T]) => boolean
): Record<string, T> => {
	return Object.fromEntries(
		Object.entries(map)
			.filter(filterFunction)
			.map(([key, item]) => [key, item])
	);
};

// Drive icon from `/System/Library/Extensions/IOStorageFamily.kext/Contents/Resources/Removable.icns``
const baseDiskIconPath = path.join(__dirname, '..', 'disk-icon.icns');

const biggestPossibleIconType = 'ic10';

/**
 * Composes a single icon type by overlaying the app icon onto the mount icon
 * @param type - The ICNS icon type (e.g., 'ic10')
 * @param appIconBuffer - Buffer containing the app icon image
 * @param mountIconBuffer - Buffer containing the mount drive icon image
 * @param composedIcon - Object to store the composed icon
 */
async function baseComposeIcon(
	type: string,
	appIconBuffer: Buffer,
	mountIconBuffer: Buffer,
	composedIcon: IcnsImage
): Promise<void> {
	let mountIcon = gm(mountIconBuffer);
	let appIcon = gm(appIconBuffer);

	const [appIconSize, mountIconSize] = await Promise.all([
		promisify(appIcon.size.bind(appIcon))(),
		promisify(mountIcon.size.bind(mountIcon))(),
	]);

	// Change the perspective of the app icon to match the mount drive icon
	appIcon = appIcon
		.out('-matte')
		.out('-virtual-pixel', 'transparent')
		.out(
			'-distort',
			'Perspective',
			`1,1  ${appIconSize.width * 0.08},1     ${appIconSize.width},1  ${appIconSize.width * 0.92},1     1,${appIconSize.height}  1,${appIconSize.height}     ${appIconSize.width},${appIconSize.height}  ${appIconSize.width},${appIconSize.height}`
		);

	// Resize the app icon to fit it inside the mount icon, aspect ratio should not be kept to create the perspective illusion
	appIcon = appIcon.resize(mountIconSize.width / 1.58, mountIconSize.height / 1.82, '!');

	const temporaryAppIconPath = temporaryFile({extension: 'png'});
	await promisify(appIcon.write.bind(appIcon))(temporaryAppIconPath);

	// Compose the two icons
	const iconGravityFactor = mountIconSize.height * 0.063;
	mountIcon = mountIcon
		.composite(temporaryAppIconPath)
		.gravity('Center')
		.geometry(`+0-${iconGravityFactor}`);

	composedIcon[type] = await promisify(mountIcon.toBuffer.bind(mountIcon))();
}

/**
 * Checks if GraphicsMagick is installed
 * @returns True if GM is available, false otherwise
 */
const hasGm = async (): Promise<boolean> => {
	try {
		await execa('gm', ['-version']);
		return true;
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return false;
		}

		throw error;
	}
};

/**
 * Composes a custom DMG icon by overlaying the app icon onto the macOS disk icon
 * If GraphicsMagick is not installed, returns the base disk icon
 * 
 * @param appIconPath - Path to the app's .icns file
 * @returns Path to the composed icon file
 */
export default async function composeIcon(appIconPath: string): Promise<string> {
	if (!await hasGm()) {
		return baseDiskIconPath;
	}

	const baseDiskIcons = filterMap(
		icns.parse(await readFile(baseDiskIconPath)) as IcnsImage,
		([key]) => icns.isImageType(key)
	);
	const appIcon = filterMap(
		icns.parse(await readFile(appIconPath)) as IcnsImage,
		([key]) => icns.isImageType(key)
	);

	const composedIcon: IcnsImage = {};
	await Promise.all(
		Object.entries(appIcon).map(async ([type, icon]) => {
			if (baseDiskIcons[type]) {
				return baseComposeIcon(type, icon, baseDiskIcons[type]!, composedIcon);
			}

			console.warn('There is no base image for this type', type);
		})
	);

	if (!composedIcon[biggestPossibleIconType]) {
		// Make sure the highest-resolution variant is generated
		const largestAppIcon = Object.values(appIcon).sort(
			(a, b) => Buffer.byteLength(b) - Buffer.byteLength(a)
		)[0];
		if (largestAppIcon && baseDiskIcons[biggestPossibleIconType]) {
			await baseComposeIcon(
				biggestPossibleIconType,
				largestAppIcon,
				baseDiskIcons[biggestPossibleIconType]!,
				composedIcon
			);
		}
	}

	const temporaryComposedIcon = temporaryFile({extension: 'icns'});

	await writeFile(temporaryComposedIcon, icns.format(composedIcon));

	return temporaryComposedIcon;
}
