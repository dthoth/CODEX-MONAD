
# CODEX V3 Final Kit (20251029)

This is a fully wired, **no-placeholders** kit that:
- Bundles the **Integrated Builder** (two stages, router, metadata), and the **Core Install & Tools**.
- Merges your **ThemeMaps.personal** into the builder.
- Wires the **AI webhook** to the included stub at `http://127.0.0.1:8765` (auto-started by RUN_ALL if Python is present).
- Provides **RUN_ALL.ps1** (executes for real) and **RUN_ALL_DRY.ps1** (dry-run).

## Quick Start (recommended)
Right-click **RUN_ALL.ps1** → Run with PowerShell (or run from an elevated PowerShell):
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\RUN_ALL.ps1
```
This will:
1) Install the core skeleton under `E:\CODEX_V3`.
2) Start the local AI stub (if Python is on PATH).
3) Run PRE-RUN (catalog + signatures + clustering + proposed layout + optional AI enrichment).
4) Toggle DryRun→false and execute the BUILD (then restore to true).

If you want to preview only:
```powershell
.\RUN_ALL_DRY.ps1
```
