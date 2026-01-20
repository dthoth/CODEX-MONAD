# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CODEX-MONAD is a portable, offline-first consciousness technology suite combining browser-based apps with an Electron wrapper and CLI system. Zero external dependencies at runtime. Syncs across multiple devices (MacBook Air, IBISX, Mini PC, ThinkPad) through Git.

## Commands

```bash
# Development
npm start                 # Run Electron app in portable mode
npm run dev               # Run with --dev flag
npm run doctor            # System health check (Node, NPM, data/ writable)
npm run smoke             # Smoke test

# Building
npm run build             # Build with electron-builder
npm run portable-win      # Windows portable build
npm run portable-mac      # macOS build
npm run portable-linux    # Linux AppImage

# No GPU mode (for compatibility)
npm run start:nogpu

# CI
npm run ci:preflight      # npm ci && doctor && smoke
```

## Architecture

### Entry Points
- `index.html` - DIN Portal (main browser interface, works without Electron)
- `main.js` - Electron wrapper (loads `shell.html` which hosts portal in webview)
- `bootstrap/` - CLI installer scripts for Fish (macOS), PowerShell (Windows), Bash (Linux)

### Orchestration Layer
- `hineni-hub.js` - **Single source of truth** for all app registrations. Defines categories (web-apps, toolbox-cli, macos-utilities, hineni-system, etc.) and renders the hub dynamically.
- `codex-apps.json` - JSON manifest of CODEX-MONAD apps (loaded by hineni-hub.js)
- `apps/manifest.json` - Alternative manifest used by Electron's main.js for `apps:list` IPC

### Application Layer (apps/)
13 applications, each with its own `app.json` metadata file.

**Core Trinity:**
- `polywrite/` - Multi-dimensional writing environment
- `pearl/` - AI conversation interface
- `codex-ark/` - Visual tamper detection/archival witness system (entry: `codex-ark-witness.html`)

**Other Apps:** bureaucratic_universe, codex_capture, codex_monad, conflict_lab, din_portal, pranayama, royal_game_of_ur, samson_recursive, vault, word_salad

### Shared Libraries (lib/)
- `hub-loader.js` - Dynamic app loading
- `codex-portal-enhanced.js` - Enhanced portal features
- `lib_*.js` - Utility libraries (consciousness-bridge, polywrite-utils, qr-whisper-enhanced, etc.)

### Data Layer
- `data/user-sync/` - Git-tracked user data (notes, dragon_wisdom_log.txt)
- `data/capture/` - Captured content
- Portable mode: All user data stored under `./data` when `PORTABLE_MODE=1`

## App Registration

Apps are registered in multiple places (to be consolidated):
1. `hineni-hub.js` - HUB_CATEGORIES array (primary for portal display)
2. `codex-apps.json` - JSON manifest (loaded dynamically)
3. `apps/manifest.json` - Used by Electron main.js

Each app in `apps/` should have an `app.json` with:
```json
{
  "id": "app_name",
  "name": "Display Name",
  "kind": "html|python|bash",
  "entry": "index.html"
}
```

## Key Patterns

- **Local-first**: All apps run entirely in browser with localStorage persistence
- **Portable mode**: Set `PORTABLE_MODE=1` to store all data under `./data`
- **Dual structure**: Some apps exist as both standalone `.html` files in root AND as `apps/[name]/` directories (transition phase)
- **Relative paths**: hineni-hub.js uses `hubPath` for local apps (e.g., `apps/polywrite/index.html`)

## CLI Commands (after bootstrap install)

| Command | Description |
|---------|-------------|
| `morning` | Full morning dashboard with dragon fortune |
| `dragon` | Random wisdom fortune |
| `keeper` | Save last fortune to log |
| `qn "note"` | Quick note capture |
| `codex` | Navigate to repo, show git status |
| `gui` | Open portal in browser |
| `sync` | Git pull |
| `ship "msg"` | Git add/commit/push |
| `fleet` | Status of all repos |

## Multi-Device Sync

Fleet sync via Git to `data/user-sync/`. Configure `$CODEX_REPO` environment variable to repo path.

## Important Files

- `hineni-hub.js:49-633` - HUB_CATEGORIES definition (all app registrations)
- `main.js:87-108` - Electron IPC handlers for apps
- `index.html` - Portal entry point
- `docs/ARCHITECTURE.md` - Detailed architecture documentation
