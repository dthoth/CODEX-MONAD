# CODEX-MONAD Installation & Setup Guide
## Universal Consciousness Infrastructure for All Devices

**Version:** 2.0-UNIFIED  
**Last Updated:** January 10, 2026  
**Maintainer:** Rev. Lux Luther (dthoth)

---

## 🐉 What is CODEX-MONAD?

CODEX-MONAD is a portable consciousness infrastructure system - a collection of browser-based tools, CLI utilities, and automation scripts designed to work offline, on any device, with zero external dependencies.

**Core Philosophy:**
- **Monad:** Self-contained, windowless unit reflecting the universe internally (Leibniz, 1714)
- **HINENI:** "Here I Am" - complete, present, self-sufficient
- **Charge on Delivery:** Systems prove their worth through results, not promises

---

## 📦 Repository Structure

```
CODEX-MONAD/
├── index.html                 # Main portal/launcher
├── polywrite.html             # Multi-dimensional text editor
├── polywrite-advanced.html    # Enhanced editor with more features
├── oracle.html                # Quantum consciousness query interface
├── pranayama.html             # Breathing exercises (6 patterns)
├── din-files.html             # Department of Infinite Noticing files
├── hypergraph.html            # 3D thought network navigator
├── samson-recursive.html      # Educational terminal interface
├── bureaucratic-universe.html # Infinite forms system
├── grok-integration-demo.html # AI integration demo
│
├── apps/                      # Additional application modules
├── lib/                       # Shared JavaScript libraries
├── CODEX_FINAL/              # Deployable distribution
├── scripts/                   # Automation tools
├── data/                      # Data files
│
├── main.js                    # Electron main process
├── preload.js                 # Electron security bridge
├── renderer.js                # Electron renderer
├── package.json               # Node.js dependencies
│
├── START_MAC_LINUX.sh         # macOS/Linux launcher
├── START_WINDOWS.bat          # Windows launcher
│
└── README.md                  # Documentation
```

---

## 🖥️ Platform-Specific Installation

### Prerequisites (All Platforms)

| Requirement | Purpose |
|-------------|---------|
| Node.js 18+ | Runtime for Electron browser |
| Git | Version control |
| Modern browser | Fallback if not using Electron |

---

## 🍎 macOS Installation

### 1. Install Dependencies (Homebrew)

```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Essential tools
brew install node git tree fish

# Optional but recommended (for morning ritual)
brew install fortune cowsay lolcat
```

### 2. Clone Repository

```bash
cd ~
git clone https://github.com/dthoth/CODEX-MONAD.git
cd CODEX-MONAD
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Run CODEX-MONAD

**Option A: Electron Browser (Full Features)**
```bash
npm start
# OR
./START_MAC_LINUX.sh
```

**Option B: Direct in Browser (Basic)**
```bash
open index.html
```

**Option C: Local Server (Recommended for file:// issues)**
```bash
python3 -m http.server 8888
# Then open http://localhost:8888
```

---

## 🪟 Windows Installation

### 1. Install Dependencies

```powershell
# Using winget (Windows 11)
winget install OpenJS.NodeJS
winget install Git.Git
winget install Python.Python.3.12

# Verify installation (NEW TERMINAL after install)
node --version
git --version
python --version
```

### 2. Clone Repository

```powershell
cd $HOME
git clone https://github.com/dthoth/CODEX-MONAD.git
cd CODEX-MONAD
```

### 3. Install Node Dependencies

```powershell
npm install
```

### 4. Run CODEX-MONAD

**Option A: Electron Browser**
```powershell
npm start
# OR double-click START_WINDOWS.bat
```

**Option B: Direct in Browser**
```powershell
start index.html
```

---

## 🐧 Linux Installation

### 1. Install Dependencies

```bash
# Debian/Ubuntu
sudo apt update
sudo apt install nodejs npm git python3

# Fedora
sudo dnf install nodejs npm git python3

