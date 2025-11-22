
# CODEX Core Install & Tools (20251029)

This bundle gives you:
- **Verification Pre-Scan** (`scripts/verify-prescan.ps1`) — finds Obsidian vault signals and **CODEX_MONAD** markers across C/D/E and writes `E:\CODEX_V3\metadata\verify_report.json`.
- **ThemeMaps.personal.json** — drop into your builder to enrich meta theme detection (adds **CodexMonad**, RSA, Pattern Codex 22+1, etc.).
- **Core Installer** (`scripts/install-core.ps1`) — sets folder skeleton, optional Python venv, daily backup task.
- **Backup Now** (`scripts/backup-now.ps1`)
- **Snippet Grep** (`scripts/snippet-grep.ps1`) — quick small-file collector by regex (e.g., HINENI, DIN codes). 
- **AI Webhook Stub** (`tools/ai_webhook_stub.py`) — local HTTP endpoint to test PRE-RUN enrichment.

## Suggested flow
1. Run the **Verification Pre-Scan** to confirm we’re picking up Obsidian vaults and CODEX_MONAD content:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\verify-prescan.ps1
   notepad E:\CODEX_V3\metadata\verify_report.json
   ```
2. Run the **Core Installer** (creates `E:\CODEX_V3` skeleton and daily backup task):
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\install-core.ps1
   ```
3. (Optional) Start the **AI Webhook Stub**:
   ```powershell
   # in a console with Python available
   python .\tools\ai_webhook_stub.py
   ```
   Then set the builder’s `Meta.AI.Endpoint` to `http://127.0.0.1:8765`.
4. Drop `tools\ThemeMaps.personal.json` into your builder (merge with your ThemeMaps) and re-run PRE-RUN.

