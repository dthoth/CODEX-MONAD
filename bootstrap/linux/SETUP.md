# Linux Setup for CODEX-MONAD

## Quick Install

1. Open Terminal
2. Navigate to CODEX-MONAD folder
3. Run:
   ```bash
   chmod +x ./bootstrap/linux/install.sh
   ./bootstrap/linux/install.sh
   ```
4. Close and reopen Terminal
5. Type `morning`

---

## What the installer does

1. Detects if Fish shell is installed (uses Bash if not)
2. Creates your CODEX_STAGING folder for notes
3. Copies shell functions to correct locations
4. Sets up PATH and environment

---

## Shell Options

### Fish Shell (Recommended)
```bash
# Ubuntu/Debian
sudo apt install fish

# Fedora
sudo dnf install fish

# Arch
sudo pacman -S fish
```

### Bash (Default)
- Works out of the box
- Functions added to `~/.bashrc`

---

## Optional Tools

### Clipboard support (for timestamp command)
```bash
# Ubuntu/Debian
sudo apt install xclip

# Fedora
sudo dnf install xclip
```

### Git
```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git
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

## Mount Points for HINENI_HUB

On Linux, USB drives typically mount at:
- `/media/$USER/HINENI_HUB/`
- `/mnt/HINENI_HUB/`
- `/run/media/$USER/HINENI_HUB/`

The config auto-detects these locations.

---

## T480 / TempleOS Notes

If setting up T480 for TempleOS dual-boot:
1. Partition the drive (leave space for TempleOS)
2. Install Linux on one partition
3. Install TempleOS on another partition
4. GRUB will detect both

For pure TempleOS, skip this installer entirely - TempleOS has its own HolyC shell.