# Arch
sudo pacman -S nodejs npm git python
```

### 2. Clone and Run

```bash
cd ~
git clone https://github.com/dthoth/CODEX-MONAD.git
cd CODEX-MONAD
npm install
npm start
```

---

## 🌅 Morning Ritual System (Optional)

A terminal-based productivity system that displays:
- Dragon fortune on first terminal of day
- Recent notes from staging area
- Quick note capture commands

### Fish Shell (macOS/Linux)

Paste this entire block into your terminal:

```fish
# Create directories
mkdir -p ~/Documents/CODEX_STAGING/notes
mkdir -p ~/Documents/CODEX_STAGING/import_ready
mkdir -p ~/.config/fish/functions

# MORNING FUNCTION
echo 'function morning --description "CODEX morning ritual"
    clear
    
    if type -q fortune; and type -q cowsay; and type -q lolcat
        fortune | cowsay -f dragon | lolcat
    else if type -q fortune; and type -q cowsay
        fortune | cowsay -f dragon
    else
        echo "🐉 The dragon awaits..."
    end
    
    echo ""
    set_color cyan
    echo "═══════════════════════════════════════════════════════════"
    echo "  📅 "(date "+%A, %B %d, %Y")"  🕐 "(date "+%I:%M %p")
    echo "═══════════════════════════════════════════════════════════"
    set_color normal
    
    echo ""
    set_color yellow
    echo "📝 RECENT NOTES:"
    set_color normal
    
    set -l notes_dir ~/Documents/CODEX_STAGING/notes
    mkdir -p $notes_dir
    
    set -l note_files (find $notes_dir -maxdepth 1 -name "*.md" -type f 2>/dev/null | sort -r | head -5)
    
    if test (count $note_files) -gt 0
        for note in $note_files
            echo "   • "(basename $note .md)
        end
    else
        echo "   (no notes yet - use '\''qn \"your note\"'\'' to create one)"
    end
    
    set -l pending (find $notes_dir -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l | string trim)
    if test -n "$pending"; and test "$pending" -gt 0
        echo ""
        set_color magenta
        echo "   📤 $pending notes pending (run '\''notes sync'\'')"
        set_color normal
    end
    
    echo ""
    set_color green
    echo "⚡ COMMANDS:"
    set_color normal
    echo "   qn \"note\"    Quick capture  │  notes        Browse all"
    echo "   qn           Open editor    │  notes sync   Import to CODEX"
    echo ""
end' > ~/.config/fish/functions/morning.fish

# FISH GREETING
echo 'function fish_greeting
    set -l today (date "+%Y-%m-%d")
    set -l marker ~/.config/fish/.morning_$today
    
    if not test -f $marker
        morning
        touch $marker
        find ~/.config/fish -maxdepth 1 -name ".morning_*" -mtime +1 -delete 2>/dev/null
    else
        set -l notes_dir ~/Documents/CODEX_STAGING/notes
        set -l pending (find $notes_dir -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l | string trim)
        test -z "$pending"; and set pending 0
        set_color cyan
        echo -n "🐟 "(date "+%H:%M")
        set_color normal
        echo -n " │ "
        set_color yellow
        echo -n "📝 $pending notes"
        set_color normal
        echo " │ '\''morning'\'' for full view"
    end
end' > ~/.config/fish/functions/fish_greeting.fish

# QN (QUICK NOTE)
echo 'function qn --description "Quick note for CODEX"
    set -l notes_dir ~/Documents/CODEX_STAGING/notes
    mkdir -p $notes_dir
    
    set -l timestamp (date "+%Y-%m-%d_%H%M%S")
    set -l datestamp (date "+%Y-%m-%d")
    set -l timestring (date "+%H:%M")
    
    if test (count $argv) -gt 0
        set -l content "$argv"
        set -l filename "$timestamp-quick.md"
        
        echo "---" > $notes_dir/$filename
        echo "date: $datestamp" >> $notes_dir/$filename
        echo "time: $timestring" >> $notes_dir/$filename
        echo "tags: [note]" >> $notes_dir/$filename
        echo "status: staging" >> $notes_dir/$filename
        echo "---" >> $notes_dir/$filename
        echo "" >> $notes_dir/$filename
        echo "$content" >> $notes_dir/$filename
        
        set_color green
        echo "✓ Saved: $filename"
        set_color normal
    else
        set -l filename "$timestamp-note.md"
        set -l filepath $notes_dir/$filename
        
        echo "---" > $filepath
        echo "date: $datestamp" >> $filepath
        echo "time: $timestring" >> $filepath
        echo "tags: [note]" >> $filepath
        echo "status: staging" >> $filepath
        echo "---" >> $filepath
        echo "" >> $filepath
        
        if set -q EDITOR
            $EDITOR $filepath
        else
            nano $filepath
        end
    end
