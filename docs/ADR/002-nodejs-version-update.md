# ADR-002: Node.js Version Update to v24

**Date:** 2026-01-06

**Status:** Accepted

## Context

The project currently requires Node.js version 18 or later (as specified in `package.json` engines field). Node.js releases follow a regular schedule with new major versions released semi-annually. Node.js 24 represents the latest long-term support (LTS) version with improved performance, security updates, and modern JavaScript features.

Key considerations:
- Node.js 18 enters maintenance mode in October 2024
- Node.js 24 provides better performance and newer ECMAScript features
- Modern tooling and dependencies increasingly target newer Node.js versions
- GitHub Actions and CI environments support Node.js 24

## Decision

Update the minimum required Node.js version to v24. This change affects:

1. **package.json**: Update `engines.node` field to require `">=24"`
2. **CI/CD Pipeline**: Update GitHub Actions workflow to test against Node.js 24
3. **Documentation**: Update README and installation instructions to reflect new requirement
4. **Development**: All contributors must use Node.js 24 or later

We will remove Node.js 18 and 20 from the CI test matrix and focus testing on Node.js 24, as maintaining compatibility with older versions provides diminishing returns given the maturity of the Node.js ecosystem.

## Consequences

### Positive

- **Performance Improvements**: Node.js 24 includes V8 engine upgrades and performance optimizations
- **Modern JavaScript Features**: Access to latest ECMAScript features without transpilation
- **Security**: Latest security patches and vulnerability fixes
- **Simplified Testing**: Testing against a single, modern Node.js version reduces CI complexity
- **Future-Proofing**: Positions the project to take advantage of future Node.js improvements
- **Better Type Support**: Improved compatibility with modern TypeScript and type definitions

### Negative

- **Breaking Change**: Users on older Node.js versions must upgrade to use new versions of this tool
- **Potential User Impact**: Organizations with strict Node.js version policies may be unable to upgrade immediately
- **Migration Barrier**: Existing users must ensure their environment supports Node.js 24

### Neutral

- **Ecosystem Alignment**: Most modern Node.js tools and packages already target recent versions
- **CI/CD Configuration**: Must update workflow files but this is a one-time change

## Migration Path for Users

Users currently on Node.js 18 or 20 have several options:

1. **Upgrade Node.js**: Install Node.js 24 using nvm, n, or direct installation
2. **Use npx**: Run the tool via `npx` which can use a different Node.js version
3. **Stay on Previous Version**: Continue using an older version of create-dmg that supports Node.js 18

## References

- [Node.js Release Schedule](https://github.com/nodejs/release#release-schedule)
- [Node.js 24 Release Notes](https://nodejs.org/en/blog/release/)
- [GitHub Actions Node.js Setup](https://github.com/actions/setup-node)
