# 📚 CODEX_V3_Integrated Usage Examples & Tutorials

**Last Updated:** 2026-01-20 20:21:20

---

## Quick Start Guide

### First-Time Setup

```powershell
# 1. Navigate to CODEX_V3_Integrated
cd apps\codex_monad\Tools\CODEX_V3_Integrated\CODEX_V3_Integrated

# 2. Review configuration
notepad codex-config.json

# 3. Set DryRun = true for first test

# 4. Run PRE-RUN to analyze files
powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1

# 5. Run BUILD in dry-run mode
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1

# 6. Review logs
notepad E:\CODEX_V3\logs\codex.log
```

---

## Example 1: Organize Downloads Folder

**Scenario:** Organize hundreds of files from Downloads into CODEX.

### Steps

```powershell
# 1. Configure sources to point to Downloads
# 2. Enable theme detection
# 3. Run PRE-RUN to cluster
.\scripts\pre-run\pre_run.ps1

# 4. Run BUILD
.\scripts\run-codex.ps1
```

---

## Example 2: Theme-Based Organization

Add custom themes to route files by content:

```json
"Patterns": {
  "machine learning|AI": "AI_Research",
  "ccru|accelerationism": "Land_CCRU"
}
```

---

## Example 3: AI Enrichment

```powershell
# Start AI stub
python tools\ai_webhook_stub.py

# Enable in config
"AI": { "Enable": true }

# Run pipeline
.\scripts\run-codex.ps1
```

---

## Example 4: DIN Form Processing

Files matching `DIN-###` automatically route to `notes\DIN_Forms\`

---

## Related Documentation

- [Configuration Guide](CONFIGURATION_GUIDE.md)
- [Scripts Reference](SCRIPTS_REFERENCE.md)

---

*Usage examples generated: 2026-01-20 20:21:20*
