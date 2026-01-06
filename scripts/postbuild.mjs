#!/usr/bin/env node
/**
 * Post-build script to ensure CLI file has correct permissions and shebang
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');

// Make CLI executable
try {
	fs.chmodSync(cliPath, '755');
	console.log('✓ Made cli.js executable');
} catch (error) {
	console.error('Failed to make cli.js executable:', error);
	process.exit(1);
}
