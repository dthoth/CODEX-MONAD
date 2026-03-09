# macOS Setup for CODEX-MONAD

## Quick Install

1. Open Terminal
2. Navigate to CODEX-MONAD folder
3. Run:
   ```bash
   ./bootstrap/macos/install.sh
   ```
4. Close and reopen Terminal
5. Type `morning`

---

## What the installer does

1. Detects if Fish shell is installed (uses Bash fallback if not)
2. Creates your CODEX_STAGING folder for notes
3. Copies shell functions to correct locations
4. Sets up PATH and environment

---

## Shell Options

### Fish Shell (Recommended)
```bash
brew install fish
```
- Beautiful syntax highlighting
- Auto-suggestions
- Functions live in `~/.config/fish/functions/`

### Bash (Fallback)
- Works out of the box
- Functions added to `~/.bashrc`

---

## Manual Install (if script fails)

### For Fish:
```bash
# Create directories
mkdir -p ~/Documents/CODEX_STAGING/notes
mkdir -p ~/Documents/CODEX_STAGING/import_ready
mkdir -p ~/.config/fish/functions

# Copy functions
cp ./bootstrap/macos/fish/functions/*.fish ~/.config/fish/functions/

# Restart terminal
```

### For Bash:
```bash
# Create directories
mkdir -p ~/Documents/CODEX_STAGING/notes
mkdir -p ~/Documents/CODEX_STAGING/import_ready

# Add to bashrc
cat ./bootstrap/macos/bash/bashrc_additions.sh >> ~/.bashrc

# Reload
source ~/.bashrc
```

---

## Folder Locations

| What | Where |
|------|-------|
| Fish functions | `~/.config/fish/functions/` |
| Bash config | `~/.bashrc` |
| Notes staging | `~/Documents/CODEX_STAGING/notes/` |
| Import ready | `~/Documents/CODEX_STAGING/import_ready/` |
| Dragon wisdom log | `~/Documents/CODEX_STAGING/dragon_wisdom_log.txt` |

---

## Device Detection

The config automatically checks for CODEX-MONAD in:
- `/Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD`
- `~/Code/CODEX-MONAD`
- `~/Documents/GitHub/CODEX-MONAD`
- `~/CODEX/CODEX-MONAD`

No manual configuration needed!
