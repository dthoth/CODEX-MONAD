# CODEX-MONAD Architecture Documentation
**Generated:** January 19, 2026  
**Version:** 1.0  
**Status:** Post-Portal Overhaul

---


CODEX-MONAD SYSTEM ARCHITECTURE
================================

┌─────────────────────────────────────────────────────────────────────┐
│                           ENTRY POINTS                              │
├─────────────────────────────────────────────────────────────────────┤
│  • index.html (DIN Portal) - Main hub interface                    │
│  • Electron App (main.js) - Native wrapper                         │
│  • CLI Commands (bootstrap) - Terminal access                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│  hineni-hub.js                                                      │
│  ├─ 9 Categories (web-apps, toolbox, macos-utilities, etc)        │
│  ├─ 55+ Registered Items                                           │
│  └─ Dynamic Rendering System                                       │
│                                                                     │
│  lib/                                                              │
│  ├─ hub-loader.js (17.9 KB) - Dynamic app loading                 │
│  ├─ codex-portal-enhanced.js (23.4 KB) - Enhanced portal          │
│  └─ 15+ shared utilities                                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│  apps/ (13 applications)                                           │
│                                                                     │
│  CORE TRINITY:                                                     │
│  ├─ ✍️ PolyWrite Pro (127 KB) - Writing environment               │
│  ├─ 💎 Pearl (164 KB) - AI conversation companion                 │
│  └─ 📦 CODEX-ARK (51 KB) - Archival witness system               │
│                                                                     │
│  CONSCIOUSNESS TOOLS:                                              │
│  ├─ 🚪 DIN Portal (931 KB, 45 files) - Navigation system          │
│  ├─ 🌱 Codex Monad (180 KB, 55 files) - Core system              │
│  └─ 🫁 Pranayama (24 KB) - Breath work                           │
│                                                                     │
│  CREATIVE/ANALYSIS:                                                │
│  ├─ 🥗 Word Salad (152 KB) - Text experimentation                 │
│  ├─ ⚡ Conflict Lab (100 KB) - Conflict resolution                │
│  └─ 🎭 CODEX Capture - Content capture                            │
│                                                                     │
│  SYSTEM/UTILITY:                                                   │
│  ├─ 🔐 CODEX Vault (78 KB) - Secure storage                       │
│  ├─ 🏛️ Bureaucratic Universe - Forms system                       │
│  ├─ ♾️ Samson's Recursive (84 KB) - Meta homepage                 │
│  └─ 🎲 Royal Game of Ur (38 KB) - Ancient game                    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  data/                                                             │
│  ├─ user-sync/                                                     │
│  │  └─ notes/ (29 markdown files)                                 │
│  ├─ capture/ - Captured content                                   │
│  └─ vault/ - Encrypted storage                                    │
│                                                                     │
│  data_sources/ - External data feeds                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DOCUMENTATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│  docs/ (14 markdown files)                                         │
│  ├─ APPS.md - Application catalog                                 │
│  ├─ DATA_FLOW.md - Information pipeline                           │
│  ├─ CLI-REFERENCE.md - Command reference                          │
│  └─ CODEX_INSTALL_GUIDE.md - Setup guide                         │
└─────────────────────────────────────────────────────────────────────┘

KEY ARCHITECTURAL PATTERNS:
───────────────────────────
1. Single Source of Truth: hineni-hub.js defines all apps
2. Dynamic Rendering: No hardcoded app lists
3. Portable First: Electron + file-based data
4. Consciousness-Centric: Apps designed for awareness/presence
5. Local-First: No external dependencies for core functions


---


DISCOVERED PATTERNS & INSIGHTS:
================================

1. CONSCIOUSNESS-FIRST ARCHITECTURE
   ────────────────────────────────
   • Apps named after concepts: Pearl (wisdom), Pranayama (breath)
   • Focuses: Self-watching, Sacred compression, Consciousness bridge
   • Philosophy: Technology serving awareness, not distraction

2. LAYERED REDUNDANCY
   ──────────────────
   • CLI commands (bootstrap) + GUI (index.html) + Electron wrapper
   • Multiple entry points ensure resilience
   • Can work headless (CLI) or visual (portal)

3. EVOLUTION VISIBLE IN ARCHIVE
   ───────────────────────────────
   • pearl_v0.9_stable_base.html (148 KB) → pearl/index.html (164 KB)
   • Old portal design preserved in index_simple_portal.html
   • Shows iterative refinement over time

