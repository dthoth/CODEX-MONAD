function timestamp --description "Copy timestamp to clipboard"
    set -l ts (date "+%Y-%m-%d_%H%M%S")
    set -l iso (date "+%Y-%m-%dT%H:%M:%S")
    
    # Copy to clipboard (macOS)
    echo -n $ts | pbcopy
    
    echo ""
    set_color cyan
    echo "  ================================================"
    echo "       TIMESTAMP"
    echo "  ================================================"
    set_color normal
    echo ""
    set_color white
    echo "    File:  $ts"
    echo "    ISO:   $iso"
    set_color normal
    echo ""
    set_color green
    echo "    Copied to clipboard!"
    set_color normal
    echo ""
end
