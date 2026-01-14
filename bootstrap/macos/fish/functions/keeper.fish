function keeper --description "Save last dragon fortune to wisdom log"
    if not set -q LAST_FORTUNE; or test -z "$LAST_FORTUNE"
        echo ""
        set_color red
        echo "  [ERROR] No fortune to save"
        set_color brblack
        echo "  Run dragon first!"
        set_color normal
        echo ""
        return 1
    end
    
    set -l log_file ~/Documents/CODEX_STAGING/dragon_wisdom_log.txt
    set -l timestamp (date "+%Y-%m-%d %H:%M")
    
    echo "$timestamp | $LAST_FORTUNE" >> $log_file
    
    echo ""
    set_color green
    echo "  [WISDOM PRESERVED]"
    set_color brblack
    echo "  Saved to dragon_wisdom_log.txt"
    set_color normal
    echo ""
end