4. METADATA STANDARDIZATION
   ────────────────────────
   • All 13 apps now have app.json
   • Consistent v1.0.0 versioning (except Vault v2.0.0, Word Salad v5.0.0)
   • Author field: "Rev. LL Dan-i-El Thomas / Simbell Trust Consulting"

5. DUAL STRUCTURE PATTERN
   ───────────────────────
   • Some apps exist as standalone .html (e.g., polywrite.html)
   • AND as apps/polywrite/ directory
   • Transition phase from standalone to modular

6. HEAVY RELIANCE ON SHARED LIBS
   ──────────────────────────────
   • 17 library files in lib/
   • Pattern: lib_[name].js for specialized utilities
   • Portal-specific: hub-loader, codex-portal-enhanced
   • Consciousness-specific: consciousness-bridge, wasm-chakra-mandala

7. DIN PORTAL AS META-SYSTEM
   ──────────────────────────
   • Largest app (931 KB, 45 files)
   • Contains its own portal system within the portal
   • Recursive documentation structure
   • "Portal within portal" architecture

8. PORTABILITY AS CORE VALUE
   ─────────────────────────
   • PORTABLE_MODE env variable
   • All data under ./data when portable
   • No external dependencies for core functions
   • Electron enables cross-platform deployment

9. BOOTSTRAPPING PHILOSOPHY
   ────────────────────────
   • Self-contained initialization
   • OS-specific install scripts
   • Creates CLI aliases: morning, dragon, keeper, gui, sync, ship
   • "Plug and play" consciousness infrastructure

10. NAMING AS INTENTION
    ───────────────────
    • "HINENI" (Hebrew: "Here I am") - presence/awareness
    • "DIN" (Hebrew: "Judgment/Law") - structure/order
    • "CODEX" - book of wisdom/knowledge
    • "MONAD" - fundamental unity/wholeness
    • Names encode philosophical stance

11. HYBRID DEVELOPMENT APPROACH
    ──────────────────────────────
    • HTML/CSS/JS for apps (web-first)
    • Python for build tools (build_site.py)
    • PowerShell/Bash for system scripts
    • Node.js/Electron for native wrapper
    • Multi-paradigm toolkit

12. WITNESS & ARCHIVE EMPHASIS
    ──────────────────────────────
    • CODEX-ARK app for tamper detection
    • Vault app for secure storage
    • user-sync/notes/ for ongoing documentation
    • "Witness protocol" mentioned in docs
    • Preservation as first-class concern


---

## Technical Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Core app development
- **Web Components** - Modular app architecture
- **Dynamic Rendering** - Runtime app loading via hineni-hub.js

### Backend/Runtime
- **Electron** - Cross-platform native wrapper
- **Node.js** - Build tools and system integration
- **Python** - Build scripts (build_site.py)
- **PowerShell/Bash** - System automation

### Data Layer
- **File-based Storage** - Portable, no database required
- **JSON** - Metadata and configuration
- **Markdown** - Documentation and notes
- **Local-First** - No cloud dependencies

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **electron-builder** - Native packaging
- **Bootstrap Scripts** - Quick setup across platforms

---

## Directory Structure

```
CODEX-MONAD/
├── apps/                    # 13 applications (all with app.json)
│   ├── polywrite/          # ✍️ Writing environment
│   ├── pearl/              # 💎 AI companion
│   ├── codex-ark/          # 📦 Archive witness
│   ├── din_portal/         # 🚪 Meta-portal (931 KB, 45 files)
│   └── ...                 # 9 more apps
├── lib/                    # 17 shared libraries
│   ├── hub-loader.js       # Dynamic app loading
│   ├── codex-portal-enhanced.js
│   └── lib_consciousness-bridge.js
├── data/                   # User data (portable mode)
│   ├── user-sync/notes/    # 29 markdown notes
│   ├── capture/            # Captured content
│   └── vault/              # Encrypted storage
├── docs/                   # 14 documentation files
│   ├── APPS.md
│   ├── DATA_FLOW.md
│   └── CLI-REFERENCE.md
├── bootstrap/              # OS-specific installers
│   ├── windows/
│   ├── macos/
│   └── linux/
├── scripts/                # Automation scripts
├── _ARCHIVE_OLD/           # Legacy/archived code
├── index.html              # DIN Portal (main entry)
├── hineni-hub.js           # Central registry (30 KB)
├── main.js                 # Electron main process
└── package.json            # npm configuration
```

