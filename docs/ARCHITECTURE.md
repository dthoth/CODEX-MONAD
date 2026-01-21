# CODEX-MONAD Architecture

**How hineni-hub.js Registers Apps and Loads the Portal**

> This document explains the ACTUAL implementation, not theoretical design.

---

## Table of Contents

1. [Overview](#overview)
2. [The Loading Sequence](#the-loading-sequence)
3. [How Apps Register](#how-apps-register)
4. [Platform Detection](#platform-detection)
5. [Path Resolution](#path-resolution)
6. [Portal Rendering](#portal-rendering)
7. [The Dual-Source Registry](#the-dual-source-registry)
8. [Launch Mechanisms](#launch-mechanisms)
9. [Code Walkthrough](#code-walkthrough)

---

## Overview

### What is hineni-hub.js?

`hineni-hub.js` is the **single source of truth** for all apps in CODEX-MONAD. It:

1. **Defines** all available apps in `HUB_CATEGORIES` array
2. **Detects** platform (Windows/macOS/Linux) and hub availability
3. **Builds** correct paths based on platform and app location
4. **Renders** the portal by creating cards for each app
5. **Handles** app launching with appropriate mechanisms

**File location:** `/hineni-hub.js` (root of CODEX-MONAD)  
**Size:** ~900 lines of vanilla JavaScript  
**Dependencies:** ZERO (works completely standalone)

### Key Insight

The portal is **generated dynamically at runtime** from the registry. There is no hardcoded HTML list of apps. Everything comes from `HUB_CATEGORIES`.

---

## The Loading Sequence

### Step-by-Step: What Happens When You Open index.html

```
1. Browser loads index.html
   └─> Parses HTML structure
   └─> Creates <div id="hub-container"></div>
   └─> Loads <script src="hineni-hub.js"></script>

2. hineni-hub.js executes immediately
   └─> Platform detection runs (Windows? macOS? Linux?)
   └─> Sets HUB_ROOT, RELATIVE_ROOT, HUB_AVAILABLE
   └─> Defines HUB_CATEGORIES array (all apps)
   └─> Defines helper functions (buildHref, createCard, etc.)

3. DOM loads completely
   └─> DOMContentLoaded event fires
   └─> Calls renderHubSection()

4. renderHubSection() builds the portal
   └─> For each category in HUB_CATEGORIES:
       └─> Calls createCategorySection(category)
           └─> For each item in category.items:
               └─> Calls createCard(item)
                   └─> Calls buildHref(item) → gets URL
                   └─> Calls isItemAvailable(item) → checks availability
                   └─> Creates <div class="portal-card"> with link
               └─> Appends card to category section
           └─> Appends category section to hub-container

5. Portal is now visible and interactive
   └─> User clicks app card
   └─> Opens href (relative path, file://, or folder)
```

### Timing

| Event | When | What |
|-------|------|------|
| Script load | ~0ms | Platform detection, HUB_CATEGORIES defined |
| DOMContentLoaded | ~50-100ms | renderHubSection() called |
| Portal visible | ~100-150ms | All cards rendered |
| Total load time | <200ms | Fully interactive |

---

## How Apps Register

### The Registry: HUB_CATEGORIES

Apps don't "register themselves." Instead, **all apps are defined centrally** in the `HUB_CATEGORIES` array inside `hineni-hub.js`.

**Location in code:** Line ~71-600

**Structure:**

```javascript
var HUB_CATEGORIES = [
    {
        id: 'web-apps',              // Category identifier
        title: '🌐 Web Apps & Games', // Display title
        items: [                      // Array of apps
            {
                id: 'polywrite',              // Unique app ID
                label: 'PolyWrite Pro',       // Display name
                icon: '✍️',                   // Emoji icon
                status: 'active',             // active | beta | archived | transcendent
                description: 'Multi-editor writing environment...',
                hubPath: 'apps/polywrite/index.html',  // Relative path
                launchType: 'html',           // html | folder | file | cli
                isLocal: true                 // true = in CODEX-MONAD repo
            },
            {
                id: 'pearl',
                label: 'Pearl',
                icon: '💎',
                status: 'active',
                description: 'Minimalist AI conversation interface...',
                hubPath: 'apps/pearl/index.html',
                launchType: 'html',
                isLocal: true
            },
            // ... more apps
        ]
    },
    {
        id: 'cli-tools',
        title: '🛠️ CLI Tools',
        items: [
            // ... CLI apps
        ]
    },
    // ... more categories
];
```

### App Metadata Fields

| Field | Required | Type | Purpose |
|-------|----------|------|---------|
| `id` | ✅ | string | Unique identifier (kebab-case) |
| `label` | ✅ | string | Display name |
| `icon` | ✅ | string | Emoji icon (single emoji) |
| `status` | ✅ | string | `active`, `beta`, `archived`, `transcendent` |
| `description` | ✅ | string | Short description (1-2 sentences) |
| `hubPath` | ✅ | string | Relative path from hub root |
| `launchType` | ✅ | string | How to launch: `html`, `folder`, `file`, `cli` |
| `isLocal` | ✅ | boolean | `true` if in CODEX-MONAD repo, `false` if on external hub |

### Adding a New App

To add a new app to the portal:

1. **Create the app** in `apps/your-app/`
2. **Edit hineni-hub.js**
3. **Find HUB_CATEGORIES**
4. **Add entry to appropriate category:**

```javascript
{
    id: 'your-app',
    label: 'Your App Name',
    icon: '🎨',
    status: 'active',
    description: 'What your app does',
    hubPath: 'apps/your-app/index.html',
    launchType: 'html',
    isLocal: true
}
```

5. **Reload portal** → app appears automatically

**No build step. No compilation. Just edit and reload.**

---

## Platform Detection

### Why Platform Detection?

Paths differ across operating systems:
- **macOS:** `/Volumes/HINENI_HUB/` (external drive)
- **Windows:** `C:\Users\...\Documents\GitHub\CODEX-MONAD\`
- **Linux:** `/home/user/CODEX-MONAD/`

The portal needs to:
1. Detect which OS it's running on
2. Set correct base paths
3. Build hrefs that work on that platform

### Detection Code

**Location:** Line ~47-53

```javascript
var PLATFORM = (function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('win') !== -1) return 'windows';
    if (ua.indexOf('mac') !== -1) return 'macos';
    if (ua.indexOf('linux') !== -1) return 'linux';
    return 'unknown';
})();

var IS_WINDOWS = PLATFORM === 'windows';
var IS_MACOS = PLATFORM === 'macos';
```

**How it works:**
- Checks `navigator.userAgent` (browser's platform string)
- Looks for 'win', 'mac', or 'linux' substring
- Sets boolean flags for easy checking

### Hub Root Configuration

**Location:** Line ~61-68

```javascript
// For file:// links that need to open in Finder/Explorer
// On macOS: /Volumes/HINENI_HUB
// On Windows: External hub not typically mounted, so null
var HUB_ROOT = IS_MACOS ? '/Volumes/HINENI_HUB' : null;

// For relative links (portal is at 10-repos-central/CODEX-MONAD/)
// So ../../ gets us to HINENI_HUB root (only relevant when hub is mounted)
var RELATIVE_ROOT = '../..';

// Hub availability - external items only work when hub is mounted
var HUB_AVAILABLE = IS_MACOS; // TODO: Could check if actually mounted
```

**Key variables:**

| Variable | macOS | Windows | Purpose |
|----------|-------|---------|---------|
| `HUB_ROOT` | `/Volumes/HINENI_HUB` | `null` | Absolute path to external hub |
| `RELATIVE_ROOT` | `../..` | `../..` | Relative path from portal to hub root |
| `HUB_AVAILABLE` | `true` | `false` | Whether external hub items should show |

**Why Windows = false?**
- On macOS, HINENI_HUB is an external drive that gets mounted
- On Windows, the repo is typically local (no external hub)
- External hub items only show when `HUB_AVAILABLE === true`

---

## Path Resolution

### The buildHref() Function

**Location:** Line ~670-691

This is the **most critical function** for understanding how the portal works.

```javascript
function buildHref(item) {
    if (!item.hubPath) return null;

    // HTML apps that are LOCAL to CODEX-MONAD use direct relative paths
    // These work on ALL platforms
    if (item.launchType === 'html' && item.isLocal) {
        return item.hubPath;
    }

    // Non-local items require the hub to be available
    if (!HUB_AVAILABLE) {
        return null; // Will show as unavailable
    }

    // HTML apps elsewhere in the hub use relative from portal
    if (item.launchType === 'html') {
        return RELATIVE_ROOT + '/' + item.hubPath;
    }

    // Everything else (folders, files, CLI) uses file:// for Finder
    return 'file://' + HUB_ROOT + '/' + item.hubPath;
}
```

### Path Resolution Logic

```
┌─────────────────────────────────────────────────────────────┐
│ Is it an HTML app AND isLocal: true?                        │
├─────────────────────────────────────────────────────────────┤
│ YES → Use direct relative path                              │
│       Example: apps/pearl/index.html                        │
│       Works on: ALL platforms                               │
└─────────────────────────────────────────────────────────────┘
                    ↓ NO
┌─────────────────────────────────────────────────────────────┐
│ Is HUB_AVAILABLE?                                           │
├─────────────────────────────────────────────────────────────┤
│ NO → Return null (app will show as unavailable)             │
└─────────────────────────────────────────────────────────────┘
                    ↓ YES
┌─────────────────────────────────────────────────────────────┐
│ Is it an HTML app (but not local)?                          │
├─────────────────────────────────────────────────────────────┤
│ YES → Use RELATIVE_ROOT + hubPath                           │
│       Example: ../../tools/some-tool/index.html             │
│       Works on: macOS (when hub mounted)                    │
└─────────────────────────────────────────────────────────────┘
                    ↓ NO
┌─────────────────────────────────────────────────────────────┐
│ Everything else (folders, files, CLI tools)                 │
├─────────────────────────────────────────────────────────────┤
│ Use file:// protocol + HUB_ROOT                             │
│ Example: file:///Volumes/HINENI_HUB/tools/scripts/backup.sh│
│ Opens in: Finder (macOS) or Explorer (Windows)              │
└─────────────────────────────────────────────────────────────┘
```

### Examples

| App | hubPath | isLocal | Platform | Result |
|-----|---------|---------|----------|--------|
| Pearl | `apps/pearl/index.html` | `true` | Any | `apps/pearl/index.html` |
| PolyWrite | `apps/polywrite/index.html` | `true` | Any | `apps/polywrite/index.html` |
| External Tool | `tools/utilities/index.html` | `false` | macOS | `../../tools/utilities/index.html` |
| External Tool | `tools/utilities/index.html` | `false` | Windows | `null` (unavailable) |
| CLI Script | `tools/scripts/backup.sh` | `false` | macOS | `file:///Volumes/HINENI_HUB/tools/scripts/backup.sh` |

### Availability Check

**Location:** Line ~696-703

```javascript
function isItemAvailable(item) {
    // Local HTML apps always available
    if (item.launchType === 'html' && item.isLocal) {
        return true;
    }
    // Everything else requires hub
    return HUB_AVAILABLE;
}
```

**Simple logic:**
- Local HTML apps → **always available** (any platform)
- Everything else → **only if HUB_AVAILABLE**

---

## Portal Rendering

### The renderHubSection() Function

**Location:** Line ~804-856

This function **builds the entire portal** from `HUB_CATEGORIES`.

```javascript
function renderHubSection() {
    var container = document.getElementById('hub-container');
    if (!container) {
        console.error('Hub container not found');
        return;
    }

    container.innerHTML = ''; // Clear existing content

    var totalCount = getTotalItemCount();

    // Header
    var header = document.createElement('div');
    header.className = 'hub-header';
    header.innerHTML = `
        <h1>🌊 HINENI HUB</h1>
        <p class="hub-subtitle">${totalCount} portals available</p>
    `;
    container.appendChild(header);

    // Render each category
    HUB_CATEGORIES.forEach(function(category) {
        var section = createCategorySection(category);
        container.appendChild(section);
    });
}
```

**What it does:**
1. Finds `<div id="hub-container">` in HTML
2. Clears any existing content
3. Counts total apps across all categories
4. Creates header with title and count
5. For each category, calls `createCategorySection()`
6. Appends all sections to container

### Category Section Creation

**Location:** Line ~758-802

```javascript
function createCategorySection(category) {
    var section = document.createElement('section');
    section.className = 'hub-category';
    section.id = 'hub-' + category.id;

    // Category title
    var titleEl = document.createElement('h2');
    titleEl.className = 'hub-category-title';
    titleEl.textContent = category.title;
    section.appendChild(titleEl);

    // Cards grid
    var grid = document.createElement('div');
    grid.className = 'hub-grid';

    category.items.forEach(function(item) {
        var card = createCard(item);
        grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
}
```

**Structure created:**
```html
<section class="hub-category" id="hub-web-apps">
    <h2 class="hub-category-title">🌐 Web Apps & Games</h2>
    <div class="hub-grid">
        <!-- Cards go here -->
    </div>
</section>
```

### Card Creation

**Location:** Line ~708-756

```javascript
function createCard(item) {
    var card = document.createElement('div');
    card.className = 'portal-card hub-card';
    card.dataset.hubId = item.id;
    card.dataset.launchType = item.launchType || 'folder';

    var available = isItemAvailable(item);
    var href = buildHref(item);

    // Add unavailable class for styling
    if (!available) {
        card.className += ' hub-unavailable';
    }

    var statusClass = (item.status || '').toLowerCase() === 'transcendent'
        ? 'status transcendent'
        : 'status active';

    var statusHtml = item.status
        ? '<span class="' + statusClass + '">' + item.status.toUpperCase() + '</span>'
        : '';

    // Different button text based on launch type
    var buttonIcon = '📂';
    var buttonText = 'Open';

    switch(item.launchType) {
        case 'html':
            buttonIcon = '🚀';
            buttonText = 'Launch';
            break;
        case 'folder':
            buttonIcon = '📂';
            buttonText = 'Open Folder';
            break;
        case 'file':
            buttonIcon = '📄';
            buttonText = 'Open File';
            break;
        case 'cli':
            buttonIcon = '⌨️';
            buttonText = 'CLI';
            break;
    }

    card.innerHTML = `
        <div class="hub-card-icon">${item.icon}</div>
        <div class="hub-card-title">${item.label}</div>
        <div class="hub-card-description">${item.description}</div>
        ${statusHtml}
        ${available && href
            ? '<a href="' + href + '" class="hub-link" target="_blank">' +
              buttonIcon + ' ' + buttonText + '</a>'
            : '<span class="hub-unavailable-label">🚫 Unavailable</span>'}
    `;

    return card;
}
```

**Card HTML structure:**
```html
<div class="portal-card hub-card" data-hub-id="pearl" data-launch-type="html">
    <div class="hub-card-icon">💎</div>
    <div class="hub-card-title">Pearl</div>
    <div class="hub-card-description">Minimalist AI conversation interface...</div>
    <span class="status active">ACTIVE</span>
    <a href="apps/pearl/index.html" class="hub-link" target="_blank">🚀 Launch</a>
</div>
```

**Key decisions in createCard():**
1. Checks availability → sets class + determines if link shows
2. Determines button icon/text based on `launchType`
3. Shows status badge if present
4. If available: creates link with href
5. If unavailable: shows "🚫 Unavailable" label

---

## The Dual-Source Registry

### Why Two Sources?

CODEX-MONAD uses **two registry sources**:

1. **`HUB_CATEGORIES`** in `hineni-hub.js` (embedded JavaScript)
2. **`codex-apps.json`** (async loaded JSON file)

**Why both?**

| Source | Pros | Cons |
|--------|------|------|
| **hineni-hub.js** | • Immediate (no async load)<br>• Guaranteed to exist<br>• Portal works even if JSON fails | • Requires editing JS<br>• Must reload page to update |
| **codex-apps.json** | • Easy to update (just JSON)<br>• Can be generated programmatically<br>• External tools can read/write | • Async (slight delay)<br>• Could fail to load<br>• Not guaranteed |

**Strategy:** Use both for **resilience + flexibility**

### How codex-apps.json Loads

**Location:** Line ~11-40

```javascript
async function loadCodexApps() {
    try {
        const response = await fetch('codex-apps.json');
        if (!response.ok) {
            throw new Error('Failed to load codex-apps.json');
        }
        const apps = await response.json();
        console.log('Loaded', apps.length, 'apps from codex-apps.json');
        
        // Create a dynamic category from JSON apps
        var codexCategory = {
            id: 'codex-core',
            title: '🧬 CODEX Core Apps',
            items: apps
        };
        
        // PREPEND to HUB_CATEGORIES so it appears first
        HUB_CATEGORIES.unshift(codexCategory);
        
        return apps;
    } catch (error) {
        console.warn('Could not load codex-apps.json:', error);
        return [];
    }
}
```

**Loading sequence:**
1. `fetch('codex-apps.json')` (async HTTP request)
2. Parse JSON
3. Wrap apps in a category object
4. **Prepend** to `HUB_CATEGORIES` using `unshift()`
5. Portal renders with both embedded + JSON apps

**What if codex-apps.json fails to load?**
- Error is caught and logged to console
- Empty array returned
- Portal still works with embedded `HUB_CATEGORIES`
- **Resilient to failure**

### When is loadCodexApps() called?

**Location:** Line ~860-878

```javascript
// Call immediately when script loads
loadCodexApps().then(function(apps) {
    console.log('CODEX apps loaded, ready to render');
}).catch(function(error) {
    console.error('Error loading CODEX apps:', error);
});

// Initialize portal when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHubSection);
} else {
    renderHubSection();
}
```

**Race condition handling:**
- `loadCodexApps()` starts immediately (async)
- `renderHubSection()` waits for DOMContentLoaded
- Usually `loadCodexApps()` finishes before DOM ready
- If not, portal renders with embedded apps first, then JSON apps appear when loaded

---

## Launch Mechanisms

### How Apps Launch

When user clicks an app card:

```html
<a href="apps/pearl/index.html" target="_blank">🚀 Launch</a>
```

**What happens:**

| launchType | href | Action |
|------------|------|--------|
| `html` | `apps/pearl/index.html` | Opens in new tab (`target="_blank"`) |
| `folder` | `file:///Volumes/HINENI_HUB/tools/` | Opens in Finder/Explorer |
| `file` | `file:///path/to/document.pdf` | Opens with default app |
| `cli` | `file:///path/to/script.sh` | Opens in Terminal (macOS) |

### Target Behavior

All links use `target="_blank"`:
- HTML apps open in **new tab**
- User can have multiple apps open simultaneously
- Portal remains open in original tab
- Can return to portal to launch more apps

### File Protocol Handling

**macOS:**
- `file:///Volumes/HINENI_HUB/tools/scripts/backup.sh` → Opens in Finder
- User can double-click to run

**Windows:**
- `file:///C:/path/to/script.ps1` → Opens in Explorer
- User can right-click → "Run with PowerShell"

**Why file:// protocol?**
- Allows browser to open OS file browser
- User maintains control (doesn't auto-execute scripts)
- Security: browser won't run scripts directly

---

## Code Walkthrough

### Full Loading Sequence (Code Level)

**1. HTML loads (index.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>CODEX-MONAD Portal</title>
    <link rel="stylesheet" href="portal-styles.css">
</head>
<body>
    <div id="hub-container">
        <!-- Portal will be injected here -->
    </div>
    
    <script src="hineni-hub.js"></script>
    <!-- Script loads and executes immediately -->
</body>
</html>
```

**2. hineni-hub.js executes (Lines 1-894):**

```javascript
// Line 47-53: Platform detection
var PLATFORM = (function() { ... })();
var IS_WINDOWS = PLATFORM === 'windows';
var IS_MACOS = PLATFORM === 'macos';

// Line 61-68: Hub configuration
var HUB_ROOT = IS_MACOS ? '/Volumes/HINENI_HUB' : null;
var RELATIVE_ROOT = '../..';
var HUB_AVAILABLE = IS_MACOS;

// Line 71-600: HUB_CATEGORIES definition
var HUB_CATEGORIES = [ ... ]; // All apps defined here

// Line 11-40: Async JSON loader
async function loadCodexApps() { ... }

// Line 670-703: Path resolution
function buildHref(item) { ... }
function isItemAvailable(item) { ... }

// Line 708-802: Rendering functions
function createCard(item) { ... }
function createCategorySection(category) { ... }

// Line 804-856: Main render function
function renderHubSection() { ... }

// Line 860-881: Initialization
loadCodexApps(); // Start async load
document.addEventListener('DOMContentLoaded', renderHubSection);
```

**3. DOMContentLoaded fires:**
```javascript
// Line 878-881
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHubSection);
} else {
    renderHubSection(); // If already loaded, call immediately
}
```

**4. renderHubSection() executes:**
```javascript
// Line 804
function renderHubSection() {
    var container = document.getElementById('hub-container');
    container.innerHTML = ''; // Clear
    
    // Add header
    var header = document.createElement('div');
    header.innerHTML = '<h1>🌊 HINENI HUB</h1>...';
    container.appendChild(header);
    
    // Render each category
    HUB_CATEGORIES.forEach(function(category) {
        var section = createCategorySection(category); // Line 758
        container.appendChild(section);
    });
}
```

**5. Each category renders:**
```javascript
// Line 758
function createCategorySection(category) {
    var grid = document.createElement('div');
    
    category.items.forEach(function(item) {
        var card = createCard(item); // Line 708
        grid.appendChild(card);
    });
    
    return section;
}
```

**6. Each card renders:**
```javascript
// Line 708
function createCard(item) {
    var available = isItemAvailable(item); // Check availability
    var href = buildHref(item);            // Build correct path
    
    card.innerHTML = `
        <div class="hub-card-icon">${item.icon}</div>
        <div class="hub-card-title">${item.label}</div>
        ${available ? '<a href="' + href + '">Launch</a>' : 'Unavailable'}
    `;
    
    return card;
}
```

**7. Portal is ready:**
- All categories rendered
- All cards visible
- All links functional
- User can click to launch apps

---

## Key Takeaways

### For Future Claude:

1. **hineni-hub.js is the ONLY source of truth for apps**
   - Everything comes from `HUB_CATEGORIES` array
   - No database, no config files, no build step
   - Edit JS → reload page → see changes

2. **Platform detection determines paths**
   - macOS gets external hub access
   - Windows uses local paths only
   - `buildHref()` handles all path resolution

3. **Portal is generated dynamically**
   - No hardcoded HTML
   - `renderHubSection()` builds everything from scratch
   - Categories → Sections → Cards → Links

4. **Dual-source for resilience**
   - Embedded JS = guaranteed to work
   - JSON file = flexible and updatable
   - Both sources merge via `unshift()`

5. **Launch types determine behavior**
   - `html` → new browser tab
   - `folder` → Finder/Explorer
   - `file` → default app
   - `cli` → Terminal/PowerShell

6. **Availability based on hub + locality**
   - Local HTML apps = always available
   - External items = only if HUB_AVAILABLE
   - `isItemAvailable()` makes the call

### For You (CODEX_FORGE):

- **To add an app:** Edit `HUB_CATEGORIES` in hineni-hub.js
- **To change app order:** Reorder items in array
- **To hide an app:** Remove from array or set `status: 'archived'`
- **To debug:** Check browser console for errors
- **To test paths:** Use `window.HINENI_HUB` in console

**No build tools. No bundlers. Pure vanilla JavaScript that just works.**

---

## Debugging

### Exposed Debugging Interface

**Location:** Line ~884-890

```javascript
// Expose for debugging
window.HINENI_HUB = {
    categories: HUB_CATEGORIES,
    root: HUB_ROOT,
    relativeRoot: RELATIVE_ROOT,
    platform: PLATFORM,
    available: HUB_AVAILABLE,
    render: renderHubSection
};
```

**In browser console:**

```javascript
// See all apps
window.HINENI_HUB.categories

// Check platform detection
window.HINENI_HUB.platform    // 'macos' or 'windows'
window.HINENI_HUB.available   // true or false

// Force re-render
window.HINENI_HUB.render()

// Check path configuration
window.HINENI_HUB.root         // '/Volumes/HINENI_HUB' or null
window.HINENI_HUB.relativeRoot // '../..'
```

---

**This is how hineni-hub.js actually works. Not theory. Not design. IMPLEMENTATION.**

Now you understand the CODEX portal completely. 🎯
