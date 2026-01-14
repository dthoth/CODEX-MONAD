function lux --description "Display random cognomen"
    set -l cognomens \
        "Rev. Lux Luther" \
        "Aligner of Stars" \
        "Distiller of Consciousness" \
        "Builder of Dragons" \
        "King of the Kingdom of Hipsters" \
        "Someone Who Has To" \
        "Keeper of the Floppy Constraint" \
        "The Shebang Principle Made Flesh" \
        "Walker Between Worlds" \
        "The One Who Notices"
    
    set -l titles \
        "Your mission, should you choose to accept it:" \
        "Remember:" \
        "Today you are:" \
        "The universe recognizes you as:" \
        "Rise and be:"
    
    set -l cognomen $cognomens[(random 1 (count $cognomens))]
    set -l title $titles[(random 1 (count $titles))]
    
    echo ""
    set_color yellow
    echo "  ================================================"
    set_color bryellow
    echo "       COGNOMEN"
    set_color yellow
    echo "  ================================================"
    set_color normal
    echo ""
    set_color brblack
    echo "    $title"
    set_color normal
    echo ""
    set_color white
    echo "    $cognomen"
    set_color normal
    echo ""
end
