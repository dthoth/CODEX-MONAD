
# CODEX Run-All (real execution): install core, start AI stub, PRE-RUN, then BUILD with DryRun=false
$ErrorActionPreference = 'Stop'
$kitRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$integrated = Join-Path $kitRoot "CODEX_V3_Integrated"
$core = Join-Path $kitRoot "Core_Install"

# 1) Install core skeleton & scheduled backup
Write-Host "=== INSTALL CORE ==="
powershell -ExecutionPolicy Bypass -File (Join-Path $core "CODEX_Core_Install\scripts\install-core.ps1")

# 2) Start AI webhook stub (background). If python not found, continue without AI.
Write-Host "=== START AI STUB (if Python available) ==="
$py = (Get-Command python -ErrorAction SilentlyContinue)
if ($py) {
  Start-Process -WindowStyle Hidden -FilePath "python" -ArgumentList (Join-Path $integrated "tools\ai_webhook_stub.py")
  Start-Sleep -Seconds 2
  Write-Host "AI stub started at http://127.0.0.1:8765"
} else {
  Write-Host "Python not found; skipping AI stub. PRE-RUN will still proceed."
}

# 3) PRE-RUN (plan; proposed_layout.json; AI enrichment if stub alive)
Write-Host "=== PRE-RUN ==="
powershell -ExecutionPolicy Bypass -File (Join-Path $integrated "scripts\pre-run\pre_run.ps1")

# 4) Temporarily flip DryRun=false, run BUILD, then restore
$cfgPath = Get-ChildItem -Path $integrated -Recurse -Filter "codex-config.json" | Select-Object -First 1 | ForEach-Object { $_.FullName }
if (-not $cfgPath) { throw "codex-config.json not found" }
$cfg = Get-Content -Raw -Path $cfgPath | ConvertFrom-Json
$cfg.DryRun = $false
$cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $cfgPath -Encoding UTF8

Write-Host "=== BUILD (execute) ==="
powershell -ExecutionPolicy Bypass -File (Join-Path $integrated "scripts\run-codex.ps1")

# restore to DryRun=true for safety
$cfg = Get-Content -Raw -Path $cfgPath | ConvertFrom-Json
$cfg.DryRun = $true
$cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $cfgPath -Encoding UTF8

Write-Host "=== DONE ==="
