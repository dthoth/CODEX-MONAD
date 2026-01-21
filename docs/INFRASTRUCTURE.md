# 🏗️ CODEX-MONAD Infrastructure Documentation

**Last Updated:** 2026-01-20

## Overview

The CODEX-MONAD infrastructure consists of three primary components:
1. **hineni-hub.js** - Core application launcher and manager
2. **codex-apps.json** - Application registry
3. **Electron Shell** - Desktop application framework

---

## hineni-hub.js

**Location:** `hineni-hub.js` (root)  
**Size:** 33364 bytes  
**Lines:** 895

### Purpose

hineni-hub.js is the central nervous system of CODEX-MONAD. It:
- Manages application registry
- Handles app launching and navigation
- Provides the main UI shell
- Coordinates between apps
- Manages state and preferences

### Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    hineni-hub.js                           │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Registry   │  │  Navigation  │  │  App Launcher   │  │
│  │   Manager    │  │   Handler    │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│         │                  │                   │           │
│         └──────────────────┴───────────────────┘           │
│                            │                               │
│                            ↓                               │
│                  ┌──────────────────┐                      │
│                  │   UI Renderer    │                      │
│                  └──────────────────┘                      │
└────────────────────────────────────────────────────────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │     Individual Apps          │
              │  (HTML/JS/Python/Bash)       │
              └──────────────────────────────┘
```

### Key Functions

The hub defines approximately **36** functions, including:

#### Registry Management
- **loadRegistry()** - Loads app definitions from codex-apps.json
- **parseRegistryApp()** - Parses individual app configurations
- **validateApp()** - Validates app structure and requirements

#### Navigation
- **navigateToApp()** - Launches selected application
- **returnHome()** - Returns to main launcher screen
- **handleNavigation()** - Manages navigation history

#### UI Rendering
- **renderAppGrid()** - Displays app launcher grid
- **renderAppCard()** - Creates individual app cards
- **updateUI()** - Refreshes interface state

#### State Management
- **saveState()** - Persists user preferences
- **loadState()** - Restores saved state
- **resetState()** - Clears saved preferences

### App Launch Types

hineni-hub supports multiple launch types:

| Type | Description | Example |
|------|-------------|---------|
| `html` | HTML/JavaScript web app | PolyWrite, Pearl, DIN Portal |
| `python` | Python script/application | CODEX Capture |
| `bash` | Shell script | CODEX Vault |
| `external` | External application | (Future use) |

### Launch Flow

```
User clicks app card
        │
        ↓
Validate app config
        │
        ↓
Check launch type
        │
        ├─→ [HTML] → Load in webview
        ├─→ [Python] → Spawn Python process
        ├─→ [Bash] → Execute shell script
        └─→ [External] → Launch external app
