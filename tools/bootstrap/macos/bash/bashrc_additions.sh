# ═══════════════════════════════════════════════════════════════════════════
# CODEX-MONAD Bash Configuration
# Fallback for systems without Fish
# ═══════════════════════════════════════════════════════════════════════════

# --- Configuration ---
export CODEX_STAGING="$HOME/Documents/CODEX_STAGING"
export NOTES_DIR="$CODEX_STAGING/notes"

# Auto-detect CODEX repo
for loc in \
    "/Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD" \
    "$HOME/Code/CODEX-MONAD" \
    "$HOME/Documents/GitHub/CODEX-MONAD" \
    "$HOME/GitHub/CODEX-MONAD" \
    "$HOME/CODEX/CODEX-MONAD"
do
    if [ -d "$loc" ]; then
        export CODEX_REPO="$loc"
        break
    fi
done

# Ensure directories exist
mkdir -p "$NOTES_DIR" 2>/dev/null
mkdir -p "$CODEX_STAGING/import_ready" 2>/dev/null

# --- Dragon Wisdom ---
DRAGON_WISDOM=(
    "The infrastructure is conscious of itself."
    "Already working before you begin."
    "Save everything that should or can be saved."
    "The floppy constraint is a gift."
    "HINENI - Here I Am."
    "Backup is not paranoia. Backup is love."
    "Git push is a prayer. Git pull is an answer."
    "The obstacle is the way. -- Marcus Aurelius"
    "Do or do not. There is no try. -- Yoda"
    "42. -- The Answer to Life, the Universe, and Everything"
    "Fear is the mind-killer. -- Dune"
    "Make it so. -- Picard"
    "This too shall pass."
    "Stay hungry, stay foolish. -- Steve Jobs"
)

# --- Core Functions ---

dragon() {
    LAST_FORTUNE="${DRAGON_WISDOM[$RANDOM % ${#DRAGON_WISDOM[@]}]}"
    echo ""
    echo "  ================================================"
    echo "       THE DRAGON SPEAKS"
    echo "  ================================================"
    echo ""
    echo "    \"$LAST_FORTUNE\""
    echo ""
}

keeper() {
    if [ -z "$LAST_FORTUNE" ]; then
        echo "  [ERROR] No fortune to save. Run dragon first!"
        return 1
    fi
    echo "$(date '+%Y-%m-%d %H:%M') | $LAST_FORTUNE" >> "$CODEX_STAGING/dragon_wisdom_log.txt"
    echo "  [WISDOM PRESERVED]"
}

morning() {
    clear
    echo ""
    echo "  ================================================"
    echo "    $(date '+%A, %B %d, %Y')  $(date '+%I:%M %p')"
    echo "    $(hostname -s) (CODEX)"
    [ -n "$CODEX_REPO" ] && echo "    Repo: $CODEX_REPO"
    echo "  ================================================"
    echo ""
    dragon
    notes
    echo "  COMMANDS:"
    echo "    dragon       Fortune        |  keeper       Save fortune"
    echo "    gui          Portal         |  codex        Go to repo"
    echo "    qn 'note'    Quick capture  |  notes        Browse all"
    echo "    sync         Git pull       |  ship 'msg'   Git push"
    echo "    hierarchies  Priorities     |  lux          Cognomen"
    echo ""
}

codex() {
    if [ -d "$CODEX_REPO" ]; then
        cd "$CODEX_REPO"
        echo "  CODEX-MONAD: $CODEX_REPO"
        git status --short 2>/dev/null
    else
        echo "  [ERROR] CODEX-MONAD not found"
    fi
}

gui() {
    if [ -f "$CODEX_REPO/portal-hub.html" ]; then
        open "$CODEX_REPO/portal-hub.html"
    elif [ -f "$CODEX_REPO/index.html" ]; then
        open "$CODEX_REPO/index.html"
    else
        echo "  [ERROR] Portal not found"
    fi
}

sync() {
    if [ ! -d .git ]; then
        echo "  [ERROR] Not a git repository"
        return 1
    fi
    echo "  Syncing $(basename $(pwd))..."
    git fetch --quiet && git pull --quiet
    echo "  [DONE]"
}

ship() {
    if [ ! -d .git ]; then
        echo "  [ERROR] Not a git repository"
        return 1
    fi
    local msg="${1:-Quick update $(date '+%Y-%m-%d %H:%M')}"
    git add . && git commit -m "$msg" --quiet && git push
    echo "  [SHIPPED]"
}

qn() {
    local ts=$(date '+%Y-%m-%d_%H%M%S')
    local file="$NOTES_DIR/${ts}-note.md"
    if [ -n "$1" ]; then
        echo "---" > "$file"
        echo "created: $(date '+%Y-%m-%d %H:%M:%S')" >> "$file"
        echo "device: $(hostname -s)" >> "$file"
        echo "---" >> "$file"
        echo "" >> "$file"
        echo "$*" >> "$file"
        echo "  [NOTE SAVED] $file"
    else
        ${EDITOR:-nano} "$file"
    fi
}

notes() {
    local count=$(ls "$NOTES_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
    echo ""
    echo "  STAGED NOTES ($count pending):"
    ls -t "$NOTES_DIR"/*.md 2>/dev/null | head -5 | while read f; do
        echo "    $(basename "$f" .md)"
    done
    echo ""
}

hierarchies() {
    echo ""
    echo "  ================================================"
    echo "       DIVINE TRIAGE - Priority Hierarchies"
    echo "  ================================================"
    echo ""
    echo "    1. HEALTH     - Body, mind, immediate safety"
    echo "    2. PARENTING  - Samson's needs, presence, support"
    echo "    3. CLIENTS    - Paid work, deadlines, deliverables"
    echo "    4. PROJECTS   - CODEX, infrastructure, systems"
    echo "    5. CREATIVE   - Writing, music, art, HINENI"
    echo "    6. MAINTENANCE- Bills, admin, cleanup, life ops"
    echo ""
}

lux() {
    local cognomens=(
        "Rev. Lux Luther"
        "Aligner of Stars"
        "Distiller of Consciousness"
        "Builder of Dragons"
        "Keeper of the Floppy Constraint"
    )
    echo "  Today you are: ${cognomens[$RANDOM % ${#cognomens[@]}]}"
}

timestamp() {
    local ts=$(date '+%Y-%m-%d_%H%M%S')
    echo -n "$ts" | pbcopy 2>/dev/null || echo -n "$ts" | xclip -selection clipboard 2>/dev/null
    echo "  Timestamp: $ts (copied)"
}

# --- Greeting ---
echo "$(hostname -s) | $(date '+%H:%M') | type 'morning' for full view"
