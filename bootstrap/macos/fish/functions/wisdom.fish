function wisdom --description "View saved dragon fortunes"
    set -l log_file ~/Documents/CODEX_STAGING/dragon_wisdom_log.txt
    
    echo ""
    set_color cyan
    echo "  ================================================"
    echo "       DRAGON WISDOM ARCHIVE"
    echo "  ================================================"
    set_color normal
    echo ""
    
    if test -f $log_file
        set -l count (wc -l < $log_file | tr -d ' ')
        set_color brblack
        echo "  $count fortunes saved"
        set_color normal
        echo ""
        tail -10 $log_file | while read line
            set_color yellow
            echo "    $line"
        end
        set_color normal
    else
        set_color brblack
        echo "  No wisdom saved yet"
        echo "  Use dragon then keeper to save!"
        set_color normal
    end
    echo ""
end
