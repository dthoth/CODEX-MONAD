#!/usr/bin/env fish
# CODEX Morning System Recovery
# Run this if your morning system stops working

echo "🚑 CODEX Morning Recovery"
echo ""

# Check 1: Functions exist?
echo "Checking functions..."
for fn in morning qn notes fish_greeting
if type -q $fn
set_color green
echo "  ✓ $fn"
set_color normal
else
set_color red
echo "  ✗ $fn MISSING"
set_color normal
end
end

# Check 2: Directories exist?
echo ""
echo "Checking directories..."
for dir in ~/.config/fish/functions ~/.config/fish/conf.d ~/Documents/CODEX_STAGING/notes
if test -d $dir
set_color green
echo "  ✓ $dir"
set_color normal
else
set_color red
echo "  ✗ $dir MISSING"
set_color normal
end
end

# Check 3: Dependencies
echo ""
echo "Checking dependencies..."
for cmd in fortune cowsay lolcat
if type -q $cmd
set_color green
echo "  ✓ $cmd"
set_color normal
else
set_color yellow
echo "  ⚠ $cmd (optional - brew install $cmd)"
set_color normal
end
end

echo ""
echo "To reinstall: fish ~/install_morning_system.fish"

