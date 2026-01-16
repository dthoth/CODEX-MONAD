# CODEX-MONAD Fleet Sync
## Multi-Device Consciousness Infrastructure Synchronization

**Version:** 2.2-FLEET  
**Last Updated:** January 16, 2026  
**Author:** Rev. Lux Luther (dthoth) + Claude

---

## 🐉 Overview

Fleet Sync enables seamless synchronization of notes, dragon wisdom, and all CODEX data across multiple devices through Git. Write a note on your MacBook, run `ship`, and it appears on your Windows machine after `sync`.

**The Circuit:**
```
   MacBook Air ←──→ GitHub ←──→ FORGE (ThinkPad)
        ↑                            ↑
        └────────→ Mini PC ←─────────┘
```

---

## 🏗️ Architecture

### Synced Data Location

All user data lives in a git-tracked folder:

```
CODEX-MONAD/
└── data/
    └── user-sync/
        ├── notes/                    # Quick notes from qn command
        │   ├── 2026-01-15_093045-note.md
        │   ├── 2026-01-15_141230-note.md
        │   └── ...
        └── dragon_wisdom_log.txt     # Saved fortunes from keeper
```

### Why This Works

1. **Git-tracked:** The `data/user-sync/` folder is committed to the repo
2. **Same commands everywhere:** `qn`, `keeper`, `sync`, `ship` work identically
3. **No cloud dependencies:** Uses GitHub as the sync hub (could be any git remote)
4. **Offline-first:** Work offline, sync when connected

---

## 🖥️ Device Configuration

### MacBook Air (macOS / Fish Shell)

**Repo Location:** `~/Code/CODEX-MONAD` (symlink to `/Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD`)

**Config file:** `~/.config/fish/config.fish`
```fish
set -gx CODEX_REPO ~/Code/CODEX-MONAD
```

**Function files:** `~/.config/fish/functions/`
- `morning.fish`
- `dragon.fish`
- `keeper.fish`
- `qn.fish`
- `notes.fish`
- `codex.fish`
- `sync.fish`
- `ship.fish`
- `fleet.fish`
- `gui.fish`
- `lux.fish`
- `hierarchies.fish`
- `timestamp.fish`
- `wisdom.fish`

**Key paths in functions:**
```fish
set -l notes_dir ~/Code/CODEX-MONAD/data/user-sync/notes
set -l log_file ~/Code/CODEX-MONAD/data/user-sync/dragon_wisdom_log.txt
```

---

### FORGE / Ibis (Windows / PowerShell)

**Repo Location:** `C:\Users\CODEX_FORGE\Documents\GitHub\CODEX-MONAD`

**Config file:** `$PROFILE` (usually `Documents\PowerShell\Microsoft.PowerShell_profile.ps1`)

**Key variables:**
```powershell
$CODEX_REPO = "$HOME\Documents\GitHub\CODEX-MONAD"
$env:CODEX_REPO = "$HOME\Documents\GitHub\CODEX-MONAD"
$NOTES_DIR = "$CODEX_REPO\data\user-sync\notes"
$WISDOM_LOG = "$CODEX_REPO\data\user-sync\dragon_wisdom_log.txt"
```

---

### Mini PC (Windows / PowerShell)

**Repo Location:** `C:\Users\dthot\GitHub\CODEX-MONAD`

**Config file:** `$PROFILE`

**Key variables:**
```powershell
$CODEX_REPO = "$HOME\GitHub\CODEX-MONAD"
$CODEX_STAGING = "$CODEX_REPO\data\user-sync"
$NOTES_DIR = "$CODEX_STAGING\notes"
```

**Auto-backup:** Silent scheduled task syncs to `F:\repos\CODEX-MONAD` every 5 minutes

---

## 🔄 Sync Workflow

### Daily Usage

**On any device:**

1. **Capture thoughts:**
   ```bash
   qn "My brilliant idea about consciousness"
   ```

2. **Save dragon wisdom:**
   ```bash
   dragon
   keeper
   ```

3. **Push to fleet:**
   ```bash
   codex
   ship "notes from morning session"
   ```

4. **On another device, pull:**
   ```bash
   codex
   sync
   ```

5. **Verify notes arrived:**
   ```bash
   notes
   ```

---

### The Commands

| Command | What it does | Git equivalent |
|---------|--------------|----------------|
| `sync` | Pull latest from GitHub | `git fetch && git pull` |
| `ship "msg"` | Push all changes | `git add . && git commit -m "msg" && git push` |
| `fleet` | Check all repo statuses | `git status` on each repo |

---

## 📁 Data Format

### Notes (`data/user-sync/notes/*.md`)

```markdown
---
created: 2026-01-16 09:30:45
device: MINI_PC
type: quick-note
---

The actual note content goes here.
Multiple lines are fine.
```

**Filename format:** `YYYY-MM-DD_HHMMSS-note.md`

