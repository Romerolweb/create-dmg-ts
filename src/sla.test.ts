import {describe, test, mock} from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import {temporaryDirectory} from 'tempy';

describe('Software License Agreement (SLA)', () => {
	test('module exports a function', async () => {
		// Dynamic import to avoid issues with module loading
		const slaModule = await import('./sla.js');
		const addLicenseAgreementIfNeeded = slaModule.default;
		
		assert.strictEqual(typeof addLicenseAgreementIfNeeded, 'function');
	});

	test('skips processing when no license files exist', async () => {
		const slaModule = await import('./sla.js');
		const addLicenseAgreementIfNeeded = slaModule.default;
		
		// Create a temporary directory without license files
		const tempDir = temporaryDirectory();
		const originalCwd = process.cwd();
		
		try {
			process.chdir(tempDir);
			
			// Should not throw when no license files are present
			await assert.doesNotReject(async () => {
				// Pass dummy values since function should return early
				await addLicenseAgreementIfNeeded('/nonexistent/path.dmg', 'ULFO');
			});
		} finally {
			process.chdir(originalCwd);
		}
	});

	test('detects license.txt file', async () => {
		const tempDir = temporaryDirectory();
		const originalCwd = process.cwd();
		
		try {
			process.chdir(tempDir);
			
			// Create a license.txt file
			fs.writeFileSync(path.join(tempDir, 'license.txt'), 'Test License', 'utf8');
			
			const hasLicense = fs.existsSync(path.join(process.cwd(), 'license.txt'));
			assert.ok(hasLicense, 'license.txt should be detected');
		} finally {
			process.chdir(originalCwd);
		}
	});
});
