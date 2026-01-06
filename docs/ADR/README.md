# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records (ADRs) for the create-dmg-ts project. ADRs document significant architectural and technical decisions made during the development and evolution of the project.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences. ADRs provide historical context and rationale for why certain technical choices were made.

## Format

We use a simple format for ADRs:

- **Date**: When the decision was made
- **Status**: Current state (Proposed, Accepted, Deprecated, Superseded)
- **Context**: The circumstances and facts that led to this decision
- **Decision**: The actual decision and what we chose to do
- **Consequences**: The outcomes, both positive and negative, of this decision

## Naming Convention

ADRs are numbered sequentially with the format: `NNN-title-in-kebab-case.md`

Example: `001-typescript-migration.md`

## Index of ADRs

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [000](./000-adr-template.md) | ADR Template | Template | - |
| [001](./001-typescript-migration.md) | Migration to TypeScript | Accepted | 2026-01-06 |
| [002](./002-nodejs-version-update.md) | Node.js Version Update to v24 | Accepted | 2026-01-06 |
| [003](./003-eslint-and-code-quality.md) | ESLint and Code Quality Tooling | Accepted | 2026-01-06 |
| [004](./004-testing-infrastructure.md) | Testing Infrastructure with Node.js Test Runner | Accepted | 2026-01-06 |
| [005](./005-project-upgrade-summary.md) | Project Upgrade Summary - TypeScript Migration and Modernization | Accepted | 2026-01-06 |

## Creating a New ADR

1. Copy the template from `000-adr-template.md`
2. Assign the next sequential number
3. Write a descriptive title in kebab-case
4. Fill in all sections thoroughly
5. Update this README index

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's Article on ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