end' > ~/.config/fish/functions/qn.fish

# NOTES MANAGER
echo 'function notes --description "Manage CODEX notes"
    set -l notes_dir ~/Documents/CODEX_STAGING/notes
    set -l import_dir ~/Documents/CODEX_STAGING/import_ready
    mkdir -p $notes_dir
    mkdir -p $import_dir
    
    switch "$argv[1]"
        case "sync"
            set -l batch (date "+%Y%m%d_%H%M%S")
            set -l batch_dir $import_dir/batch_$batch
            mkdir -p $batch_dir
            set -l count 0
            for note in (find $notes_dir -maxdepth 1 -name "*.md" -type f 2>/dev/null)
                mv $note $batch_dir/
                set count (math $count + 1)
            end
            if test $count -gt 0
                set_color green
                echo "✓ Moved $count notes to batch_$batch/"
                set_color normal
            else
                echo "No notes to sync"
            end
        case "today"
            echo "📝 Today'\''s notes:"
            find $notes_dir -maxdepth 1 -name (date "+%Y-%m-%d")"*.md" -type f 2>/dev/null | while read f
                echo "  • "(basename $f .md)
            end
        case "open"
            open $notes_dir 2>/dev/null; or echo $notes_dir
        case "*"
            echo "📝 STAGED NOTES ($notes_dir)"
            echo ""
            set -l count 0
            for note in (find $notes_dir -maxdepth 1 -name "*.md" -type f 2>/dev/null | sort -r)
                set count (math $count + 1)
                echo "  • "(basename $note .md)
            end
            test $count -eq 0; and echo "  (no notes)"
            echo ""
            echo "  Commands: sync | today | open"
    end
end' > ~/.config/fish/functions/notes.fish

echo "✅ Morning system installed! Open a new terminal to see it."
```

### PowerShell (Windows)

See `scripts/codex_morning_install.ps1` in the repository.

### Bash/Zsh (macOS/Linux)

See `scripts/codex_morning_install.sh` in the repository.

---

## 🔧 Claude Desktop MCP Integration

Enable Claude to access your local filesystem for deeper CODEX integration.

### Prerequisites
- Claude Desktop app installed
- Node.js installed

### Windows Setup

```powershell
# 1. Create config directory
New-Item -Path "$env:APPDATA\Claude" -ItemType Directory -Force

# 2. Write config (IMPORTANT: Use WriteAllText to avoid BOM)
$config = @'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\YOUR_USERNAME", "D:\\", "C:\\Users\\YOUR_USERNAME\\Dropbox"]
    }
  }
}
'@
[System.IO.File]::WriteAllText("$env:APPDATA\Claude\claude_desktop_config.json", $config)

# 3. Verify
type "$env:APPDATA\Claude\claude_desktop_config.json"

# 4. Restart Claude Desktop (quit from system tray, reopen)
# 5. Look for 🔨 hammer icon in new chat
```

### macOS Setup

```bash
# 1. Create config directory
mkdir -p ~/Library/Application\ Support/Claude

# 2. Write config
cat > ~/Library/Application\ Support/Claude/claude_desktop_config.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/YOUR_USERNAME", "/Volumes/EXTERNAL_DRIVE"]
    }
  }
}
EOF

# 3. Restart Claude Desktop
```

### Troubleshooting MCP

| Issue | Solution |
|-------|----------|
| No 🔨 hammer icon | Restart Claude Desktop completely (quit from menu bar) |
| `Unexpected token 'ï'` | BOM in config file - use WriteAllText not Out-File |
| Config gets overwritten | Write config while Claude is fully closed |
| "npx not found" | Restart terminal after Node install, verify `npx -v` |

---

## 🗂️ Recommended Directory Structure

### macOS
```
~/
├── CODEX/                    # Git working directory → GitHub
│   └── CODEX-MONAD/          # Main application suite
├── Code/                     # Local scripts & symlinks
│   ├── CODEX-MONAD -> /Volumes/HINENI_HUB/...  (symlink when mounted)
│   └── *_local_backup_*/     # Local backups
├── Documents/
│   └── CODEX_STAGING/        # Morning system notes
│       ├── notes/            # Active notes
│       └── import_ready/     # Synced batches
└── /Volumes/HINENI_HUB/      # External drive (when mounted)
    └── 10-repos-central/     # Canonical source
