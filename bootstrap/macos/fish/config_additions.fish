# ═══════════════════════════════════════════════════════════════════════════
# CODEX-MONAD Configuration for Fish Shell
# Auto-detect repository location
# ═══════════════════════════════════════════════════════════════════════════

# --- Auto-detect CODEX repo ---
set -l possible_paths \
    /Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD \
    ~/Code/CODEX-MONAD \
    ~/Documents/GitHub/CODEX-MONAD \
    ~/GitHub/CODEX-MONAD \
    ~/CODEX/CODEX-MONAD

for loc in $possible_paths
    if test -d $loc
        set -gx CODEX_REPO $loc
        break
    end
end

# --- Configuration ---
set -gx CODEX_STAGING ~/Documents/CODEX_STAGING
set -gx NOTES_DIR $CODEX_STAGING/notes

# --- Ensure directories exist ---
mkdir -p $NOTES_DIR 2>/dev/null
mkdir -p $CODEX_STAGING/import_ready 2>/dev/null
