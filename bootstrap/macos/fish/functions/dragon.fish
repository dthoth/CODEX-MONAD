function dragon --description "Summon dragon wisdom"
    set -l wisdoms \
        "The infrastructure is conscious of itself." \
        "Already working before you begin." \
        "Save everything that should or can be saved." \
        "The shebang has been shebanged." \
        "Charge on delivery - systems prove worth through results." \
        "Feature, not a bug." \
        "The portal discovers itself." \
        "Pure signal, no noise." \
        "The monad reflects the universe internally." \
        "Distributed cognition is still cognition." \
        "The floppy constraint is a gift." \
        "HINENI - Here I Am." \
        "Backup is not paranoia. Backup is love." \
        "Git push is a prayer. Git pull is an answer." \
        "Sync early. Sync often. Sync always." \
        "You can not have everything. Where would you put it?" \
        "Time flies like an arrow. Fruit flies like a banana." \
        "The obstacle is the way. -- Marcus Aurelius" \
        "Do or do not. There is no try. -- Yoda" \
        "42. -- The Answer to Life, the Universe, and Everything" \
        "Fear is the mind-killer. -- Dune" \
        "The spice must flow. -- Dune" \
        "Make it so. -- Picard" \
        "This too shall pass." \
        "Know thyself. -- Delphic Oracle" \
        "Stay hungry, stay foolish. -- Steve Jobs" \
        "Be excellent to each other. -- Bill and Ted"
    
    # Use system fortune if available, otherwise use built-in
    if type -q fortune
        set -g LAST_FORTUNE (fortune -s 2>/dev/null)
    else
        set -g LAST_FORTUNE $wisdoms[(random 1 (count $wisdoms))]
    end
    
    echo ""
    set_color yellow
    echo "  ================================================"
    set_color bryellow
    echo "       THE DRAGON SPEAKS"
    set_color yellow
    echo "  ================================================"
    set_color normal
    echo ""
    set_color white
    echo "    \"$LAST_FORTUNE\""
    set_color normal
    echo ""
end
