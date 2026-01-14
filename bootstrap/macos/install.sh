#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# CODEX-MONAD Bootstrap Installer for macOS
# Run this script from the CODEX-MONAD directory
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "  ================================================"
echo "       CODEX-MONAD Bootstrap Installer"
echo "       macOS Edition"
echo "  ================================================"
echo ""

# --- Get script directory ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CODEX_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# --- Check we're in the right place ---
if [ ! -d "$SCRIPT_DIR/fish" ]; then
    echo "  [ERROR] Cannot find fish/ folder"
    echo "  Make sure you're running from CODEX-MONAD/bootstrap/macos/"
    exit 1
fi

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
    echo "        Found: Bash (Fish not installed)"
    echo "        Tip: Install Fish with 'brew install fish' for better experience"
fi

echo "  [3/5] Installing shell functions..."
if [ "$SHELL_TYPE" = "fish" ]; then
    # Fish installation
    mkdir -p ~/.config/fish/functions
    cp "$SCRIPT_DIR/fish/functions/"*.fish ~/.config/fish/functions/
    echo "        Installed Fish functions to ~/.config/fish/functions/"
    
    # Also add the greeting to config.fish if not present
    if ! grep -q "CODEX_STAGING" ~/.config/fish/config.fish 2>/dev/null; then
        cat "$SCRIPT_DIR/fish/config_additions.fish" >> ~/.config/fish/config.fish
        echo "        Added config to ~/.config/fish/config.fish"
    fi
else
    # Bash installation
    if ! grep -q "CODEX_STAGING" ~/.bashrc 2>/dev/null; then
        cat "$SCRIPT_DIR/bash/bashrc_additions.sh" >> ~/.bashrc
        echo "        Added functions to ~/.bashrc"
    else
        echo "        Bash config already present"
    fi
fi

echo "  [4/5] Detecting device..."
DEVICE_NAME=$(scutil --get ComputerName 2>/dev/null || hostname -s)
echo "        Device: $DEVICE_NAME"

echo "  [5/5] Checking for Git..."
if command -v git &> /dev/null; then
    echo "        Git found: $(which git)"
else
    echo "        Git not found (install Xcode Command Line Tools)"
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
