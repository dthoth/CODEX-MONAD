#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# CODEX-MONAD Bootstrap Installer for Linux
# Run this script from the CODEX-MONAD directory
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "  ================================================"
echo "       CODEX-MONAD Bootstrap Installer"
echo "       Linux Edition"
echo "  ================================================"
echo ""

# --- Get script directory ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CODEX_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "  [1/5] Creating CODEX_STAGING directories..."
mkdir -p ~/Documents/CODEX_STAGING/notes
mkdir -p ~/Documents/CODEX_STAGING/import_ready
echo "        Done: ~/Documents/CODEX_STAGING"

echo "  [2/5] Detecting shell..."
if command -v fish &> /dev/null; then
    SHELL_TYPE="fish"
    echo "        Found: Fish shell"
else
    SHELL_TYPE="bash"
    echo "        Found: Bash"
    echo "        Tip: Install Fish with your package manager for better experience"
fi

echo "  [3/5] Installing shell functions..."
if [ "$SHELL_TYPE" = "fish" ]; then
    # Fish installation - copy from macOS (they're the same)
    mkdir -p ~/.config/fish/functions
    
    # Check if macOS fish functions exist, else use shared
    if [ -d "$SCRIPT_DIR/../macos/fish/functions" ]; then
        cp "$SCRIPT_DIR/../macos/fish/functions/"*.fish ~/.config/fish/functions/
    fi
    
    echo "        Installed Fish functions to ~/.config/fish/functions/"
    
    # Add config if not present
    if ! grep -q "CODEX_STAGING" ~/.config/fish/config.fish 2>/dev/null; then
        cat >> ~/.config/fish/config.fish << 'EOF'

# --- CODEX-MONAD Configuration ---
set -gx CODEX_STAGING ~/Documents/CODEX_STAGING
set -gx NOTES_DIR $CODEX_STAGING/notes

# Auto-detect CODEX repo
for loc in /media/$USER/HINENI_HUB/10-repos-central/CODEX-MONAD \
           /mnt/HINENI_HUB/10-repos-central/CODEX-MONAD \
           ~/Code/CODEX-MONAD \
           ~/Documents/GitHub/CODEX-MONAD \
           ~/CODEX/CODEX-MONAD
    if test -d $loc
        set -gx CODEX_REPO $loc
        break
    end
end
EOF
        echo "        Added config to ~/.config/fish/config.fish"
    fi
else
    # Bash installation
    if ! grep -q "CODEX_STAGING" ~/.bashrc 2>/dev/null; then
        cat "$SCRIPT_DIR/bashrc_additions.sh" >> ~/.bashrc
        echo "        Added functions to ~/.bashrc"
    else
        echo "        Bash config already present"
    fi
fi

echo "  [4/5] Detecting device..."
DEVICE_NAME=$(hostname)
echo "        Device: $DEVICE_NAME"

echo "  [5/5] Checking for dependencies..."
if command -v git &> /dev/null; then
    echo "        Git found: $(which git)"
else
    echo "        Git not found (install with: sudo apt install git)"
fi

if command -v xclip &> /dev/null; then
    echo "        xclip found (clipboard support)"
else
    echo "        xclip not found (install for timestamp clipboard: sudo apt install xclip)"
fi

echo ""
echo "  ================================================"
echo "       INSTALLATION COMPLETE"
echo "  ================================================"
echo ""
echo "  Next steps:"
echo "    1. Close this terminal window"
echo "    2. Open a new terminal window"
echo "    3. Type: morning"
echo ""
echo "  The dragon awaits. 🐉"
echo ""
