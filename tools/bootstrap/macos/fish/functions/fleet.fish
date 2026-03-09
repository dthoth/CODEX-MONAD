function fleet --description "Show status of all git repos"
    echo ""
    set_color cyan
    echo "  ================================================"
    echo "       FLEET STATUS"
    echo "  ================================================"
    set_color normal
    echo ""
    
    set -l repos
    
    # Check HINENI_HUB
    if test -d /Volumes/HINENI_HUB/10-repos-central
        for repo in /Volumes/HINENI_HUB/10-repos-central/*/
            if test -d "$repo.git"
                set repos $repos $repo
            end
        end
    end
    
    # Check common local locations
    for base in ~/Code ~/Documents/GitHub ~/GitHub ~/CODEX
        if test -d $base
            for repo in $base/*/
                if test -d "$repo.git"
                    set repos $repos $repo
                end
            end
        end
    end
    
    if test (count $repos) -eq 0
        set_color brblack
        echo "  No repositories found"
        set_color normal
        echo ""
        return
    end
    
    for repo in $repos
        set -l name (basename $repo)
        pushd $repo >/dev/null
        
        set -l branch (git branch --show-current 2>/dev/null)
        set -l changes (git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        
        if test $changes -gt 0
            set_color yellow
            echo "    [*] $name ($branch) - $changes changes"
        else
            set_color green
            echo "    [ok] $name ($branch)"
        end
        
        popd >/dev/null
    end
    
    set_color normal
    echo ""
end
