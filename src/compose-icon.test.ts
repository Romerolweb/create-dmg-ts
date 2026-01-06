import {describe, test} from 'node:test';
import assert from 'node:assert';

describe('Icon Composition', () => {
	test('module exports a function', async () => {
		// Dynamic import to avoid issues with module loading
		const composeIconModule = await import('./compose-icon.js');
		const composeIcon = composeIconModule.default;
		
		assert.strictEqual(typeof composeIcon, 'function');
	});

	test('returns a string path', async () => {
		const composeIconModule = await import('./compose-icon.js');
		const composeIcon = composeIconModule.default;
		
		// When GraphicsMagick is not installed, it should return base disk icon path
		// We can't test the full functionality without GraphicsMagick, but we can verify
		// it returns a string
		const result = await composeIcon('/nonexistent/path.icns');
		assert.strictEqual(typeof result, 'string');
	});
});
