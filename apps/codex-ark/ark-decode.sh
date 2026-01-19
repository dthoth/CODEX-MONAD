#!/bin/bash
# CODEX-ARK Shell Decoder v0.1
# Emergency extraction - no dependencies beyond bash/awk

ARK_FILE="$1"
ACTION="${2:---list}"
TARGET="$3"

if [ -z "$ARK_FILE" ] || [ ! -f "$ARK_FILE" ]; then
    echo "CODEX-ARK Decoder"
    echo "Usage: $0 <archive.ark> [--list|--extract|--get <path>]"
    exit 1
fi

list_entries() {
    awk '
    /^path: / { path = substr($0, 7) }
    /^size: / { size = substr($0, 7) }
    /^category: / { cat = substr($0, 11); printf "%-12s %8s  %s\n", cat, size "B", path }
    ' "$ARK_FILE"
}

get_entry() {
    local target_path="$1"
    awk -v target="$target_path" '
    BEGIN { found = 0; capturing = 0 }
    /^path: / { current_path = substr($0, 7); if (current_path == target) found = 1 }
    /\[CONTENT BEGINS\]/ { if (found) { capturing = 1; next } }
    /\[CONTENT ENDS\]/ { if (capturing) { exit } }
    capturing { print }
    ' "$ARK_FILE"
}

extract_all() {
    local outdir="./extracted"
    mkdir -p "$outdir"
    local current_path="" capturing=0 content=""
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^path:\ (.+)$ ]]; then
            current_path="${BASH_REMATCH[1]}"
        elif [[ "$line" == "[CONTENT BEGINS]" ]]; then
            capturing=1; content=""
        elif [[ "$line" == "[CONTENT ENDS]" ]]; then
            if [ $capturing -eq 1 ] && [ -n "$current_path" ]; then
                local filepath="$outdir/$current_path"
                mkdir -p "$(dirname "$filepath")"
                printf '%s' "$content" > "$filepath"
                echo "Extracted: $current_path"
            fi
            capturing=0; content=""
        elif [ $capturing -eq 1 ]; then
            [ -n "$content" ] && content="$content"$'\n'"$line" || content="$line"
        fi
    done < "$ARK_FILE"
    echo "Done. Files extracted to $outdir/"
}

case "$ACTION" in
    --list|-l) list_entries ;;
    --extract|-x) extract_all ;;
    --get|-g) [ -z "$TARGET" ] && echo "Error: --get requires path" && exit 1; get_entry "$TARGET" ;;
    *) echo "Unknown: $ACTION"; exit 1 ;;
esac
