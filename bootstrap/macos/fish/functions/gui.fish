function gui --description "Launch CODEX portal"
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
    
    if not set -q CODEX_REPO
        set_color red
        echo "  [ERROR] CODEX-MONAD not found"
        set_color normal
        return 1
    end
    
    echo ""
    set_color cyan
    echo "  ================================================"
    echo "       CODEX PORTAL"
    echo "  ================================================"
    set_color normal
    echo ""
    
    # Check for portal-hub.html first (personal), then index.html (public)
    if test -f "$CODEX_REPO/portal-hub.html"
        set_color brblack
        echo "    Opening portal-hub.html..."
        set_color normal
        open "$CODEX_REPO/portal-hub.html"
    else if test -f "$CODEX_REPO/index.html"
        set_color brblack
        echo "    Opening index.html..."
        set_color normal
        open "$CODEX_REPO/index.html"
    else
        # Try npm start for Electron
        if type -q npm
            set_color brblack
            echo "    Launching Electron..."
            set_color normal
            pushd $CODEX_REPO
            npm start
            popd
        else
            set_color red
            echo "    [ERROR] No portal found"
            set_color normal
        end
    end
    echo ""
end