---

## App Catalog

### Core Trinity (Top Position)
1. **PolyWrite Pro** (v1.0.0) - 127 KB - Multi-editor writing environment
2. **Pearl** (v1.0.0) - 164 KB - AI conversation companion
3. **CODEX-ARK** (v1.0.0) - 51 KB - Archival witness system

### Full App List
- Bureaucratic Universe (v1.0.0) - Forms/notices system
- CODEX Capture (v1.0.0) - Content capture
- Codex Monad (v1.0.0) - Core system (180 KB, 55 files)
- Conflict Lab (v1.0.0) - Conflict resolution
- DIN Portal (v1.0.0) - Navigation meta-system
- Pranayama (v1.0.0) - Breathwork practice
- Royal Game of Ur (v1.0.0) - Ancient game
- Samson's Recursive (v1.0.0) - Meta homepage
- CODEX Vault (v2.0.0) - Secure storage
- Word Salad (v5.0.0) - Text experimentation

---

## Key Architectural Decisions

### 1. Single Source of Truth
**Decision:** All app registration in hineni-hub.js  
**Rationale:** Eliminates duplicate hardcoded cards, enables dynamic rendering  
**Impact:** Reduced technical debt by 116 lines, improved maintainability

### 2. Portable-First Design
**Decision:** File-based data, no external dependencies  
**Rationale:** True user sovereignty, offline-capable  
**Impact:** Works anywhere, no vendor lock-in

### 3. Multi-Interface Access
**Decision:** CLI + GUI + Native wrapper  
**Rationale:** Serve different user workflows  
**Impact:** Power users get CLI, visual users get portal

### 4. Consciousness-Centric Naming
**Decision:** Hebrew/philosophical names (HINENI, DIN, MONAD)  
**Rationale:** Encode intention and awareness into system  
**Impact:** Unique positioning, coherent philosophy

### 5. Metadata-Driven Discovery
**Decision:** app.json standardization  
**Rationale:** Enable automated registration and cataloging  
**Impact:** All 13 apps now discoverable

---

## Data Flow

```
User Input
    ↓
Apps (polywrite, pearl, etc.)
    ↓
data/user-sync/notes/
    ↓
Git Sync (via CLI)
    ↓
GitHub Repository
    ↓
Other Devices (Mini PC, etc.)
```

---

## Recent Evolution

### Portal Architecture Overhaul (Jan 19, 2026)
- Removed 116 lines of hardcoded portal-grid
- Implemented single source of truth
- Established Core Trinity positioning
- Pearl app fully integrated
- All apps now dynamic from hineni-hub.js

### Metadata Standardization (Jan 19, 2026)
- 13 apps now have app.json
- Consistent v1.0.0 versioning
- Author field standardized
- Fixed BOM encoding issues

---

## Known Technical Debt

1. **Standalone HTML Migration** - 6 files need app directories
2. **Dual Structure** - Some apps exist as both .html and apps/
3. **Testing** - No automated test framework
4. **Mobile** - Not responsive yet
5. **Documentation** - APPS.md needs update

---

## Future Roadmap

### Phase 1 (This Week)
- Complete standalone HTML migration
- Version bump to v1.1.0
- Test sync across devices
- Update APPS.md

### Phase 2 (This Month)
- Add smoke tests
- Responsive design
- Enhanced Pearl AI
- Backup/restore system

### Phase 3 (This Quarter)
- Plugin architecture
- Data pipeline automation
- Community documentation
- Public beta

---

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Building Portable Apps
```bash
npm run portable-win  # Windows
npm run portable-mac  # macOS
npm run portable-linux # Linux
```

### CLI Commands (After Bootstrap)
```bash
morning         # Daily ritual
dragon          # Fortune
gui             # Launch portal
sync -All       # Sync all repos
ship "message"  # Commit and push
```

---

## Philosophy

CODEX-MONAD is not just software—it's a spiritual practice encoded in code.

- **HINENI** (Here I am) - Presence/awareness
- **DIN** (Judgment/Law) - Structure/order
- **CODEX** - Book of wisdom
- **MONAD** - Fundamental unity

Every name, every library, every command reflects this consciousness-first approach.

---

## Contact & Contribution

**Author:** Rev. LL Dan-i-El Thomas / Simbell Trust Consulting  
**Repository:** CODEX-MONAD (GitHub)  
**License:** TBD

---

*This document was generated through deep system exploration on January 19, 2026.*
