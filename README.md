# create-dmg-ts

> Create a good-looking [DMG](https://en.wikipedia.org/wiki/Apple_Disk_Image) for your macOS app in seconds

[![CI](https://github.com/Romerolweb/create-dmg-ts/workflows/CI/badge.svg)](https://github.com/Romerolweb/create-dmg-ts/actions)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

This is a TypeScript-based evolution of [create-dmg](https://github.com/sindresorhus/create-dmg) with enhanced type safety, modern tooling, and comprehensive documentation.

Imagine you have finished a macOS app, exported it from Xcode, and now want to distribute it to users. The most common way of distributing an app outside the Mac App Store is by putting it in a `.dmg` file. These are hard to create, especially good-looking ones. You can either pay for a GUI app where you have to customize an existing design or you can run some homebrewed Bash script and you still have to design it. This tool does everything for you, so you can play with your 🐈 instead.

<img src="screenshot-cli.gif">

*This tool is intentionally opinionated and simple.*

## Features

- 🎨 **Beautiful Design**: Automatic background, icon composition, and layout
- 🔐 **Code Signing**: Automatic signing with Developer ID certificates
- 📦 **Zero Configuration**: Works out of the box with sensible defaults
- ⚡ **Fast**: Creates production-ready DMGs in seconds
- 🛡️ **Type Safe**: Built with strict TypeScript for reliability
- 📚 **Well Documented**: Comprehensive guides with Mermaid diagrams

## Install

Requires [Node.js](https://nodejs.org) version **24 or later**.

```sh
npm install --global create-dmg-ts
```

Or use directly with `npx`:

```sh
npx create-dmg-ts YourApp.app
```

## Quick Start

```sh
# Create a DMG in the current directory
create-dmg YourApp.app

# Specify a destination directory
create-dmg YourApp.app ./dist

# Custom options
create-dmg --overwrite --identity="Developer ID Application" YourApp.app
```

## Usage

```
$ create-dmg --help

  Usage
    $ create-dmg <app> [destination]

  Options
    --overwrite                  Overwrite existing DMG with the same name
    --no-version-in-filename     Exclude version number from DMG filename
    --identity=<value>           Manually set code signing identity (automatic by default)
    --dmg-title=<value>          Manually set DMG title (must be <=27 characters) [default: App name]
    --no-code-sign               Skip code signing the DMG

  Examples
    $ create-dmg 'Lungo.app'
    $ create-dmg 'Lungo.app' Build/Releases
    $ create-dmg --no-code-sign 'MyApp.app'
```

## Documentation

- 📖 **[Complete Documentation](docs/README.md)** - Full usage guide with architecture diagrams
- 🔐 **[Code Signing Guide](docs/code-signing.md)** - Comprehensive code signing and notarization guide
- 🤝 **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute to the project
- 📋 **[Architecture Decisions](docs/ADR/)** - Architecture Decision Records (ADRs)

## DMG Output

The DMG requires macOS 10.13 or later and has the filename `App Name 0.0.0.dmg` (e.g., `Lungo 1.0.0.dmg`).

The tool automatically signs the DMG with your Developer ID certificate if available. The DMG is still created successfully even if code signing fails (e.g., if you don't have a developer certificate). Use `--no-code-sign` to skip code signing entirely.

**Important:** Don't forget to [notarize your DMG](docs/code-signing.md#step-3-notarization) for distribution. See our [comprehensive code signing guide](docs/code-signing.md) for details.

<img src="screenshot-dmg.png" width="772">

## Code Signing & Notarization

create-dmg-ts **supports**:
- ✅ Developer ID Application signing (direct distribution)
- ✅ Local development certificates (testing)
- ✅ Automatic certificate detection

create-dmg-ts **does not automatically handle**:
- ❌ Notarization (must be done separately with `notarytool`)
- ❌ App Store submission (use `productbuild` instead)

For complete instructions on code signing, notarization, and distribution, see the **[Code Signing Guide](docs/code-signing.md)**.

### Quick Notarization Example

After creating your DMG:

```bash
# Submit for notarization
xcrun notarytool submit "YourApp 1.0.0.dmg" \
  --keychain-profile "NotaryProfile" \
  --wait

# Staple the notarization ticket
xcrun stapler staple "YourApp 1.0.0.dmg"
```

See the [complete notarization guide](docs/code-signing.md#step-3-notarization) for setup and details.

## Software License Agreement

If `license.txt`, `license.rtf`, or `sla.r` ([raw SLAResources file](https://download.developer.apple.com/Developer_Tools/software_licensing_for_udif/slas_for_udifs_1.0.dmg)) is present in the same directory as the app, it will be added as a software agreement when opening the DMG. Users must agree to the license before the disk image mounts.

**Requirement**: `/usr/bin/rez` from [Command Line Tools for Xcode](https://developer.apple.com/download/more/) must be installed.

## DMG Icon

[GraphicsMagick](http://www.graphicsmagick.org) is required to create a custom DMG icon based on the app icon and the macOS disk icon.

```sh
# Install via Homebrew
brew install graphicsmagick imagemagick
```

If GraphicsMagick is not installed, the tool falls back to the standard macOS disk icon.

### Icon Example

Original app icon → Composed DMG icon

<img src="icon-example-app.png" width="300"><img src="icon-example.png" width="300">

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Romerolweb/create-dmg-ts.git
cd create-dmg-ts

# Install dependencies (requires macOS)
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

See the [Contributing Guide](docs/CONTRIBUTING.md) for detailed development instructions.

## What's New in TypeScript Version?

This TypeScript version includes:

- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Modern Tooling**: ESLint, Husky, lint-staged for code quality
- **Node.js 24**: Uses latest Node.js features and performance improvements
- **Better Testing**: Native Node.js test runner with unit and integration tests
- **Enhanced Documentation**: Mermaid diagrams, comprehensive code signing guide, ADRs
- **Pre-commit Hooks**: Automatic type checking and linting before commits

See [ADR-001: Migration to TypeScript](docs/ADR/001-typescript-migration.md) for the complete rationale.

## Platform Requirements

- **Operating System**: macOS only (uses macOS-specific tools like `hdiutil`, `codesign`)
- **Node.js**: Version 24 or later
- **Xcode Command Line Tools**: Required for building and signing
- **GraphicsMagick**: Optional, for custom icon composition

## Related Projects

- [Defaults](https://github.com/sindresorhus/Defaults) - Swifty and modern UserDefaults
- [LaunchAtLogin](https://github.com/sindresorhus/LaunchAtLogin) - Add "Launch at Login" functionality to your macOS app
- [node-appdmg](https://github.com/LinusU/node-appdmg) - The underlying DMG creation library

## Credits

- **Original create-dmg**: [Sindre Sorhus](https://sindresorhus.com)
- **TypeScript version**: [Romerolweb](https://github.com/Romerolweb)

## License

MIT © [Sindre Sorhus](https://sindresorhus.com) (original JavaScript version)

MIT © [Romerolweb](https://github.com/Romerolweb) (TypeScript version)
