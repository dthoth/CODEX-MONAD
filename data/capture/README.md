# CODEX Capture Data

This directory contains the output from the CODEX Capture system.

## Structure

```
capture/
└── daily/
    ├── 2025-12-03/
    │   ├── keystrokes.log      # Typed content with window context
    │   ├── clipboard.log       # Copy events (preview)  
    │   ├── clipboard_full.log  # Full clipboard contents
    │   └── windows.log         # App/window switches with timestamps
    ├── 2025-12-04/
    │   └── ...
    └── ...
```

## Processing

These logs are designed to be fed to a local LLM for batch processing:

1. **Daily Digest**: "Summarize what I worked on today"
2. **Pattern Detection**: "What themes keep recurring?"
3. **CODEX Candidates**: "What should become permanent entries?"

## Privacy

This directory should be:
- Excluded from git (it's in .gitignore)
- Backed up securely if desired
- Kept local (the whole point is no cloud)

## Retention

Decide your own retention policy:
- Keep everything forever (storage is cheap)
- Archive weekly/monthly to cold storage
- Let the AI process then delete raw logs

The AI becomes the memory. The logs become compost.
