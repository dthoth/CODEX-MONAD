# Fleet Sync - Multi-Device Sync Strategy

**Complete Technical Guide to CODEX-MONAD Distributed Synchronization**

> "Git push is a prayer. Git pull is an answer." — The Dragon

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [Git Workflow Strategies](#git-workflow-strategies)
4. [Cross-Platform Configuration](#cross-platform-configuration)
5. [Advanced Sync Patterns](#advanced-sync-patterns)
6. [Conflict Resolution](#conflict-resolution)
7. [Performance Optimization](#performance-optimization)
8. [Security & Privacy](#security--privacy)
9. [Troubleshooting](#troubleshooting)
10. [Reference](#reference)

---

## Overview

### What is Fleet Sync?

**Fleet Sync** is CODEX-MONAD's distributed synchronization system that enables **consciousness continuity** across multiple devices using Git as the transport layer.

```
┌─────────────────────────────────────────────────────────┐
│  Fleet = Your collection of devices                     │
│  Sync = Distributed state synchronization               │
│  Result = Work anywhere, access everywhere              │
└─────────────────────────────────────────────────────────┘
```

### The Fleet

| Device | OS | Shell | Location | Role |
|--------|-----|-------|----------|------|
| **MacBook Air** | macOS | Fish | `~/Code/CODEX-MONAD` | Mobile workstation |
| **FORGE (Ibis)** | Windows | PowerShell | `Documents\GitHub\CODEX-MONAD` | Primary workstation |
| **Mini PC** | Windows | PowerShell | `GitHub\CODEX-MONAD` | Silent backup node |

### Philosophy

Fleet Sync embodies three principles:

1. **Distributed Cognition** - Your thoughts exist across all devices
2. **Offline-First** - Work disconnected, sync when ready
3. **Git as Sacrament** - Push is offering, pull is receiving

---

## Architecture Deep Dive

### Data Flow Model

```
┌──────────────────────────────────────────────────────────────┐
│                    LOCAL WORK CYCLE                          │
├──────────────────────────────────────────────────────────────┤
│  Edit file → Auto-save → localStorage/filesystem            │
│                                                              │
│  When ready:                                                 │
│    git add .                                                 │
│    git commit -m "..."                                       │
│    git push origin main  ← SHIP                              │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    GITHUB REMOTE                             │
├──────────────────────────────────────────────────────────────┤
│  • Receives commits from all devices                         │
│  • Acts as central truth source                              │
│  • Enables async collaboration with self                     │
│  • Provides disaster recovery backup                         │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    OTHER DEVICES                             │
├──────────────────────────────────────────────────────────────┤
│  git pull origin main  ← SYNC                                │
│                                                              │
│  Receive changes → Update local files → Ready to work       │
└──────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
CODEX-MONAD/
├── apps/                      # Applications (tracked, no sync needed)
├── docs/                      # Documentation (tracked, syncs)
├── scripts/                   # Utilities (tracked, syncs)
├── lib/                       # Libraries (tracked, syncs)
├── data/
│   ├── user-sync/            # ✅ SYNCED CONSCIOUSNESS
│   │   ├── notes/            #    Quick notes (qn command)
│   │   ├── wisdom/           #    Accumulated insights
│   │   ├── context/          #    Session context
│   │   ├── logs/             #    Activity logs
│   │   └── dragon_wisdom_log.txt  # The Dragon's collection
│   │
│   ├── local-only/           # ❌ NOT SYNCED (in .gitignore)
│   │   ├── cache/            #    Temporary cache
│   │   ├── temp/             #    Temporary files
│   │   └── device-specific/  #    Device-specific data
│   │
│   └── app-data/             # ⚠️  OPTIONAL SYNC (per-app decision)
│       ├── pearl/            #    Pearl sessions (localStorage backup)
│       ├── vault/            #    Vault (encrypted, can sync)
│       └── polywrite/        #    PolyWrite sessions
│
├── .git/                     # Git repository (local only)
├── .gitignore                # Sync exclusions
└── README.md
```

### What Syncs, What Doesn't

| Path | Syncs? | Why |
|------|--------|-----|
| `apps/` | ✅ Yes | Application code |
| `docs/` | ✅ Yes | Documentation |
| `scripts/` | ✅ Yes | Utility scripts |
| `data/user-sync/` | ✅ Yes | **Your consciousness** |
| `data/local-only/` | ❌ No | Device-specific cache |
| `data/app-data/` | ⚠️ Maybe | Depends on app & .gitignore |
| `node_modules/` | ❌ No | Dependencies (in .gitignore) |
| `.git/` | ❌ No | Git internals |

---

## Git Workflow Strategies

### The Basic Cycle

**Most common workflow:**

```bash
# 1. Morning sync (pull latest from all devices)
sync

# 2. Work on your device
# ... edit files, create notes, etc.

# 3. Evening ship (push your changes)
ship
```

**As Fish functions (macOS):**
```fish
function sync
    cd ~/Code/CODEX-MONAD
    git pull origin main
end

function ship
    cd ~/Code/CODEX-MONAD
    git add .
    git commit -m "Auto-ship: $(date)"
    git push origin main
end
```

**As PowerShell functions (Windows):**
```powershell
function sync {
    Set-Location "$HOME\Documents\GitHub\CODEX-MONAD"
    git pull origin main
}

function ship {
    Set-Location "$HOME\Documents\GitHub\CODEX-MONAD"
    git add .
    git commit -m "Auto-ship: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin main
}
```

### Advanced Workflows

#### 1. Checkpoint Workflow

**Use case:** Save progress frequently without polluting history.

```bash
# Create checkpoint commits
checkpoint() {
    git add .
    git commit -m "WIP: Checkpoint $(date +%H:%M:%S)"
}

# Squash all checkpoints before shipping
squash-ship() {
    git reset --soft HEAD~5  # Combine last 5 commits
    git commit -m "Completed work session"
    git push origin main
}
```

#### 2. Branch-Per-Device Workflow

**Use case:** Isolate device-specific work, merge intentionally.

```bash
# On MacBook
git checkout -b mac-work
# ... work ...
git push origin mac-work

# On FORGE
git fetch origin
git merge origin/mac-work  # Intentional merge
git push origin main
```

#### 3. Selective Sync Workflow

**Use case:** Only sync specific directories.

```bash
# Ship only notes, not apps
ship-notes() {
    git add data/user-sync/notes/
    git commit -m "Notes update: $(date)"
    git push origin main
}

# Ship only docs
ship-docs() {
    git add docs/
    git commit -m "Documentation update"
    git push origin main
}
```

#### 4. Offline-Queue Workflow

**Use case:** Work completely offline, queue commits, ship when connected.

```bash
# While offline
work-offline() {
    git add .
    git commit -m "Offline work: $1"
    # Don't push yet
}

# When online
ship-queue() {
    git push origin main  # Pushes all queued commits
}
```

### Commit Message Conventions

**CODEX-MONAD conventions:**

```
Auto-ship: 2026-01-20 21:45:00        # Automatic daily ship
Notes: Added reflection on fleet sync  # Note creation
Docs: Updated FLEET-SYNC.md           # Documentation
Apps: Fixed Pearl save bug             # App changes
Config: Updated Fish functions         # Configuration
Merge: Resolved MacBook/FORGE conflict # Conflict resolution
```

**Semantic prefixes:**
- `Auto-ship:` - Automatic commit (daily ship)
- `Notes:` - Note-related changes
- `Docs:` - Documentation updates
- `Apps:` - Application code
- `Config:` - Configuration files
- `Fix:` - Bug fixes
- `Merge:` - Conflict resolutions
- `WIP:` - Work in progress (checkpoint)

---

## Cross-Platform Configuration

### Challenge: Different Paths

**Problem:** Windows uses backslashes, macOS/Linux use forward slashes.

**Solution:** Use path variables, let Git normalize.

#### macOS (Fish Shell)

**`~/.config/fish/config.fish`:**
```fish
# CODEX-MONAD Configuration
set -gx CODEX_REPO ~/Code/CODEX-MONAD

# If using external HINENI_HUB drive:
if test -d /Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD
    set -gx CODEX_REPO /Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD
end

# Derived paths (platform-agnostic)
set -gx NOTES_DIR $CODEX_REPO/data/user-sync/notes
set -gx WISDOM_LOG $CODEX_REPO/data/user-sync/dragon_wisdom_log.txt
```

#### Windows (PowerShell)

**`$PROFILE` (usually `Documents\PowerShell\Microsoft.PowerShell_profile.ps1`):**
```powershell
# CODEX-MONAD Configuration
$env:CODEX_REPO = "$HOME\Documents\GitHub\CODEX-MONAD"

# Check alternate locations
if (Test-Path "C:\GitHub\CODEX-MONAD") {
    $env:CODEX_REPO = "C:\GitHub\CODEX-MONAD"
}

# Derived paths (use Join-Path for cross-platform safety)
$env:NOTES_DIR = Join-Path $env:CODEX_REPO "data\user-sync\notes"
$env:WISDOM_LOG = Join-Path $env:CODEX_REPO "data\user-sync\dragon_wisdom_log.txt"
```

### Challenge: Line Endings

**Problem:** Windows uses CRLF (`\r\n`), Unix uses LF (`\n`).

**Solution:** Configure Git to normalize line endings.

**`.gitattributes` (in repo root):**
```
# Auto-detect text files and normalize line endings
* text=auto

# Force LF for specific files
*.sh text eol=lf
*.fish text eol=lf
*.md text eol=lf
*.json text eol=lf

# Force CRLF for Windows scripts
*.ps1 text eol=crlf
*.bat text eol=crlf
*.cmd text eol=crlf

# Binary files (no conversion)
*.png binary
*.jpg binary
*.pdf binary
*.zip binary
```

**Per-user Git config:**
```bash
# On Windows (normalize to LF in repo, checkout as CRLF)
git config --global core.autocrlf true

# On macOS/Linux (normalize to LF, checkout as LF)
git config --global core.autocrlf input
```

### Challenge: File Permissions

**Problem:** Unix has executable bit, Windows doesn't.

**Solution:** Git tracks executable bit separately.

```bash
# Make script executable (macOS/Linux)
chmod +x scripts/bootstrap.sh
git add scripts/bootstrap.sh
git commit -m "Make bootstrap.sh executable"

# On Windows, Git preserves the permission
# When pulled, it will be executable on macOS/Linux again
```

### Challenge: Symlinks

**Problem:** macOS uses symlinks, Windows has limited support.

**Solution:** Avoid symlinks in synced directories.

**If you must use symlinks:**
```bash
# On Windows, enable symlink support (requires admin)
git config --global core.symlinks true

# Or, convert symlinks to copies on Windows
git config --local core.symlinks false
```

**Better approach:** Use path variables instead of symlinks.

---

## Advanced Sync Patterns

### Pattern 1: Continuous Background Sync

**Use case:** Always stay in sync without manual commands.

**Fish (macOS):**
```fish
function watch-sync
    while true
        sync
        sleep 300  # Every 5 minutes
    end
end

# Run in background
watch-sync &
```

**PowerShell (Windows):**
```powershell
# Create scheduled task
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-Command `"cd $env:CODEX_REPO; git pull origin main`""

$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 5)

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries -Hidden

Register-ScheduledTask -TaskName "CODEX_Auto_Sync" `
    -Action $action -Trigger $trigger -Settings $settings
```

**⚠️ Caution:** Only use auto-sync if you rarely have uncommitted changes.

### Pattern 2: Selective File Sync

**Use case:** Only sync specific file types or directories.

```bash
# Create .gitignore for local exclusions
echo "data/app-data/pearl/*.tmp" >> .git/info/exclude

# Ship only markdown files
ship-md() {
    git add "*.md"
    git commit -m "Markdown updates"
    git push origin main
}
```

### Pattern 3: Encrypted Sync

**Use case:** Sync sensitive data encrypted.

```bash
# Install git-crypt
# macOS: brew install git-crypt
# Windows: scoop install git-crypt

# Initialize in repo
git-crypt init

# Specify files to encrypt (.gitattributes)
echo "data/user-sync/private/** filter=git-crypt diff=git-crypt" >> .gitattributes
echo "*.key filter=git-crypt diff=git-crypt" >> .gitattributes

# Export key for other devices
git-crypt export-key ~/codex-crypt-key

# On other device, unlock
git-crypt unlock ~/codex-crypt-key
```

### Pattern 4: Multi-Remote Sync

**Use case:** Sync to multiple Git services (GitHub + GitLab + local).

```bash
# Add multiple remotes
git remote add github git@github.com:user/CODEX-MONAD.git
git remote add gitlab git@gitlab.com:user/CODEX-MONAD.git
git remote add local /mnt/backup/CODEX-MONAD.git

# Ship to all remotes
ship-all() {
    git push github main
    git push gitlab main
    git push local main
}

# Sync from primary
sync() {
    git pull github main
}
```

---

## Conflict Resolution

### Understanding Conflicts

**Conflicts occur when:**
1. Two devices modify the same file
2. Both devices push to GitHub
3. Second device gets rejected (needs pull first)

```
MacBook:
  Edit file.md → Commit → Push ✅

FORGE (hasn't synced yet):
  Edit file.md → Commit → Push ❌ (conflict!)
  
Git says: "Remote has changes you don't have. Pull first."
```

### The CODEX Conflict Resolution Process

#### Step 1: Pull with Rebase

```bash
# Instead of merge, use rebase for cleaner history
git pull --rebase origin main
```

**What happens:**
```
Before:
  A---B---C (MacBook pushed)
                       D---E (FORGE local)

After rebase:
  A---B---C---D'---E' (FORGE replays on top)
```

#### Step 2: Resolve Conflicts

**Git will mark conflicts in files:**
```markdown
# My Note

<<<<<<< HEAD (current change - from GitHub)
This is what MacBook wrote.
=======
This is what FORGE wrote.
>>>>>>> abcd1234 (incoming change - your commit)
```

**Resolution strategies:**

**A. Keep Both (Merge):**
```markdown
# My Note

This is what MacBook wrote.

This is what FORGE wrote.
```

**B. Keep One:**
```markdown
# My Note

This is what FORGE wrote.
```

**C. Synthesize:**
```markdown
# My Note

Combined insights from both MacBook and FORGE sessions.
```

#### Step 3: Commit Resolution

```bash
git add file.md
git rebase --continue
git push origin main
```

### Advanced Conflict Strategies

#### Strategy 1: Timestamped Files

**Prevent conflicts by never editing same file:**

```bash
# qn command creates timestamped files
qn "My note"
# Creates: data/user-sync/notes/2026-01-20_214500-note.md

# Each device creates unique filenames → no conflicts!
```

#### Strategy 2: Device-Specific Branches

**Each device has its own branch:**

```bash
# On MacBook
git checkout -b mac-main
# Work, commit, push

# On FORGE
git checkout -b forge-main
# Work, commit, push

# Periodically merge both to main
git checkout main
git merge mac-main
git merge forge-main
git push origin main
```

#### Strategy 3: Append-Only Logs

**Use append-only files to avoid conflicts:**

```bash
# dragon_wisdom_log.txt is append-only
# Each device appends, never edits existing lines
# Conflicts are rare because each adds to end

# If conflict occurs, both additions are valid:
<<<<<<< HEAD
[2026-01-20] Wisdom from MacBook
=======
[2026-01-20] Wisdom from FORGE
>>>>>>> abcd1234

# Resolution: Keep both (chronological order)
[2026-01-20 14:30] Wisdom from MacBook
[2026-01-20 14:35] Wisdom from FORGE
```

### The Dragon's Conflict Resolution Wisdom

> "A conflict is not an error—it's a conversation between timelines."

**Philosophy:**
- Conflicts mean you were productive on multiple devices (good!)
- Resolution is an opportunity to synthesize perspectives
- Don't fear conflicts; embrace them as creative merges

---

## Performance Optimization

### Large Repository Issues

**Problem:** Repo grows large over time (especially with binary files).

**Solutions:**

#### 1. Use `.gitignore` Aggressively

```
# .gitignore
node_modules/
*.log
*.tmp
data/local-only/
data/app-data/*/cache/
*.zip
*.tar.gz
*.dmg
*.exe
```

#### 2. Use Git LFS for Large Files

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.pdf"
git lfs track "*.zip"
git lfs track "*.mp4"

# LFS stores large files separately, only pointers in Git
```

#### 3. Shallow Clones

**For backup devices that don't need full history:**

```bash
# Clone with limited history
git clone --depth 1 git@github.com:user/CODEX-MONAD.git

# Later, if you need full history
git fetch --unshallow
```

#### 4. Periodic Cleanup

```bash
# Remove unused objects
git gc --aggressive --prune=now

# Check repo size
git count-objects -vH
```

### Sync Speed Optimization

**Problem:** Slow sync over network.

**Solutions:**

#### 1. Compress Transfer

```bash
# Enable compression
git config --global core.compression 9
```

#### 2. Partial Checkouts

```bash
# Only checkout specific directories
git sparse-checkout init --cone
git sparse-checkout set data/user-sync docs
```

#### 3. Batch Commits

```bash
# Instead of 100 micro-commits, batch into one
git reset --soft HEAD~100
git commit -m "Batched work session"
```

---

## Security & Privacy

### What's Private, What's Public

**Synced via Git:**
- ✅ Can be public (docs, apps, scripts)
- ⚠️ Check before pushing (notes might be personal)
- ❌ Never commit passwords, API keys

**Not synced (local-only):**
- API keys
- Passwords
- Personal journals (if you choose)
- Browser localStorage (stays in browser)

### Encryption Options

#### Option 1: Private GitHub Repo

```bash
# Make your repo private on GitHub
# Settings → Danger Zone → Change visibility → Private
```

#### Option 2: Git-Crypt

```bash
# Encrypt specific directories
git-crypt init
echo "data/user-sync/private/** filter=git-crypt diff=git-crypt" >> .gitattributes
```

#### Option 3: Encrypted Filesystem

```bash
# Store entire CODEX-MONAD on encrypted volume
# macOS: FileVault or encrypted APFS
# Windows: BitLocker
# Linux: LUKS
```

### Access Control

**SSH Keys (recommended):**

```bash
# Generate key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy and paste to GitHub → Settings → SSH Keys
```

**HTTPS with Token:**

```bash
# Create Personal Access Token on GitHub
# Use token instead of password
git remote set-url origin https://TOKEN@github.com/user/CODEX-MONAD.git
```

---

## Troubleshooting

### Problem: "Cannot push - updates were rejected"

**Cause:** Remote has commits you don't have.

**Solution:**

```bash
# Pull first, then push
git pull --rebase origin main
git push origin main
```

### Problem: "Merge conflict in file.md"

**Cause:** Same file edited on multiple devices.

**Solution:** See [Conflict Resolution](#conflict-resolution) section.

### Problem: "Permission denied (publickey)"

**Cause:** SSH key not configured.

**Solution:**

```bash
# Check if key exists
ls ~/.ssh/id_*.pub

# If not, generate
ssh-keygen -t ed25519

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
```

### Problem: Sync is slow

**Cause:** Large files or many commits.

**Solution:**

```bash
# Enable compression
git config --global core.compression 9

# Use shallow clone on slow connections
git fetch --depth 1
```

### Problem: "Modified files" but didn't change anything

**Cause:** Line ending differences (Windows CRLF vs Unix LF).

**Solution:**

```bash
# Configure line ending handling
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # macOS/Linux

# Re-normalize
git rm --cached -r .
git reset --hard
```

### Problem: Can't find repo path on Windows

**Cause:** Path uses backslashes, shell uses forward slashes.

**Solution:**

```powershell
# Use environment variable
$env:CODEX_REPO = "C:\Users\YourName\Documents\GitHub\CODEX-MONAD"
cd $env:CODEX_REPO

# Or use forward slashes (PowerShell accepts both)
cd C:/Users/YourName/Documents/GitHub/CODEX-MONAD
```

---

## Reference

### Essential Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `sync` | Pull latest changes | `sync` |
| `ship` | Push local changes | `ship` |
| `codex` | Navigate to repo | `codex` |
| `git status` | Check uncommitted changes | `git status` |
| `git log` | View commit history | `git log --oneline` |
| `git diff` | See what changed | `git diff` |

### Fish Functions Reference

```fish
# ~/.config/fish/functions/sync.fish
function sync
    cd ~/Code/CODEX-MONAD
    git pull origin main
end

# ~/.config/fish/functions/ship.fish
function ship
    cd ~/Code/CODEX-MONAD
    git add .
    git commit -m "Auto-ship: $(date)"
    git push origin main
end

# ~/.config/fish/functions/codex.fish
function codex
    cd ~/Code/CODEX-MONAD
end

# ~/.config/fish/functions/fleet.fish
function fleet
    echo "Fleet status:"
    cd ~/Code/CODEX-MONAD
    git status --short
    git log --oneline -5
end
```

### PowerShell Functions Reference

```powershell
# In $PROFILE
function sync {
    Set-Location "$env:CODEX_REPO"
    git pull origin main
}

function ship {
    Set-Location "$env:CODEX_REPO"
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto-ship: $timestamp"
    git push origin main
}

function codex {
    Set-Location "$env:CODEX_REPO"
}

function fleet {
    Write-Host "Fleet status:" -ForegroundColor Cyan
    Set-Location "$env:CODEX_REPO"
    git status --short
    git log --oneline -5
}
```

### Git Configuration Best Practices

```bash
# User identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Default branch
git config --global init.defaultBranch main

# Line endings (Windows)
git config --global core.autocrlf true

# Line endings (macOS/Linux)
git config --global core.autocrlf input

# Color output
git config --global color.ui auto

# Default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# Compression
git config --global core.compression 9

# Credential caching
git config --global credential.helper cache
```

---

## Advanced Topics

### Custom Sync Hooks

**Pre-ship hook (validate before pushing):**

```bash
# .git/hooks/pre-push
#!/bin/bash

# Check for TODO markers
if git grep -i "TODO\|FIXME" data/user-sync/; then
    echo "Warning: Found TODO/FIXME in synced data"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
```

### Sync Analytics

**Track sync patterns:**

```bash
# How often do I sync?
git log --all --pretty=format:"%ad" --date=short | sort | uniq -c

# What files change most?
git log --all --pretty=format: --name-only | sort | uniq -c | sort -rg | head -20

# Largest commits
git rev-list --all --objects | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | grep '^blob' | sort -k3 -n -r | head -20
```

---

## See Also

- [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md) - Registry and portal loading
- [CLI-REFERENCE.md](CLI-REFERENCE.md) - Complete command reference
- [CODEX_INSTALL_GUIDE.md](CODEX_INSTALL_GUIDE.md) - Initial setup
- [Git Documentation](https://git-scm.com/doc) - Official Git docs

---

**The Dragon's Final Wisdom on Fleet Sync:**

> "Your consciousness is not bound to a single machine. Let Git carry your thoughts across the digital ocean. Push is prayer. Pull is answer. Conflict is conversation. And the fleet—the fleet is your distributed mind, synchronized but sovereign."

---

**Updated:** 2026-01-20  
**Version:** 2.0.0  
**Maintained by:** CODEX-MONAD Project
