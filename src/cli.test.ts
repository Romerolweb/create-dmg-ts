import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe, test} from 'node:test';
import assert from 'node:assert';
import {execa} from 'execa';
import {temporaryDirectory} from 'tempy';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

void describe('create-dmg CLI', () => {
	void test('creates DMG for fixture app', async () => {
		const cwd = temporaryDirectory();
		const cliPath = path.join(__dirname, 'cli.js');
		const fixturePath = path.join(__dirname, '..', 'fixtures', 'Fixture.app');

		try {
			await execa('node', [cliPath, '--identity=0', fixturePath], {cwd});
		} catch (error) {
			// Silence code signing failure
			if (!(error as Error).message.includes('Code signing failed')) {
				throw error;
			}
		}

		const dmgPath = path.join(cwd, 'Fixture 0.0.1.dmg');
		assert.ok(fs.existsSync(dmgPath), 'DMG file should be created');
	});

	void test('creates DMG with binary plist', async () => {
		const cwd = temporaryDirectory();
		const cliPath = path.join(__dirname, 'cli.js');
		const fixturePath = path.join(__dirname, '..', 'fixtures', 'Fixture-with-binary-plist.app');

		try {
			await execa('node', [cliPath, '--identity=0', fixturePath], {cwd});
		} catch (error) {
			// Silence code signing failure
			if (!(error as Error).message.includes('Code signing failed')) {
				throw error;
			}
		}

		const dmgPath = path.join(cwd, 'Fixture 0.0.1.dmg');
		assert.ok(fs.existsSync(dmgPath), 'DMG file should be created');
	});

	void test('creates DMG for app without icon', async () => {
		const cwd = temporaryDirectory();
		const cliPath = path.join(__dirname, 'cli.js');
		const fixturePath = path.join(__dirname, '..', 'fixtures', 'Fixture-no-icon.app');

		try {
			await execa('node', [cliPath, '--identity=0', fixturePath], {cwd});
		} catch (error) {
			// Silence code signing failure
			if (!(error as Error).message.includes('Code signing failed')) {
				throw error;
			}
		}

		const dmgPath = path.join(cwd, 'Fixture 0.0.1.dmg');
		assert.ok(fs.existsSync(dmgPath), 'DMG file should be created');
	});

	void test('respects --no-version-in-filename flag', async () => {
		const cwd = temporaryDirectory();
		const cliPath = path.join(__dirname, 'cli.js');
		const fixturePath = path.join(__dirname, '..', 'fixtures', 'Fixture.app');

		try {
			await execa('node', [cliPath, '--identity=0', '--no-version-in-filename', fixturePath], {cwd});
		} catch (error) {
			// Silence code signing failure
			if (!(error as Error).message.includes('Code signing failed')) {
				throw error;
			}
		}

		const dmgPath = path.join(cwd, 'Fixture.dmg');
		const dmgWithVersionPath = path.join(cwd, 'Fixture 0.0.1.dmg');
		
		assert.ok(fs.existsSync(dmgPath), 'DMG file without version should be created');
		assert.ok(!fs.existsSync(dmgWithVersionPath), 'DMG file with version should not exist');
	});

	void test('respects --no-code-sign flag', async () => {
		const cwd = temporaryDirectory();
		const cliPath = path.join(__dirname, 'cli.js');
		const fixturePath = path.join(__dirname, '..', 'fixtures', 'Fixture.app');

		// This should succeed without any code signing errors
		await execa('node', [cliPath, '--no-code-sign', fixturePath], {cwd});

		const dmgPath = path.join(cwd, 'Fixture 0.0.1.dmg');
		assert.ok(fs.existsSync(dmgPath), 'DMG file should be created');
	});
});
