function qn --description "Quick note capture"
    set -l notes_dir ~/Documents/CODEX_STAGING/notes
    mkdir -p $notes_dir 2>/dev/null
    
    set -l timestamp (date "+%Y-%m-%d_%H%M%S")
    set -l filename "$notes_dir/$timestamp-note.md"
    set -l datestamp (date "+%Y-%m-%d %H:%M:%S")
    set -l device (hostname -s)
    
    if test (count $argv) -gt 0
        set -l note "$argv"
        
        echo "---" > $filename
        echo "created: $datestamp" >> $filename
        echo "device: $device" >> $filename
        echo "type: quick-note" >> $filename
        echo "---" >> $filename
        echo "" >> $filename
        echo "$note" >> $filename
        
        echo ""
        set_color green
        echo "  [NOTE SAVED]"
        set_color brblack
        echo "  $filename"
        set_color normal
        echo ""
    else
        # Open in default editor
        if set -q EDITOR
            $EDITOR $filename
        else if type -q code
            code $filename
        else if type -q nano
            nano $filename
        else
            open $filename
        end
    end
end
