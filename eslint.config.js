import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
	{
		ignores: ['dist/**', 'node_modules/**', 'fixtures/**', 'stuff/**', '*.js'],
	},
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser: parser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		rules: {
			// TypeScript-specific rules
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			}],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': ['warn', {
				allowExpressions: true,
				allowTypedFunctionExpressions: true,
			}],
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/prefer-nullish-coalescing': 'warn',
			'@typescript-eslint/prefer-optional-chain': 'warn',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/no-misused-promises': 'error',

			// General best practices
			'no-console': 'off', // CLI tool needs console
			'no-process-exit': 'off', // CLI tool needs process.exit
		},
	},
];