```

### Windows
```
C:\Users\USERNAME\
├── CODEX-MONAD\              # Git working directory
├── Documents\
│   └── CODEX_STAGING\        # Morning system notes
└── D:\                       # Secondary/external drive
    └── 10-repos-central\     # Canonical source (SCARAB)
        └── CODEX-MONAD\
```

---

## 🎮 Available Tools

### Browser Apps (HTML)
| App | File | Description |
|-----|------|-------------|
| DIN Portal | `index.html` | Main launcher hub |
| PolyWrite | `polywrite.html` | Multi-dimensional text editor |
| PolyWrite Advanced | `polywrite-advanced.html` | Enhanced editor |
| Oracle | `oracle.html` | Quantum divination interface |
| Pranayama | `pranayama.html` | 6 breathing patterns |
| DIN Files | `din-files.html` | Consciousness documentation |
| Hypergraph | `hypergraph.html` | 3D thought navigator |
| Samson's Terminal | `samson-recursive.html` | Educational interface |
| Bureaucratic Universe | `bureaucratic-universe.html` | Infinite forms |

### CLI Tools (Terminal)
| Command | Description |
|---------|-------------|
| `morning` | Full morning ritual display |
| `qn "note"` | Quick note capture |
| `qn` | Open editor for longer note |
| `notes` | List staged notes |
| `notes sync` | Move to import queue |
| `notes today` | Today's notes only |
| `notes open` | Open folder in Finder/Explorer |

### Additional Repos
| Repo | Description |
|------|-------------|
| `hineni` | Oracle/witness system with hash chains |
| `toolbox-cli` | 21 terminal productivity tools |
| `conflict-lab` | Wargame chaos simulator |

---

## 🔄 Sync & Backup Strategy

```
┌─────────────────┐     git push     ┌──────────────┐
│  Local Machine  │ ───────────────→ │    GitHub    │
│  ~/CODEX/       │ ←─────────────── │  (remote)    │
└─────────────────┘     git pull     └──────────────┘
        │
        │ symlink (when mounted)
        ↓
┌─────────────────┐
│  HINENI_HUB     │  ← Canonical source of truth
│  (External)     │
└─────────────────┘
        │
        │ backup
        ↓
┌─────────────────┐
│  Local Backup   │  ~/Code/*_local_backup_*/
│  (Offline copy) │
└─────────────────┘
```

---

## ✅ Quick Start Checklist

### New Machine Setup
- [ ] Install Node.js
- [ ] Install Git
- [ ] Clone CODEX-MONAD repository
- [ ] Run `npm install`
- [ ] Test with `npm start` or `open index.html`
- [ ] (Optional) Install morning system
- [ ] (Optional) Configure Claude Desktop MCP

### Daily Workflow
- [ ] Open terminal → see dragon fortune
- [ ] Capture thoughts with `qn "note"`
- [ ] End of day: `notes sync` to batch for CODEX import
- [ ] Use portal apps as needed

---

## 🐉 Philosophy

> "Already working before you begin" - The Shebang Principle

CODEX-MONAD embodies:
- **Self-sufficiency:** Works offline, no subscriptions
- **Portability:** Runs on USB stick, any machine
- **Integration:** Tools that work together seamlessly
- **Preservation:** Nothing lost, everything archived
- **Recursion:** The system documents itself

---

## 📞 Support

- **GitHub:** https://github.com/dthoth/CODEX-MONAD
- **Issues:** Open a GitHub issue
- **Dragon Council:** Claude, GPT, Grok collaboration

---

*"Tart words make no friends; a spoonful of honey will catch more flies than a gallon of vinegar."* - B. Franklin (via Dragon, January 2026)