---

### Wisdom Log (`data/user-sync/dragon_wisdom_log.txt`)

```
2026-01-15 19:43 | It works on my machine.
2026-01-15 20:01 | Memento mori - Remember you will die.
2026-01-16 08:12 | May the Force be with you.
```

**Format:** `YYYY-MM-DD HH:MM | Fortune text`

---

## 🆕 Adding a New Device

### macOS (Fish Shell)

1. **Clone the repo:**
   ```bash
   cd ~/Code
   git clone https://github.com/dthoth/CODEX-MONAD.git
   ```

2. **Set environment variable:**
   ```bash
   echo 'set -gx CODEX_REPO ~/Code/CODEX-MONAD' >> ~/.config/fish/config.fish
   ```

3. **Copy function files from another Mac or create them:**
   - See `CLI-REFERENCE.md` for function definitions
   - Or copy from `~/.config/fish/functions/` on existing Mac

4. **Test:**
   ```bash
   source ~/.config/fish/config.fish
   morning
   ```

---

### Windows (PowerShell)

1. **Clone the repo:**
   ```powershell
   cd ~\Documents\GitHub   # or wherever you keep repos
   git clone https://github.com/dthoth/CODEX-MONAD.git
   ```

2. **Copy the profile from FORGE or Mini PC:**
   - Get `$PROFILE` content from existing Windows machine
   - Update the `$CODEX_REPO` path for new machine's location
   - Update device name in `qn` function and `morning` display

3. **Reload and test:**
   ```powershell
   . $PROFILE
   morning
   ```

---

## 🔧 Troubleshooting

### Merge Conflicts

If two devices edited the same file:

```bash
codex
git status              # See conflicted files
git diff                # See the conflicts
# Edit the files to resolve
git add .
ship "resolved merge conflict"
```

### Notes Not Syncing

1. Check you're saving to the right location:
   ```bash
   qn "test"
   # Should show: data/user-sync/notes/...
   ```

2. Check the path variables:
   ```powershell
   echo $NOTES_DIR
   # Should include: data/user-sync/notes
   ```

3. Make sure you `ship` after creating notes!

### "Not a git repository" Error

Run `codex` first to navigate to the repo, then `sync` or `ship`.

### Wisdom Log Has Duplicates

This can happen during migration. To deduplicate:
```powershell
Get-Content $WISDOM_LOG | Select-Object -Unique | Set-Content $WISDOM_LOG
```

Or on Mac:
```fish
sort -u ~/Code/CODEX-MONAD/data/user-sync/dragon_wisdom_log.txt -o ~/Code/CODEX-MONAD/data/user-sync/dragon_wisdom_log.txt
```

---

## 🛡️ Backup Strategy

### Git IS Your Backup

Every `ship` creates a backup on GitHub. Every device with a clone has a full copy.

### Additional Local Backup (Mini PC)

The Mini PC runs a silent scheduled task that mirrors to `F:\repos\CODEX-MONAD` every 5 minutes.

**To set up on another Windows machine:**

1. Create the VBS launcher:
   ```powershell
   @'
   Set WshShell = CreateObject("WScript.Shell")
   WshShell.Run "powershell -WindowStyle Hidden -Command robocopy 'SOURCE' 'DESTINATION' /MIR /R:1 /W:1", 0, False
   '@ | Out-File -FilePath "$HOME\codex_sync_silent.vbs" -Encoding ASCII
   ```

2. Register the task:
   ```powershell
   $action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$HOME\codex_sync_silent.vbs`""
   $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
   $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -Hidden
   Register-ScheduledTask -TaskName "CODEX_Backup_Silent" -Action $action -Trigger $trigger -Settings $settings
   ```

---

## 📊 Fleet Status Summary

| Device | OS | Shell | Repo Path | Status |
|--------|-----|-------|-----------|--------|
| MacBook Air | macOS | Fish | `~/Code/CODEX-MONAD` | ✅ Synced |
| FORGE (Ibis) | Windows | PowerShell | `Documents\GitHub\CODEX-MONAD` | ✅ Synced |
| Mini PC | Windows | PowerShell | `GitHub\CODEX-MONAD` | ✅ Synced + Auto-backup |

---

## 🐉 Philosophy

> "Git push is a prayer. Git pull is an answer."  
> — The Dragon

The fleet sync system embodies the CODEX-MONAD philosophy:

- **Offline-first:** Work anywhere, sync when ready
- **Zero dependencies:** Just Git and your shell
- **Distributed cognition:** Your thoughts exist across all devices
- **Charge on delivery:** The system proves its worth through daily use

---

## 📚 See Also

- [CLI-REFERENCE.md](CLI-REFERENCE.md) - Complete command documentation
- [README.md](../README.md) - Project overview
- [CODEX_INSTALL_GUIDE.md](../CODEX_INSTALL_GUIDE.md) - Installation instructions
