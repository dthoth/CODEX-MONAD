function codex --description "Navigate to CODEX-MONAD repository"
    # Auto-detect if not set
    if not set -q CODEX_REPO
        set -l locations \
            /Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD \
            ~/Code/CODEX-MONAD \
            ~/Documents/GitHub/CODEX-MONAD \
            ~/GitHub/CODEX-MONAD \
            ~/CODEX/CODEX-MONAD
        
        for loc in $locations
            if test -d $loc
                set -gx CODEX_REPO $loc
                break
            end
        end
    end
    
    if not set -q CODEX_REPO; or not test -d $CODEX_REPO
        set_color red
        echo "  [ERROR] CODEX-MONAD not found"
        set_color brblack
        echo "  Checked: HINENI_HUB, ~/Code, ~/Documents/GitHub, ~/CODEX"
        set_color normal
        return 1
    end
    
    cd $CODEX_REPO
    
    echo ""
    set_color magenta
    echo "  ================================================"
    echo "       CODEX-MONAD"
    echo "  ================================================"
    set_color normal
    echo ""
    set_color brblack
    echo "  $CODEX_REPO"
    set_color normal
    echo ""
    
    if test -d .git
        set -l branch (git branch --show-current 2>/dev/null)
        set -l changes (git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        
        set_color cyan
        echo "  Branch: $branch"
        
        if test $changes -gt 0
            set_color yellow
            echo "  Changes: $changes uncommitted"
        else
            set_color green
            echo "  Status: Clean"
        end
        set_color normal
    end
    echo ""
end
