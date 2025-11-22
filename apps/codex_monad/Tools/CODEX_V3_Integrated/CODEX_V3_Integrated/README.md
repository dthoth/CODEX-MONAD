
# CODEX V3 — Integrated (Two Stages)

Unifies **Stage 1 (PRE‑RUN)** and **Stage 2 (BUILD)**, adds a metadata‑aware **Router**, and enriches outputs to leverage **themes**, **fractal paths**, **DIN codes**, and **priorities**.

## Stages (from root of this folder)
- **Stage 1 — PRE‑RUN** (plan/cluster/propose + optional AI enrichment)
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1
  ```
- **Stage 2 — BUILD** (copy/index/backup/module manifest)
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1
  ```

## Routing (config → `Routing`)
Precedence: **fractal_path → themes → DIN code → project → language**.  
Fractal paths come from AI enrichment (`fractal_path`) and map to collection subtrees.

## Revamps
- `metadata\INDEX.md`: extra **themes** column
- `core-kernel\codex.modules.json`: **themes** + **priority** (entryPointScore + 2×theme count)

## Migration
Adapters under `scripts\adapters\` provide hooks to ingest older outputs.