```

---

## codex-apps.json

**Location:** `codex-apps.json` (root)  
**Format:** JSON array of app objects  
**Apps Registered:** 13

### Schema

Each app in the registry follows this structure:

```json
{
  "id": "unique_app_identifier",
  "label": "Human Readable Name",
  "icon": "🔮",
  "status": "active",
  "description": "Brief description of the app",
  "hubPath": "apps/app_name/index.html",
  "isLocal": true,
  "launchType": "html",
  "version": "1.0.0",
  "author": "Developer Name",
  "category": "optional_category",
  "tags": ["tag1", "tag2"]
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (lowercase, underscores) |
| `label` | string | ✅ | Display name |
| `icon` | string | ✅ | Emoji or unicode icon |
| `status` | string | ✅ | `active`, `beta`, `deprecated` |
| `description` | string | ✅ | Brief app description |
| `hubPath` | string | ✅ | Path to entry point |
| `isLocal` | boolean | ✅ | True for local apps |
| `launchType` | string | ✅ | `html`, `python`, `bash`, `external` |
| `version` | string | ⚪ | Semantic version |
| `author` | string | ⚪ | Creator name |
| `category` | string | ⚪ | Grouping category |
| `tags` | array | ⚪ | Search/filter tags |

### Current Registry

See [APPS_CATALOG.md](APPS_CATALOG.md) for complete app listings.

**Summary:**
- **Total Apps:** 13
- **Active Apps:** 13
- **HTML Apps:** 11
- **Python Apps:** 1
- **Bash Apps:** 1

### Adding New Apps

To add a new app to CODEX-MONAD:

1. **Create app directory**
   ```bash
   mkdir -p apps/my_new_app
   ```

2. **Add entry point**
   ```bash
   # For HTML app
   touch apps/my_new_app/index.html
   ```

3. **Register in codex-apps.json**
   ```json
   {
     "id": "my_new_app",
     "label": "My New App",
     "icon": "🆕",
     "status": "active",
     "description": "Description of what it does",
     "hubPath": "apps/my_new_app/index.html",
     "isLocal": true,
     "launchType": "html",
     "version": "1.0.0"
   }
   ```

4. **Restart CODEX-MONAD**
   ```bash
   npm start
   ```

---

## Electron Integration

### Main Process (main.js)

The Electron main process:
- Creates BrowserWindow
- Loads hineni-hub.js
- Manages window lifecycle
- Handles system-level operations

### Preload Scripts

- **preload.js** - Security bridge between renderer and main
- **preload-webview.js** - Sandbox configuration for embedded apps

### IPC Communication

Communication between processes:

```
Main Process (main.js)
        ↕ IPC
Renderer Process (hineni-hub.js)
        ↕ postMessage
Webview (individual apps)
```

---

## File System Layout

### Registry Pattern

```
CODEX-MONAD/
├── codex-apps.json          # App registry
├── hineni-hub.js            # Hub logic
├── index.html               # Main shell
├── main.js                  # Electron main
├── preload.js               # Security bridge
├── package.json             # Dependencies
└── apps/                    # App collection
    ├── app_1/
    │   └── index.html
    ├── app_2/
    │   └── index.html
    └── ...
```

### App Isolation

Each app operates in its own context:
- **Separate directory** - `apps/[app_id]/`
- **Independent resources** - CSS, JS, assets
- **Isolated state** - localStorage scoped to app
- **Sandboxed execution** - Webview security

---

## Fleet Sync Philosophy

CODEX-MONAD is designed for **fleet deployment** - running across multiple machines with synchronized state.

### Design Principles

1. **Self-contained apps** - Each app is a complete unit
2. **Portable registry** - codex-apps.json can be version controlled
3. **Cross-platform paths** - Relative paths work everywhere
4. **Platform abstraction** - Bootstrap scripts handle OS differences

### Bootstrap System

Platform-specific setup in `bootstrap/`:

- **Windows:** `bootstrap/windows/install.ps1`
- **macOS:** `bootstrap/macos/install.sh`
- **Linux:** `bootstrap/linux/install.sh`

Each bootstrap:
1. Installs dependencies
2. Configures environment
3. Sets up platform-specific integrations
4. Initializes app registry

---

## Configuration Files

### package.json

Electron and Node.js configuration:
- Dependencies
- Scripts
- Electron version
- Build configuration

### hineni-hub.json

Runtime configuration (if exists):
- Default apps
- UI preferences
- Feature flags

---

## Extending the Hub

### Adding New Launch Types

1. **Define handler in hineni-hub.js**
   ```javascript
   function launchCustomType(app) {
     // Custom launch logic
   }
   ```

2. **Update launch type switch**
   ```javascript
   case 'custom':
     launchCustomType(app);
     break;
   ```

3. **Document in registry schema**

### Custom UI Themes

The hub supports custom styling:
- Modify `styles.css` for global themes
- Apps can override with local styles
- CSS variables for consistency

---

## Security Considerations

### Sandboxing

- Apps run in isolated webviews
- Limited access to Node.js APIs
- Preload scripts control capabilities

### Content Security Policy

- Restricted script execution
- Controlled resource loading
- XSS protection

### File System Access

- Apps access files through controlled APIs
- Path validation and sanitization
- User permission prompts for sensitive operations

---

## Performance Optimization

### Lazy Loading

- Apps load only when launched
- Registry loaded at startup
- Resources fetched on-demand

### Caching

- App state persisted in localStorage
- Registry cached in memory
- Assets cached by Electron

---

## Troubleshooting

### App Won't Launch

1. Check `codex-apps.json` syntax
2. Verify `hubPath` exists
3. Check console for errors
4. Validate launch type is supported

### Registry Not Loading

1. Validate JSON syntax
2. Check file permissions
3. Verify file location
4. Review error logs

---

## Related Documentation

- [Apps Catalog](APPS_CATALOG.md) - Complete app listings
- [Architecture](ARCHITECTURE.md) - System architecture
- [CLI Reference](CLI-REFERENCE.md) - Command-line tools

---

*Infrastructure documentation generated by CODEX Documentation Mission*  
*Part of CODEX-MONAD ecosystem*
