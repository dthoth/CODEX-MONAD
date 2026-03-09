function morning --description "CODEX morning ritual"
    clear
    
    # Dragon art (15% chance)
    set -l roll (random 1 7)
    if test $roll -eq 1
        echo "        /\\___/\\"
        echo "       /       \\"
        echo "      |  #   #  |"
        echo "       \\   ^   /      CODEX DRAGON SAYS:"
        echo "        |     |__"
        echo "        /       \\"
        echo ""
    end
    
    set_color cyan
    echo "  ================================================"
    set_color white
    echo "    "(date "+%A, %B %d, %Y")"  "(date "+%I:%M %p")
    set_color brblack
    echo "    "(hostname -s)" (CODEX)"
    if set -q CODEX_REPO
        echo "    Repo: $CODEX_REPO"
    else
        set_color yellow
        echo "    [!] CODEX repo not detected"
    end
    set_color cyan
    echo "  ================================================"
    set_color normal
    
    # Dragon fortune
    dragon
    
    # Notes
    notes
    
    set_color magenta
    echo "  COMMANDS:"
    set_color normal
    echo "    dragon       Fortune        |  keeper       Save fortune"
    echo "    gui          Portal         |  codex        Go to repo"
    echo "    qn 'note'    Quick capture  |  notes        Browse all"
    echo "    sync         Git pull       |  ship 'msg'   Git push"
    echo "    fleet        All repos      |  hierarchies  Priorities"
    echo "    lux          Cognomen       |  timestamp    Copy time"
    echo ""
end
