# ADR-001: Migration to TypeScript

**Date:** 2026-01-06

**Status:** Accepted

## Context

The `create-dmg` project is currently written in JavaScript (ES modules) and has been functioning well. However, as the project grows and requires more maintainability, type safety becomes increasingly important to prevent runtime errors and improve developer experience. The project currently lacks:

- Static type checking to catch errors at compile time
- IDE autocompletion and type inference benefits
- Self-documenting code through type annotations
- Modern tooling benefits that TypeScript provides

The current codebase consists of three main modules (`cli.js`, `compose-icon.js`, `sla.js`) plus test files, making it a manageable size for migration.

## Decision

We will migrate the entire codebase from JavaScript to TypeScript. This includes:

1. Converting all `.js` files to `.ts` files
2. Adding comprehensive type definitions for all functions, parameters, and return values
3. Configuring TypeScript with strict mode enabled for maximum type safety
4. Setting up a build process that compiles TypeScript to JavaScript for distribution
5. Maintaining ES module format for Node.js compatibility
6. Updating the development workflow to include TypeScript compilation

The migration will follow these principles:
- **Gradual typing**: Start with basic types and enhance over time
- **Strict configuration**: Enable strict TypeScript settings to maximize safety
- **Minimal runtime changes**: Types should not change the runtime behavior of the code
- **Build output compatibility**: Compiled JavaScript should work exactly as the current code does

## Consequences

### Positive

- **Type Safety**: Compile-time error detection reduces runtime bugs and improves code reliability
- **Better IDE Support**: Enhanced autocompletion, refactoring tools, and inline documentation
- **Self-Documenting Code**: Type annotations serve as inline documentation for function signatures and data structures
- **Easier Maintenance**: Types make it easier to understand code intent and catch breaking changes during refactoring
- **Modern Ecosystem**: Access to TypeScript-specific tooling and better integration with modern development practices
- **Gradual Adoption**: TypeScript allows mixing of typed and less-typed code during transition

### Negative

- **Build Step Required**: Introduces compilation step before execution, slightly complicating the development workflow
- **Learning Curve**: Team members unfamiliar with TypeScript need to learn type syntax and concepts
- **Initial Migration Effort**: Time investment required to convert existing codebase and add types
- **Additional Configuration**: Need to maintain `tsconfig.json` and potentially update build tools
- **Type Definition Maintenance**: Types must be kept in sync with implementation changes

### Neutral

- **File Extensions Change**: `.js` files become `.ts` files (tooling must be updated accordingly)
- **npm Package Distribution**: Will distribute compiled JavaScript, so consumers are not affected
- **Development Dependencies**: TypeScript compiler added as a development dependency

## Implementation Plan

1. Add TypeScript as a development dependency
2. Create `tsconfig.json` with appropriate compiler options
3. Migrate files in order: utility modules first, then CLI entry point
4. Add type definitions for external dependencies where needed
5. Update build scripts and package.json
6. Update tests to work with TypeScript
7. Configure CI/CD to run TypeScript compilation

## References

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript for Node.js](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript)
- [TypeScript Handbook - Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
