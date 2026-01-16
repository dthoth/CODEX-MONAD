# CODEX-MONAD CLI Reference
## Complete Command Documentation

**Version:** 2.2-FLEET  
**Last Updated:** January 16, 2026  
**Platforms:** macOS (Fish), Windows (PowerShell)

---

## 🐉 Overview

The CODEX-MONAD CLI provides a unified command interface across all devices in your fleet. Commands work identically on macOS (Fish shell) and Windows (PowerShell), with data syncing automatically through Git.

---

## 📍 Quick Reference

| Command | Description | Example |
|---------|-------------|---------|
| `morning` | Full morning ritual display | `morning` |
| `dragon` | Random wisdom fortune | `dragon` |
| `keeper` | Save last fortune | `keeper` |
| `qn` | Quick note capture | `qn "my thought"` |
| `notes` | Browse staged notes | `notes` |
| `codex` | Navigate to repo | `codex` |
| `sync` | Git pull | `sync` |
| `ship` | Git push | `ship "message"` |
| `fleet` | All repos status | `fleet` |
| `gui` | Open portal | `gui` |
| `lux` | Random cognomen | `lux` |
| `hierarchies` | Priority display | `hierarchies` |
| `timestamp` | Copy timestamp | `timestamp` |
| `wisdom` | View saved fortunes | `wisdom` |

---

## 🌅 Morning Ritual

### `morning`
Displays the complete morning dashboard.

**Shows:**
- Date and time
- Device name and repo path
- Dragon fortune (auto-generated)
- Staged notes count (recent 5 listed)
- Command reference

**Usage:**
```bash
morning
```

**Note:** Has a 15% chance to display dragon ASCII art.

---

## 🐉 Dragon System

### `dragon`
Generates a random wisdom fortune from the internal database.

**Usage:**
```bash
dragon
```

**Output:**
```
  ================================================
       THE DRAGON SPEAKS
  ================================================

    "The infrastructure is conscious of itself."
```

**Note:** Stores fortune in `$Global:LastFortune` (PowerShell) or `$LAST_FORTUNE` (Fish) for use with `keeper`.

---

### `keeper`
Saves the last dragon fortune to the wisdom log.

**Usage:**
```bash
dragon    # Generate a fortune first
keeper    # Save it
```

**Output:**
```
  [WISDOM PRESERVED]
  Saved to dragon_wisdom_log.txt
```

**Saves to:** `data/user-sync/dragon_wisdom_log.txt`

**Format:** `YYYY-MM-DD HH:MM | Fortune text`

---

### `wisdom`
Displays the dragon wisdom archive (last 10 saved fortunes).

**Usage:**
```bash
wisdom
```

---

## 📝 Notes System

### `qn` (Quick Note)
Captures a quick note with timestamp and device metadata.

**With argument (instant save):**
```bash
qn "This is my thought about the thing"
```

**Without argument (opens editor):**
```bash
qn
```

**Output:**
```
  [NOTE SAVED]
  /path/to/data/user-sync/notes/2026-01-16_093045-note.md
```

**Note format:**
```markdown
---
created: 2026-01-16 09:30:45
device: MINI_PC
type: quick-note
---

This is my thought about the thing
```

**Saves to:** `data/user-sync/notes/`

---

### `notes`
Displays staged notes count and recent entries.

**Usage:**
```bash
notes           # Show count and recent 5
notes today     # Show only today's notes
notes open      # Open notes folder in file explorer
```

**Output:**
```
  STAGED NOTES (11 pending):
    2026-01-16_093045-note
    2026-01-15_211914-note
    2026-01-15_210658-note
    2026-01-15_181112-note
    2026-01-15_180356-note
```

---

## 🧭 Navigation

### `codex`
Navigates to the CODEX-MONAD repository and shows git status.

**Usage:**
```bash
codex
```

**Output:**
```
  ================================================
       CODEX-MONAD
  ================================================

  C:\Users\dthot\GitHub\CODEX-MONAD

  Branch: main
  Status: Clean
```

Or if changes exist:
```
  Branch: main
  Changes: 3 uncommitted
```

---

