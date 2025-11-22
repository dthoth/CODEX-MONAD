
# CODEX Run-All (dry-run): install core, PRE-RUN, then BUILD with DryRun=true
$ErrorActionPreference = 'Stop'
$kitRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$integrated = Join-Path $kitRoot "CODEX_V3_Integrated"
$core = Join-Path $kitRoot "Core_Install"

Write-Host "=== INSTALL CORE ==="
powershell -ExecutionPolicy Bypass -File (Join-Path $core "CODEX_Core_Install\scripts\install-core.ps1")

Write-Host "=== PRE-RUN ==="
powershell -ExecutionPolicy Bypass -File (Join-Path $integrated "scripts\pre-run\pre_run.ps1")

Write-Host "=== BUILD (DryRun) ==="
powershell -ExecutionPolicy Bypass -File (Join-Path $integrated "scripts\run-codex.ps1")

Write-Host "=== DONE (dry) ==="
