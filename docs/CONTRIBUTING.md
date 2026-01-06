# Contributing to create-dmg-ts

Thank you for your interest in contributing to create-dmg-ts! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Architecture Decision Records](#architecture-decision-records)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- **macOS**: This project only works on macOS due to platform-specific dependencies
- **Node.js 24+**: Required for development
- **Xcode Command Line Tools**: Required for building and testing
- **GraphicsMagick**: Optional, for icon composition testing

```bash
# Install GraphicsMagick (optional)
brew install graphicsmagick imagemagick
```

### Setting Up the Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/create-dmg-ts.git
cd create-dmg-ts

# Install dependencies
npm install

# Set up Git hooks
npm run prepare

# Build the project
npm run build

# Run tests (requires test fixtures)
npm test
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 2. Make Changes

Follow the [Coding Standards](#coding-standards) while making changes.

### 3. Test Your Changes

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm test

# Or run all checks
npm run build && npm run lint && npm run typecheck && npm test
```

### 4. Commit Your Changes

Follow the [Commit Message Guidelines](#commit-message-guidelines).

Pre-commit hooks will automatically:
- Run type checking
- Lint staged files
- Block commits if checks fail

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript Style

- **Strict Mode**: All code must pass strict TypeScript checks
- **No `any`**: Avoid using `any` type; use proper types or `unknown`
- **Explicit Types**: Prefer explicit return types for functions
- **Null Safety**: Handle `null` and `undefined` explicitly

```typescript
// Good
function processFile(path: string): Promise<void> {
  // ...
}

// Bad
function processFile(path) {
  // ...
}
```

### Code Organization

- **One responsibility per function**: Functions should do one thing well
- **Early returns**: Use early returns to reduce nesting
- **Named constants**: Extract magic numbers and strings to named constants

```typescript
// Good
const MAX_DMG_TITLE_LENGTH = 27;

if (title.length > MAX_DMG_TITLE_LENGTH) {
  throw new Error(`Title too long (max ${MAX_DMG_TITLE_LENGTH} characters)`);
}

// Bad
if (title.length > 27) {
  throw new Error('Title too long');
}
```

### Documentation

- **JSDoc comments**: Add JSDoc comments for public functions and exported types
- **Explain why, not what**: Comments should explain reasoning, not restate code
- **Keep comments updated**: Update comments when changing code

```typescript
/**
 * Composes a custom DMG icon by overlaying the app icon onto the macOS disk icon
 * If GraphicsMagick is not installed, returns the base disk icon
 * 
 * @param appIconPath - Path to the app's .icns file
 * @returns Path to the composed icon file
 */
export default async function composeIcon(appIconPath: string): Promise<string> {
  // ...
}
```

### Error Handling

- **Use Error objects**: Always throw Error objects, not strings
- **Descriptive messages**: Error messages should be clear and actionable
- **Preserve context**: Include relevant details in error messages

```typescript
// Good
if (!fs.existsSync(appPath)) {
  throw new Error(`Application not found: ${appPath}`);
}

// Bad
if (!fs.existsSync(appPath)) {
  throw 'App not found';
}
```

## Testing Guidelines

### Test Structure

Tests use Node.js built-in test runner:

```typescript
import {describe, test} from 'node:test';
import assert from 'node:assert';

describe('Feature Name', () => {
  test('should do something specific', async () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = await myFunction(input);
    
    // Assert
    assert.strictEqual(result, 'expected');
  });
});
```

### Testing Best Practices

- **Test behavior, not implementation**: Focus on what the code does, not how
- **One assertion per test**: Each test should verify one specific behavior
- **Descriptive test names**: Test names should clearly describe what is being tested
- **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases

### Test File Naming

- Place tests next to source files: `feature.test.ts` next to `feature.ts`
- Test files are compiled to `dist/` and run from there

### Running Specific Tests

```bash
# Run all tests
npm test

# Run specific test file
node --test dist/cli.test.js
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(cli): add --dmg-title option for custom titles

Allows users to specify a custom DMG title that differs from
the application name. The title is limited to 27 characters
due to underlying library constraints.

Closes #123
```

```bash
fix(signing): handle missing private key error gracefully

Previously, when a certificate existed but the private key was
missing, the error message was unclear. Now we provide a helpful
message directing users to check their Keychain.
```

```bash
docs(code-signing): add App Store vs Developer ID comparison

Added detailed comparison table and workflow diagrams to clarify
the differences between App Store and direct distribution signing.
```

## Pull Request Process

### Before Submitting

1. ✅ All tests pass (`npm test`)
2. ✅ Type checking passes (`npm run typecheck`)
3. ✅ Linting passes (`npm run lint`)
4. ✅ Code compiles (`npm run build`)
5. ✅ Documentation is updated (if applicable)
6. ✅ Commit messages follow guidelines

### PR Description Template

```markdown
## Description
Brief description of the changes

## Motivation and Context
Why is this change needed? What problem does it solve?

## Changes Made
- List of specific changes
- Another change
- etc.

## Testing
How has this been tested? Provide details of your test configuration.

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows the project's coding standards
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] ADR created (if architectural change)
```

### Review Process

1. **Automated Checks**: CI will run tests, linting, and type checking
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, maintainers will merge your PR

## Architecture Decision Records

For significant architectural or technical decisions, create an ADR (Architecture Decision Record) in the `docs/ADR/` directory.

### When to Create an ADR

Create an ADR when:
- Introducing a new dependency or technology
- Changing the build system or toolchain
- Modifying the project structure significantly
- Making decisions that affect future contributors
- Choosing between multiple implementation approaches

### ADR Template

Use the template at [`docs/ADR/000-adr-template.md`](docs/ADR/000-adr-template.md).

### ADR Naming

- Number sequentially: `001-`, `002-`, etc.
- Use kebab-case: `001-typescript-migration.md`
- Update the ADR index in `docs/ADR/README.md`

### Example ADR Workflow

```bash
# Create new ADR
cp docs/ADR/000-adr-template.md docs/ADR/005-new-feature.md

# Edit the ADR
vim docs/ADR/005-new-feature.md

# Update the index
vim docs/ADR/README.md

# Commit
git add docs/ADR/
git commit -m "docs(adr): add ADR-005 for new feature decision"
```

## Frequently Asked Questions

### Can I test on a non-macOS system?

No, the core functionality requires macOS-specific tools. However, you can:
- Review and improve documentation
- Improve TypeScript types
- Add non-platform-specific utilities
- Fix linting or formatting issues

### How do I run tests without fixture apps?

The integration tests require actual `.app` bundles in the `fixtures/` directory. For unit tests, you can run specific test files that don't require fixtures.

### Should I update the version number?

No, maintainers will handle version bumps according to semantic versioning when releasing.

### How do I add a new CLI flag?

1. Update the `cli.ts` file to add the flag to the meow configuration
2. Add handling logic for the flag
3. Update the README and CLI help text
4. Add tests for the new flag
5. Update the `docs/code-signing.md` if it affects signing

### What if my PR is rejected?

Don't be discouraged! Maintainers will provide feedback on why the PR was not accepted. You can:
- Address the feedback and resubmit
- Discuss the approach in an issue first
- Break the PR into smaller, more focused changes

## Getting Help

- 📖 **Documentation**: Read the [README](../README.md) and [Code Signing Guide](code-signing.md)
- 💬 **Discussions**: Ask questions in [GitHub Discussions](https://github.com/Romerolweb/create-dmg-ts/discussions)
- 🐛 **Issues**: Report bugs in [GitHub Issues](https://github.com/Romerolweb/create-dmg-ts/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to create-dmg-ts! 🎉
