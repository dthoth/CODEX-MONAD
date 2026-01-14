function ship --description "Git add, commit, and push"
    if not test -d .git
        set_color red
        echo "  [ERROR] Not a git repository"
        set_color normal
        return 1
    end
    
    set -l changes (git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    if test $changes -eq 0
        set_color yellow
        echo "  Nothing to ship"
        set_color normal
        return 0
    end
    
    set -l repo (basename (pwd))
    
    echo ""
    set_color magenta
    echo "  ================================================"
    echo "       SHIPPING: $repo"
    echo "  ================================================"
    set_color normal
    echo ""
    
    set_color brblack
    echo "  Changes:"
    set_color normal
    git status --short
    echo ""
    
    # Get commit message
    if test (count $argv) -gt 0
        set -l message "$argv"
    else
        read -P "  Commit message: " message
        if test -z "$message"
            set message "Quick update "(date "+%Y-%m-%d %H:%M")
        end
    end
    
    git add .
    git commit -m "$message" --quiet 2>/dev/null
    
    set_color brblack
    echo "  Pushing..."
    set_color normal
    git push 2>/dev/null
    
    echo ""
    set_color green
    echo "  [SHIPPED]"
    set_color normal
    echo ""
end
