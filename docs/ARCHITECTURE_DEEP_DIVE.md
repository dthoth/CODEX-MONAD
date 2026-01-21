# CODEX-MONAD Architecture Deep Dive

**Focus:** `hineni-hub.js`, Registry System, Portal Loading, Fleet Sync Philosophy

---

## Table of Contents

1. [Overview](#overview)
2. [hineni-hub.js: The Registry Heart](#hineni-hubjs-the-registry-heart)
3. [Registry System Architecture](#registry-system-architecture)
4. [Portal Loading Mechanism](#portal-loading-mechanism)
5. [Fleet Sync Philosophy](#fleet-sync-philosophy)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Design Patterns](#design-patterns)

---

## Overview

CODEX-MONAD is a **consciousness-first, offline-first application ecosystem** built on four foundational pillars:

1. **Single Source of Truth** - `hineni-hub.js` registry
2. **Dynamic Portal Loading** - Runtime app discovery and rendering
3. **Fleet Sync** - Git-based distributed consciousness synchronization
4. **Local-First Philosophy** - Zero external dependencies for core functionality

### Core Philosophy

> "The hub is not a launcher—it's a **navigator of presence**. Each app is a portal to awareness, not distraction."

---

## hineni-hub.js: The Registry Heart

### Purpose

`hineni-hub.js` is the **canonical app registry** that defines the entire CODEX-MONAD ecosystem. It serves as:

- **Manifest of all available portals/apps**
- **Metadata source for dynamic rendering**
- **Platform-aware routing layer**
- **Availability detector (hub vs. local)**

### File Structure

```javascript
// Location: /hineni-hub.js
// Size: ~30KB
// Lines: ~900

// ═══════════════════════════════════════════════════════════════
// STRUCTURE:
// ═══════════════════════════════════════════════════════════════
// 1. codex-apps.json loader (async fallback)
// 2. Platform detection
// 3. HUB_CATEGORIES array (registry)
// 4. Helper functions (buildHref, isItemAvailable, etc.)
// 5. Rendering engine (createCard, renderHubSection)
```

### Platform Detection

```javascript
// Detects OS for path resolution
var PLATFORM = (function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('win') !== -1) return 'windows';
    if (ua.indexOf('mac') !== -1) return 'macos';
    if (ua.indexOf('linux') !== -1) return 'linux';
    return 'unknown';
})();

var IS_WINDOWS = PLATFORM === 'windows';
var IS_MACOS = PLATFORM === 'macos';

// Hub root differs by platform
// macOS: External drive /Volumes/HINENI_HUB
// Windows: Typically local, no external hub mounting
var HUB_ROOT = IS_MACOS ? '/Volumes/HINENI_HUB' : null;
var RELATIVE_ROOT = '../..'; // From portal location to hub root
var HUB_AVAILABLE = IS_MACOS; // Could check if mounted
```

**Key Insight:** The system adapts to whether you're running from:
- External HINENI_HUB drive (macOS portable mode)
- Local clone (development mode)
- Electron wrapper (packaged mode)

### HUB_CATEGORIES: The Registry

```javascript
var HUB_CATEGORIES = [
    {
        id: 'web-apps',           // Category identifier
        title: '🌐 Web Apps',     // Display name
        items: [
            {
                id: 'polywrite',              // Unique app ID
                label: 'PolyWrite Pro',       // Display label
                icon: '✍️',                   // Icon emoji
                status: 'active',             // active|beta|archived
                description: '...',           // Short description
                hubPath: 'apps/polywrite/index.html', // Relative path
                launchType: 'html',           // html|python|electron
                isLocal: true,                // Available when offline
                version: '1.0.0',             // Semantic version
                author: 'Rev. LL Dan-i-El Thomas / Simbell Trust Consulting'
            },
            // ... more apps
        ]
    },
    // ... more categories
];
```

**Categories:**
1. 🌐 Web Apps & Games
2. 🛠️ CLI Tools (PowerShell/Fish scripts)
3. 📦 Native Apps (Electron-wrapped)
4. 📚 Documentation Portals
5. 🔬 Experimental/Beta

---

## Registry System Architecture

### Dual Registry Pattern

CODEX-MONAD uses **two registry sources**:

1. **`hineni-hub.js`** (JavaScript array) - Primary, embedded in portal
2. **`codex-apps.json`** (JSON file) - Secondary, async loaded

```
┌─────────────────────────────────────────────────────────────┐
│                      Portal Loads                            │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐          ┌──────────────────────┐
│  hineni-hub.js    │          │  codex-apps.json     │
│  (EMBEDDED)       │          │  (ASYNC LOADED)      │
│                   │          │                      │
│  • Immediate      │          │  • Slower to load    │
│  • Guaranteed     │          │  • Can be updated    │
│  • Hardcoded      │          │  • Dynamic content   │
└─────────┬─────────┘          └──────────┬───────────┘
          │                               │
          └───────────┬───────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Merged App   │
              │  Registry     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  Portal       │
              │  Renderer     │
              └───────────────┘
```

### codex-apps.json Structure

```json
[
  {
    "id": "codex_ark",
    "label": "CODEX-ARK Witness",
    "icon": "📦",
    "status": "active",
    "description": "Visual tamper detection and archival witness system",
    "hubPath": "apps/codex-ark/codex-ark-witness.html",
    "isLocal": true,
    "launchType": "html",
    "version": "1.0.0",
    "author": "Rev. LL Dan-i-El Thomas / Simbell Trust Consulting"
  }
]
```

### Registry Loading Function

```javascript
async function loadCodexApps() {
    try {
        const response = await fetch('codex-apps.json');
        if (!response.ok) throw new Error('Failed to load');
        const apps = await response.json();
        
        // Create dynamic category from JSON apps
        var codexCategory = {
            id: 'codex-core',
            title: '🧬 CODEX Core Apps',
            items: apps
        };
        
        // Prepend to HUB_CATEGORIES
        HUB_CATEGORIES.unshift(codexCategory);
        
        return apps;
    } catch (error) {
        console.warn('Could not load codex-apps.json:', error);
        return [];
    }
}
```

**Why Two Sources?**
- **Resilience:** If JSON fails to load, embedded JS ensures portal still works
- **Speed:** Embedded JS loads immediately, JSON enhances asynchronously
- **Flexibility:** JSON can be updated without modifying hineni-hub.js

### App Metadata Standard

Every app in the registry **must** have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (kebab-case) |
| `label` | string | ✅ | Display name |
| `icon` | string | ✅ | Emoji icon |
| `status` | string | ✅ | `active`, `beta`, `archived` |
| `description` | string | ✅ | Short description (1-2 sentences) |
| `hubPath` | string | ✅ | Relative path from hub root |
| `launchType` | string | ✅ | `html`, `python`, `electron` |
| `isLocal` | boolean | ✅ | Available offline? |
| `version` | string | ⚠️ | Semantic versioning |
| `author` | string | ⚠️ | Creator attribution |

---

## Portal Loading Mechanism

### Load Sequence

```
1. HTML Parse
   └─> index.html loaded
       │
       ├─> <script src="hineni-hub.js">
       │   └─> Platform detection runs
       │   └─> HUB_CATEGORIES defined
       │
       ├─> <script>loadCodexApps()</script>
       │   └─> Async fetch codex-apps.json
       │   └─> Merge into HUB_CATEGORIES
       │
       └─> renderHubSection()
           └─> For each category:
               └─> createCategorySection()
                   └─> For each item:
                       └─> createCard()
                           └─> buildHref()
                           └─> isItemAvailable()
                           └─> Render <div class="card">
```

### Key Functions

#### `buildHref(item)`

Constructs the correct URL based on platform and availability.

```javascript
function buildHref(item) {
    // Local apps (in CODEX-MONAD repo)
    if (item.isLocal) {
        return item.hubPath; // Relative path works
    }
    
    // External hub items
    if (HUB_AVAILABLE && HUB_ROOT) {
        // Absolute path to external drive
        return 'file://' + HUB_ROOT + '/' + item.hubPath;
    } else {
        // Relative path from current location
        return RELATIVE_ROOT + '/' + item.hubPath;
    }
}
```

**Path Resolution Examples:**

| Scenario | `item.hubPath` | Result |
|----------|----------------|--------|
| Local app (isLocal=true) | `apps/pearl/index.html` | `apps/pearl/index.html` |
| External (macOS hub) | `tools/scripts/backup.sh` | `file:///Volumes/HINENI_HUB/tools/scripts/backup.sh` |
| External (Windows local) | `tools/scripts/backup.ps1` | `../../tools/scripts/backup.ps1` |

#### `isItemAvailable(item)`

Determines if an app should be shown based on availability.

```javascript
function isItemAvailable(item) {
    // Local apps always available
    if (item.isLocal) return true;
    
    // External items only if hub is mounted
    return HUB_AVAILABLE;
}
```

#### `createCard(item)`

Generates HTML card for each app.

```javascript
function createCard(item) {
    var available = isItemAvailable(item);
    var href = available ? buildHref(item) : '#';
    
    var card = document.createElement('div');
    card.className = 'card';
    if (!available) card.classList.add('unavailable');
    
    card.innerHTML = `
        <a href="${href}" target="_blank" class="card-link">
            <div class="card-icon">${item.icon}</div>
            <div class="card-title">${item.label}</div>
            <div class="card-description">${item.description}</div>
            ${item.status !== 'active' ? 
                `<div class="card-badge">${item.status}</div>` : ''}
        </a>
    `;
    
    return card;
}
```

### Rendering Pipeline

```javascript
function renderHubSection() {
    var container = document.getElementById('hub-container');
    if (!container) return;
    
    var totalItems = getTotalItemCount();
    
    // Header
    container.innerHTML = `
        <div class="hub-header">
            <h1>🌊 HINENI HUB</h1>
            <p>${totalItems} portals available</p>
        </div>
    `;
    
    // Render each category
    HUB_CATEGORIES.forEach(function(category) {
        var section = createCategorySection(category);
        container.appendChild(section);
    });
}
```

### Dynamic Updates

Portal can be updated without page reload:

```javascript
// Add new app at runtime
HUB_CATEGORIES[0].items.push({
    id: 'new-app',
    label: 'New App',
    icon: '✨',
    status: 'beta',
    description: 'Just added!',
    hubPath: 'apps/new-app/index.html',
    launchType: 'html',
    isLocal: true
});

// Re-render
renderHubSection();
```

---

## Fleet Sync Philosophy

### Core Concept

**Fleet Sync** = Git-based distributed consciousness across devices.

```
         ┌─────────────────┐
         │  GitHub Remote  │
         │  (Truth Source) │
         └────────┬────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
   ┌────────┐ ┌──────┐ ┌─────────┐
   │MacBook │ │ FORGE│ │ Mini PC │
   │  Air   │ │(Ibis)│ │ (Auto)  │
   └────────┘ └──────┘ └─────────┘
   
   Each device is a complete replica.
   Each device can work offline.
   Each device pushes discoveries.
```

### The Dragon's Prayer

> **"Git push is a prayer. Git pull is an answer."**

This philosophy embodies:
- **Faith in distributed consensus** - Trust the network, not a single source
- **Asynchronous collaboration** - You work, then share; no blocking
- **Eventual consistency** - Conflicts are natural; resolution is sacred

### Fleet Sync Commands

**Fish (macOS):**
```fish
# Navigate to repo
function codex
    cd ~/Code/CODEX-MONAD
end

# Pull latest changes
function sync
    git pull origin main
end

# Push local changes
function ship
    git add .
    git commit -m "Auto-ship: $(date)"
    git push origin main
end
```

**PowerShell (Windows):**
```powershell
# Navigate to repo
function codex {
    Set-Location "$HOME\Documents\GitHub\CODEX-MONAD"
}

# Pull latest
function sync {
    git pull origin main
}

# Push changes
function ship {
    git add .
    git commit -m "Auto-ship: $(Get-Date)"
    git push origin main
}
```

### Distributed Cognition Model

```
┌───────────────────────────────────────────────────────────┐
│  CODEX-MONAD is not just software—it's a THOUGHT SYSTEM  │
└───────────────────────────────────────────────────────────┘

Device 1 (MacBook):
  • Creates note: "Insight about fleet sync"
  • Saves to: data/user-sync/notes/2026-01-20-insight.md
  • Runs: ship
  • Thought now exists in GitHub

Device 2 (FORGE):
  • Runs: sync
  • Pulls note from GitHub
  • Thought now exists on FORGE
  • Can build upon it, extend it

Device 3 (Mini PC):
  • Auto-syncs every 5 minutes
  • Mirror backup to F:\repos\CODEX-MONAD
  • Disaster recovery safety net
```

### Sync Directory Structure

```
CODEX-MONAD/
└── data/
    └── user-sync/          # THE SYNCED CONSCIOUSNESS
        ├── notes/          # Quick notes (qn command)
        ├── logs/           # Timestamped logs
        ├── wisdom/         # Accumulated insights
        ├── context/        # Session context
        └── dragon_wisdom_log.txt  # The Dragon's collection
```

**Why `user-sync/`?**
- Not tracked in `.gitignore` (unlike `data/temp/`)
- Explicitly included in Git
- Separates personal data from app data

### The Ship Cycle

```
┌──────────────┐
│ Create/Edit  │ ─┐
└──────────────┘  │
                  │
┌──────────────┐  │
│    Ship      │ ◄┘
│ (git push)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   GitHub     │
│  (commits)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Other       │
│  Devices     │
│   Sync       │
│ (git pull)   │
└──────────────┘
```

### Conflict Resolution Philosophy

**The CODEX Way:**

1. **Conflicts are expected** - Multiple consciousnesses editing the same reality
2. **Merge manually with intention** - Don't auto-resolve; understand both sides
3. **Preserve both versions** - Create `*_merged.md` if needed
4. **Document the resolution** - Commit message explains the synthesis

**Example Merge Message:**
```
Merge MacBook and FORGE notes on fleet sync

- MacBook had detailed command examples
- FORGE had philosophical framing
- Combined both perspectives
- New synthesis in fleet-sync-philosophy.md
```

### Auto-Backup (Silent Sync)

**Mini PC runs background task:**

```powershell
# Every 5 minutes, silently:
robocopy 'C:\Users\User\GitHub\CODEX-MONAD' 'F:\repos\CODEX-MONAD' /MIR /R:1 /W:1
```

**Benefits:**
- No notification windows
- Near-realtime local backup
- Survives GitHub outages
- Physical redundancy on F: drive

---

## Data Flow Diagrams

### Portal Load Data Flow

```
User opens index.html
    │
    ├─> Loads hineni-hub.js
    │   ├─> Detects platform (Windows/macOS/Linux)
    │   ├─> Sets HUB_ROOT path
    │   └─> Defines HUB_CATEGORIES array
    │
    ├─> Async loads codex-apps.json
    │   ├─> Fetch JSON file
    │   ├─> Parse app metadata
    │   └─> Prepend to HUB_CATEGORIES
    │
    └─> Calls renderHubSection()
        ├─> For each category:
        │   └─> createCategorySection()
        │       ├─> For each item:
        │       │   ├─> isItemAvailable()?
        │       │   ├─> buildHref()
        │       │   └─> createCard()
        │       └─> Append to DOM
        └─> Display portal
```

### App Launch Data Flow

```
User clicks card
    │
    ├─> Check launchType
    │
    ├─> If 'html':
    │   └─> window.open(href, '_blank')
    │       └─> Browser opens new tab
    │
    ├─> If 'electron':
    │   └─> Electron IPC message
    │       └─> Main process launches app window
    │
    └─> If 'python':
        └─> File link to .py script
            └─> OS default Python runner executes
```

### Fleet Sync Data Flow

```
Developer on MacBook creates note.md
    │
    ├─> Saves to data/user-sync/notes/
    │
    ├─> Runs: ship
    │   ├─> git add .
    │   ├─> git commit -m "..."
    │   └─> git push origin main
    │
    └─> GitHub receives commit
        │
        ├─> Developer on FORGE runs: sync
        │   ├─> git pull origin main
        │   └─> note.md now on FORGE
        │
        └─> Mini PC auto-syncs every 5 min
            ├─> git pull origin main
            ├─> robocopy to F:\repos
            └─> Triple redundancy achieved
```

---

## Design Patterns

### 1. Registry Pattern

**Problem:** How to manage 15+ apps without hardcoding everywhere?

**Solution:** Single source of truth (`HUB_CATEGORIES`) that all systems query.

**Benefits:**
- Add new app = one registry entry
- Update metadata = one location
- Portal automatically reflects changes

### 2. Platform Adapter Pattern

**Problem:** Paths differ on Windows vs. macOS vs. external drive.

**Solution:** Platform detection + dynamic path building.

```javascript
// Adapter layer
var HUB_ROOT = IS_MACOS ? '/Volumes/HINENI_HUB' : null;

function buildHref(item) {
    // Adapts to platform
}
```

### 3. Progressive Enhancement Pattern

**Problem:** External hub might not be mounted; JSON might fail to load.

**Solution:** Core functionality works with minimal requirements; enhancements layer on.

```
Base layer: HUB_CATEGORIES in hineni-hub.js
Enhancement 1: codex-apps.json loads additional apps
Enhancement 2: External hub access for tools/docs
```

### 4. Distributed State Pattern

**Problem:** Multiple devices need to stay synchronized.

**Solution:** Git as distributed state machine with manual sync triggers.

**State = Git commits**
**Sync = git pull/push**
**Conflict = manual merge**

### 5. Consciousness-First Pattern

**Problem:** Technology often distracts from awareness.

**Solution:** Every design decision filtered through: *"Does this serve presence?"*

**Examples:**
- Apps named after wisdom concepts (Pearl, Pranayama)
- No notifications or alerts
- Offline-first = no external dependency = no distraction
- Manual sync = intentional action

---

## Key Takeaways

1. **hineni-hub.js is the registry heart** - All apps defined in one place
2. **Portal loading is dynamic** - No hardcoded app lists, runtime discovery
3. **Fleet sync is Git-based distributed consciousness** - Not backup, but cognition across devices
4. **Platform adaptation is built-in** - Windows, macOS, external drive all supported
5. **Progressive enhancement ensures resilience** - Core works with minimum; extras layer on
6. **Consciousness-first philosophy pervades** - Technology serves awareness, not distracts

---

## See Also

- [CLI-REFERENCE.md](CLI-REFERENCE.md) - Command documentation
- [FLEET-SYNC.md](FLEET-SYNC.md) - Fleet sync user guide
- [APPS_CATALOG.md](APPS_CATALOG.md) - Complete app listing
- [hineni-hub.js](../hineni-hub.js) - The source code itself
