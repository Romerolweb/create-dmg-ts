# ADR-003: ESLint and Code Quality Tooling

**Date:** 2026-01-06

**Status:** Accepted

## Context

The project currently uses `xo` (version 0.56.0) as its linting tool. While xo is an opinionated and zero-config linter that works well for JavaScript projects, the migration to TypeScript introduces new requirements:

- TypeScript-specific linting rules and type-aware checks
- Integration with TypeScript compiler for type checking
- More granular control over linting rules for a growing codebase
- Pre-commit hooks to ensure code quality before commits
- Consistent formatting across the codebase

The project needs a modern, flexible linting setup that:
1. Supports TypeScript natively with type-aware rules
2. Provides explicit configuration for maintainability
3. Integrates well with modern IDEs and editors
4. Can run type checking as part of the linting process
5. Supports pre-commit hooks for automated quality checks

## Decision

We will replace `xo` with ESLint configured for TypeScript, along with additional tooling:

### Linting Stack

1. **ESLint** with TypeScript support via `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
2. **Type Checking**: Integrated TypeScript compiler checks before commits
3. **Prettier** (optional): For consistent code formatting if team prefers
4. **Husky**: For Git hooks management
5. **lint-staged**: To run linters only on staged files for performance

### Configuration Approach

- Use `eslint.config.js` (flat config) for modern ESLint configuration
- Enable recommended TypeScript ESLint rules
- Enable type-aware linting rules for enhanced type safety
- Configure rules to match project style and best practices
- Add custom rules as needed for project-specific requirements

### Pre-commit Workflow

1. Run TypeScript compiler (`tsc --noEmit`) to catch type errors
2. Run ESLint on staged TypeScript files
3. Block commits that fail checks
4. Provide clear error messages for quick fixes

## Consequences

### Positive

- **TypeScript Native**: ESLint with TypeScript plugin provides first-class TypeScript support
- **Type-Aware Rules**: Access to rules that use type information for deeper analysis
- **Flexibility**: Explicit configuration allows customization as project evolves
- **Industry Standard**: ESLint is the most widely used JavaScript/TypeScript linter
- **Better IDE Integration**: Excellent support in VS Code, WebStorm, and other IDEs
- **Pre-commit Safety**: Automated checks prevent committing code with errors
- **Performance**: lint-staged only checks changed files, speeding up the process
- **Explicit Configuration**: Team can see and understand all linting rules

### Negative

- **More Configuration**: Requires maintaining ESLint configuration files (vs xo's zero-config)
- **Initial Setup Complexity**: More tools and configuration files to set up
- **Learning Curve**: Team needs to understand ESLint configuration structure
- **Migration Effort**: Need to review and adjust rules to match current code style
- **Additional Dependencies**: More packages in devDependencies

### Neutral

- **Breaking Change**: Developers must install new Git hooks (Husky)
- **Different Error Messages**: ESLint errors may differ from xo errors
- **Configuration Maintenance**: Rules may need periodic updates

## Implementation Details

### ESLint Configuration

```javascript
// eslint.config.js
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      // Add more rules as needed
    },
  },
];
```

### Package Scripts

- `npm run lint`: Run ESLint on all files
- `npm run lint:fix`: Run ESLint with auto-fix
- `npm run typecheck`: Run TypeScript compiler type checking
- `npm run format`: Run Prettier (if adopted)

### Pre-commit Hook

The pre-commit hook will run:
1. TypeScript type checking on the entire project
2. ESLint on staged files only (via lint-staged)

## Alternative Considered

### Keep xo

**Pros**: 
- Zero configuration
- Already working
- Familiar to current contributors

**Cons**:
- Limited TypeScript support
- Less flexibility for project-specific rules
- Harder to integrate type-aware rules
- Less granular control

**Decision**: Rejected because TypeScript requires more sophisticated tooling than xo currently provides.

## References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