### `gui`
Opens the DIN Portal (index.html) in the default browser.

**Usage:**
```bash
gui
```

---

## 🔄 Git Workflow

### `sync`
Fetches and pulls the latest changes from GitHub.

**Usage:**
```bash
codex    # Navigate to repo first (or be in any git repo)
sync
```

**Output:**
```
  ================================================
       SYNCING: CODEX-MONAD
  ================================================

  Fetching...
  Pulling...
  [DONE] Sync complete
```

**Note:** Must be in a git repository directory.

---

### `ship`
Stages all changes, commits, and pushes to GitHub.

**Usage:**
```bash
ship "Your commit message here"
```

**Without message (prompts for input):**
```bash
ship
```

**Output:**
```
  ================================================
       SHIPPING: CODEX-MONAD
  ================================================

  Changes:
M  data/user-sync/dragon_wisdom_log.txt
A  data/user-sync/notes/2026-01-16_093045-note.md

  Pushing...

  [SHIPPED]
```

---

### `fleet`
Shows git status of all configured repositories.

**Usage:**
```bash
fleet
```

**Output:**
```
  ================================================
       FLEET STATUS
  ================================================

    [ok] CODEX-MONAD (main)
    [*] hineni (main) - 2 changes
    [ok] toolbox-cli (main)
```

**Legend:**
- `[ok]` = Clean, no uncommitted changes
- `[*]` = Has uncommitted changes

---

## 🎭 Personal / Fun

### `lux`
Displays a random cognomen (ceremonial title).

**Usage:**
```bash
lux
```

**Output:**
```
  ================================================
       COGNOMEN
  ================================================

    The universe recognizes you as:

    Builder of Dragons
```

---

### `hierarchies`
Displays the Divine Triage priority hierarchy.

**Usage:**
```bash
hierarchies
```

**Output:**
```
  ================================================
       DIVINE TRIAGE - Priority Hierarchies
  ================================================

    1. HEALTH
       Body, mind, immediate safety

    2. PARENTING
       Samson's needs, presence, support

    3. CLIENTS
       Paid work, deadlines, deliverables

    4. PROJECTS
       CODEX, infrastructure, systems

    5. CREATIVE
       Writing, music, art, HINENI

    6. MAINTENANCE
       Bills, admin, cleanup, life ops

    Charge on delivery - systems prove worth through results.
```

---

### `timestamp`
Generates timestamps and copies to clipboard.

**Usage:**
```bash
timestamp
```

**Output:**
```
  ================================================
       TIMESTAMP
  ================================================

    File:  2026-01-16_093045
    ISO:   2026-01-16T09:30:45

    Copied to clipboard!
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$CODEX_REPO` | Path to CODEX-MONAD repo | `~/Code/CODEX-MONAD` |
| `$NOTES_DIR` | Path to notes folder | `$CODEX_REPO/data/user-sync/notes` |
| `$WISDOM_LOG` | Path to wisdom log | `$CODEX_REPO/data/user-sync/dragon_wisdom_log.txt` |

### Config File Locations

**macOS (Fish):**
- Functions: `~/.config/fish/functions/`
- Config: `~/.config/fish/config.fish`

**Windows (PowerShell):**
- Profile: `$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`
- Or: `$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`

---

## 🐛 Troubleshooting

### "Not a git repository" error
You're not in the CODEX-MONAD directory. Run `codex` first, then `sync` or `ship`.

### "CODEX repo not detected" in morning
The `$CODEX_REPO` environment variable isn't set. Add to your config:
- Fish: `set -gx CODEX_REPO ~/Code/CODEX-MONAD`
- PowerShell: `$env:CODEX_REPO = "$HOME\GitHub\CODEX-MONAD"`

### Notes not showing in `morning`
Check that `$NOTES_DIR` points to `$CODEX_REPO/data/user-sync/notes`

---

## 📚 See Also

- [FLEET-SYNC.md](FLEET-SYNC.md) - Multi-device synchronization guide
- [README.md](../README.md) - Project overview
- [CODEX_INSTALL_GUIDE.md](../CODEX_INSTALL_GUIDE.md) - Installation instructions
