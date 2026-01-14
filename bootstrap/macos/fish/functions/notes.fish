function notes --description "Browse and manage staged notes"
    set -l notes_dir ~/Documents/CODEX_STAGING/notes
    set -l import_dir ~/Documents/CODEX_STAGING/import_ready
    
    mkdir -p $notes_dir 2>/dev/null
    mkdir -p $import_dir 2>/dev/null
    
    if test (count $argv) -gt 0
        switch $argv[1]
            case sync
                set -l batch "$import_dir/batch_"(date "+%Y%m%d_%H%M%S")
                mkdir -p $batch
                set -l files (ls $notes_dir/*.md 2>/dev/null)
                if test (count $files) -gt 0
                    mv $notes_dir/*.md $batch/
                    echo ""
                    set_color cyan
                    echo "  [NOTES SYNCED]"
                    set_color brblack
                    echo "  Moved "(count $files)" notes to batch"
                    set_color normal
                    echo ""
                else
                    set_color yellow
                    echo "  No notes to sync"
                    set_color normal
                end
            case today
                set -l today (date "+%Y-%m-%d")
                echo ""
                set_color yellow
                echo "  TODAY'S NOTES:"
                set_color normal
                ls $notes_dir/*$today*.md 2>/dev/null | while read f
                    set_color brblack
                    echo "    "(basename $f .md)
                end
                set_color normal
                echo ""
            case open
                open $notes_dir
            case '*'
                echo "  Usage: notes [sync|today|open]"
        end
    else
        set -l files (ls $notes_dir/*.md 2>/dev/null)
        set -l count (count $files)
        
        echo ""
        set_color yellow
        echo "  STAGED NOTES ($count pending):"
        set_color normal
        
        if test $count -gt 0
            ls -t $notes_dir/*.md 2>/dev/null | head -5 | while read f
                set_color brblack
                echo "    "(basename $f .md)
            end
        end
        set_color normal
        echo ""
    end
end
