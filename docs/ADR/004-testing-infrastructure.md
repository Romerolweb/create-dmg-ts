# ADR-004: Testing Infrastructure with Node.js Test Runner

**Date:** 2026-01-06

**Status:** Accepted

## Context

The project currently uses AVA (v6.1.1) as its test runner. While AVA is a popular testing framework with good TypeScript support, Node.js now includes a built-in test runner (stable since Node.js 20) that eliminates the need for external test frameworks.

Given our decision to target Node.js 22+, we have access to:
- Native test runner with `node:test` module
- Built-in assertion library with `node:assert`
- Watch mode for test-driven development
- Test coverage reporting (experimental)
- No additional dependencies required

The project's test suite is currently minimal with integration tests for the CLI. We need to:
1. Convert existing tests to use Node.js test runner
2. Add basic unit tests for utility functions
3. Ensure tests can run in CI/CD pipeline
4. Support TypeScript test files

## Decision

Replace AVA with Node.js built-in test runner. This decision includes:

### Test Framework
- Use `node:test` module for test organization and execution
- Use `node:assert` for assertions (with strict mode)
- Leverage Node.js 22+'s experimental TypeScript support via `--experimental-strip-types` flag
- Compile TypeScript to JavaScript before running tests (safer approach)

### Test Structure
- Keep tests co-located with source files (e.g., `cli.test.ts` next to `cli.ts`)
- Use `describe()` for grouping related tests
- Use `test()` for individual test cases
- Follow naming convention: `*.test.ts` for test files

### Test Execution
- Compile TypeScript first: `npm run build`
- Run tests on compiled JavaScript in `dist/` directory
- Use glob patterns to run all test files: `dist/**/*.test.js`
- CI pipeline will run: build → lint → typecheck → test

### Test Coverage
- Simple integration tests for CLI functionality
- Basic unit tests for utility functions (SLA, icon composition)
- Focus on critical path and public API
- Tests must work on macOS (primary platform)

## Consequences

### Positive

- **Zero Dependencies**: No need for external test framework, reducing dependency bloat
- **Native TypeScript Support**: Node.js 22+ can execute TypeScript tests with experimental flag
- **Modern Features**: Access to latest test runner features and improvements
- **Simplicity**: Familiar API similar to other test frameworks (describe/test pattern)
- **Performance**: Native implementation should be faster than external frameworks
- **Maintainability**: One less dependency to update and maintain
- **First-Class Support**: Built-in test runner is maintained by Node.js core team

### Negative

- **Experimental TypeScript**: Direct TypeScript execution is experimental; we mitigate by compiling first
- **Limited Ecosystem**: Fewer plugins and extensions compared to mature frameworks like Jest or AVA
- **Learning Curve**: Team familiar with AVA must learn new API (though it's similar)
- **Feature Set**: Missing some advanced features from mature test frameworks (snapshot testing, mocking library)

### Neutral

- **Breaking Change for Contributors**: Developers must learn Node.js test runner API
- **Test Migration Required**: All existing tests must be converted
- **CI/CD Updates**: Test commands must be updated in workflows

## Implementation Details

### Test File Example

```typescript
import {describe, test} from 'node:test';
import assert from 'node:assert';

describe('feature name', () => {
  test('should do something', () => {
    assert.strictEqual(1 + 1, 2);
  });
});
```

### Package Scripts

- `npm test`: Run all tests (after building)
- `npm run build`: Compile TypeScript to JavaScript
- Test files run from `dist/` directory after compilation

### CI/CD Integration

```yaml
- run: npm run build
- run: npm test
```

## Alternatives Considered

### Keep AVA

**Pros**:
- Already configured and working
- Rich feature set and ecosystem
- Team familiarity

**Cons**:
- External dependency to maintain
- Additional package to install
- Slower execution compared to native

**Decision**: Rejected in favor of native Node.js test runner for simplicity.

### Use Jest

**Pros**:
- Industry standard with extensive features
- Excellent TypeScript support
- Rich ecosystem and community

**Cons**:
- Heavy dependency with many sub-dependencies
- Slower execution
- Overkill for this project's test needs
- Complex configuration

**Decision**: Rejected as too heavyweight for project needs.

### Use Vitest

**Pros**:
- Modern, fast test runner
- Good TypeScript support
- Jest-compatible API

**Cons**:
- External dependency
- Primarily focused on Vite ecosystem
- Additional configuration needed

**Decision**: Rejected in favor of zero-dependency native solution.

## References

- [Node.js Test Runner Documentation](https://nodejs.org/api/test.html)
- [Node.js TypeScript Support](https://nodejs.org/api/typescript.html)
- [Node.js Assert Module](https://nodejs.org/api/assert.html)
