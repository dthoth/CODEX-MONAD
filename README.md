# 🌱 CODEX-MONAD

**A Comprehensive Ecosystem for Knowledge Work, Creative Expression, and Personal Development**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-Latest-blue.svg)](https://www.electronjs.org/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Core Applications](#core-applications)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CODEX-MONAD is an integrated ecosystem of 13 interconnected applications built on Electron, designed to support:

- ✍️ **Writing & Composition** - PolyWrite Pro for multi-dimensional writing
- 💎 **AI Assistance** - Pearl for focused dialogue and conversation
- 🔏 **Document Integrity** - CODEX-ARK for cryptographic witnessing
- 🚪 **Navigation** - DIN Portal as the central hub
- 🔐 **Security** - CODEX Vault for secure secret management
- 📊 **Analysis** - Tools for text analysis and pattern detection
- 🎮 **Recreation** - Games and wellness applications
- 🏗️ **Knowledge Organization** - CODEX V3 pipeline for content management

### Philosophy

CODEX-MONAD embodies the principle of **"hineni"** (הנני - "Here I am") - being fully present and ready. Each application is designed to support focused, intentional work while maintaining awareness of the broader ecosystem.

---

## Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher
- **Git**
- **Python** 3.7+ (optional, for some tools)
- **PowerShell** 5.1+ (Windows) or **Bash** (macOS/Linux)

### Installation

```bash
# Clone the repository
git clone https://github.com/dthoth/CODEX-MONAD.git
cd CODEX-MONAD

# Install dependencies
npm install

# Bootstrap your platform (optional but recommended)
# Windows:
powershell -ExecutionPolicy Bypass -File bootstrap/windows/install.ps1

# macOS:
bash bootstrap/macos/install.sh

# Linux:
bash bootstrap/linux/install.sh
```

### Launch

```bash
# Start CODEX-MONAD
npm start

# Or use platform-specific launchers:
# Windows: scripts\START_WINDOWS.bat
# macOS/Linux: ./scripts/START_MAC_LINUX.sh
```

---

## Core Applications

### 🔱 The Core Trinity

The foundational pillars of CODEX-MONAD:

#### 1. ✍️ PolyWrite Pro
Multi-dimensional writing environment with advanced composition tools.

- Distraction-free writing
- Multiple draft management
- Creative exploration tools
- [Full Documentation →](docs/apps/polywrite.md)

#### 2. 💎 Pearl
Minimalist AI conversation interface and writing companion.

- Clean, focused interface
- AI-assisted thinking
- Context-aware responses
- [Full Documentation →](docs/apps/pearl.md)

#### 3. 🔏 CODEX-ARK Witness
Visual tamper detection and archival witness system.

- Cryptographic fingerprints
- Visual recognition
- Document verification
- [Full Documentation →](docs/apps/codex-ark.md)

### 🚪 Gateway Applications

#### DIN Portal
Dynamic Intelligent Navigation portal - the main entry point to the CODEX ecosystem.

- Central navigation hub
- App launcher
- Quick access to all tools
- [Full Documentation →](docs/apps/din_portal.md)

### 📱 All Applications

CODEX-MONAD includes **13 applications**:


#### 📝 Productivity & Writing

- ✍️ **PolyWrite Pro** - Multi-dimensional writing environment with advanced composition tools
- 💎 **Pearl** - Minimalist AI conversation interface and writing companion for focused dialogue
- 🎭 **CODEX Capture** - The Baseline Triangle: Keystrokes, Clipboard, Window Context
- 🥗 **Word Salad Laboratory** - Advanced text analysis and generation tool for linguistic pattern detection and word chaos experiments

#### 🔐 Security & Privacy

- 🔏 **CODEX-ARK Witness** - Visual tamper detection and archival witness system - cryptographic fingerprints you recognize by sight
- 🔐 **CODEX Vault** - Portable symmetric secret store with physical key support

#### ⚡ Analysis & Tools

- ⚡ **Conflict Lab** - Interactive laboratory for exploring and resolving conflicts through structured analysis
- 🏛️ **Bureaucratic Universe** - Interactive exploration of bureaucratic systems and organizational dynamics

#### 🎮 Games & Wellness

- 🎲 **Royal Game of Ur** - Ancient Mesopotamian board game reimagined for digital play
- 🫁 **Pranayama** - Breathwork practice guide and timer for conscious breathing exercises

#### 🏗️ System & Foundation

- 🌱 **Codex Monad Seedline** - The foundational entry point to the CODEX-MONAD ecosystem
- 🚪 **DIN Portal** - Dynamic Intelligent Navigation portal for CODEX ecosystem exploration
- ♾️ **Samson's Recursive Homepage** - Self-referential homepage exploring recursive patterns and meta-documentation


**[📱 Complete App Catalog →](docs/APPS_CATALOG.md)**

---

## Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                     CODEX-MONAD Ecosystem                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │  Electron    │    │  hineni-hub  │    │   Registry   │    │
│  │   Shell      │◄───┤    .js       │◄───┤ codex-apps   │    │
│  │              │    │              │    │    .json     │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│         │                    │                    │           │
│         └────────────────────┴────────────────────┘           │
│                              │                                │
│                              ↓                                │
│         ┌────────────────────────────────────────┐            │
│         │          Applications Layer            │            │
│         │  ┌──────┐  ┌──────┐  ┌──────┐         │            │
│         │  │ HTML │  │Python│  │ Bash │   ...   │            │
│         │  │ Apps │  │ Apps │  │ Apps │         │            │
│         │  └──────┘  └──────┘  └──────┘         │            │
│         └────────────────────────────────────────┘            │
│                              │                                │
│                              ↓                                │
│         ┌────────────────────────────────────────┐            │
│         │      CODEX V3 Pipeline (Optional)      │            │
│         │  File Organization & Knowledge Base    │            │
│         └────────────────────────────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Electron Shell** - Desktop application framework
2. **hineni-hub.js** - Application launcher and coordinator
3. **App Registry** - Application catalog and metadata
4. **Individual Apps** - Self-contained applications
5. **CODEX V3 Pipeline** - Optional file organization system

**[🏗️ Detailed Architecture →](docs/ARCHITECTURE.md)**

---

## Documentation

### 📚 Complete Documentation Index

| Document | Description |
|----------|-------------|
| [Apps Catalog](docs/APPS_CATALOG.md) | Complete listing of all 13 applications |
| [Architecture](docs/ARCHITECTURE.md) | System architecture and design |
| [Infrastructure](docs/INFRASTRUCTURE.md) | hineni-hub and registry system |
| [CODEX V3 Pipeline](docs/CODEX_V3_PIPELINE.md) | File organization pipeline |
| [CLI Tools](docs/CLI_TOOLS.md) | Command-line tools and scripts |
| [Directory Tree](docs/DIRECTORY_TREE.md) | File structure reference |

### 📖 Individual App Documentation

Each application has detailed documentation in `docs/apps/`:

- [Bureaucratic Universe](docs/apps/bureaucratic_universe.md)
- [CODEX Capture](docs/apps/codex_capture.md)
- [CODEX Vault](docs/apps/vault.md)
- [CODEX-ARK Witness](docs/apps/codex-ark.md)
- [Codex Monad Seedline](docs/apps/codex_monad.md)

- _[...and 8 more](docs/apps/)_

---

## Installation

### System Requirements

- **OS:** Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 500MB for application, varies for data
- **Display:** 1280x720 minimum resolution

### Detailed Installation

See [CODEX Install Guide](docs/CODEX_INSTALL_GUIDE.md) for platform-specific instructions.

---

## Usage

### Basic Workflow

1. **Launch** CODEX-MONAD
   ```bash
   npm start
   ```

2. **Navigate** to desired app from DIN Portal

3. **Work** within the focused application

4. **Switch** between apps as needed

5. **Organize** content with CODEX V3 (optional)

### Advanced Features

- **Fleet Sync** - Run on multiple machines with shared config
- **Custom Apps** - Add your own applications to the registry
- **Automation** - Use CLI tools for batch operations
- **Integration** - Connect with external tools and services

---

## Development

### Project Structure

```
CODEX-MONAD/
├── apps/                    # Application collection
│   ├── polywrite/          # PolyWrite Pro
│   ├── pearl/              # Pearl AI
│   ├── din_portal/         # DIN Portal
│   └── .../                # 10 more apps
├── bootstrap/              # Platform setup scripts
│   ├── windows/
│   ├── macos/
│   └── linux/
├── docs/                   # Documentation
├── lib/                    # Shared libraries
├── scripts/                # Utility scripts
├── codex-apps.json         # App registry
├── hineni-hub.js           # Main launcher
├── main.js                 # Electron main process
├── package.json            # Dependencies
└── README.md               # This file
```

### Adding a New App

1. Create app directory: `apps/my_app/`
2. Add entry point: `apps/my_app/index.html`
3. Register in `codex-apps.json`
4. Restart CODEX-MONAD

---

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 Performance optimizations
- 🧪 Test coverage

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Rev. LL Dan-i-El Thomas** - Original vision and development
- **Simbell Trust Consulting** - Support and resources
- **CODEX_FORGE** - Ongoing development and maintenance
- **Contributors** - Everyone who has contributed to the project

---

## Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/dthoth/CODEX-MONAD/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dthoth/CODEX-MONAD/discussions)

---

## Project Status

**Status:** Active Development  
**Version:** 1.x  
**Last Updated:** 2026-01-20

### Recent Updates

- ✅ Comprehensive documentation system
- ✅ 13 active applications
- ✅ Cross-platform support
- ✅ CODEX V3 pipeline integration
- ✅ Fleet sync architecture

---

*"Here I am" - הנני*

**CODEX-MONAD: A complete ecosystem for conscious knowledge work.**
