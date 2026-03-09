function sync --description "Git fetch and pull current repo"
    if not test -d .git
        set_color red
        echo "  [ERROR] Not a git repository"
        set_color normal
        return 1
    end
    
    set -l repo (basename (pwd))
    
    echo ""
    set_color cyan
    echo "  ================================================"
    echo "       SYNCING: $repo"
    echo "  ================================================"
    set_color normal
    echo ""
    
    set_color brblack
    echo "  Fetching..."
    set_color normal
    git fetch --quiet 2>/dev/null
    
    set_color brblack
    echo "  Pulling..."
    set_color normal
    git pull --quiet 2>/dev/null
    
    set_color green
    echo "  [DONE] Sync complete"
    set_color normal
    echo ""
end
