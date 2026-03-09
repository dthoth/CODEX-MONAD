# ═══════════════════════════════════════════════════════════════════════════
# CODEX-MONAD Bootstrap Installer for Windows
# Run this script from the CODEX-MONAD directory
# ═══════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "       CODEX-MONAD Bootstrap Installer" -ForegroundColor Cyan
Write-Host "       Windows Edition" -ForegroundColor DarkCyan
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""

# --- Check we're in the right place ---
$bootstrapPath = Join-Path $PSScriptRoot "profile.ps1"
if (-not (Test-Path $bootstrapPath)) {
    Write-Host "  [ERROR] Cannot find profile.ps1" -ForegroundColor Red
    Write-Host "  Make sure you're running from CODEX-MONAD\bootstrap\windows\" -ForegroundColor DarkGray
    exit 1
}

Write-Host "  [1/5] Setting execution policy..." -ForegroundColor Yellow
try {
    Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
    Write-Host "        Done" -ForegroundColor Green
} catch {
    Write-Host "        Warning: Could not set policy (may need Admin)" -ForegroundColor DarkYellow
}

Write-Host "  [2/5] Creating CODEX_STAGING directories..." -ForegroundColor Yellow
$stagingPath = "$HOME\Documents\CODEX_STAGING"
New-Item -ItemType Directory -Path "$stagingPath\notes" -Force | Out-Null
New-Item -ItemType Directory -Path "$stagingPath\import_ready" -Force | Out-Null
Write-Host "        Created: $stagingPath" -ForegroundColor Green

Write-Host "  [3/5] Setting up PowerShell profile..." -ForegroundColor Yellow
$profileDir = Split-Path $PROFILE -Parent
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}
Copy-Item $bootstrapPath $PROFILE -Force
Write-Host "        Installed to: $PROFILE" -ForegroundColor Green

Write-Host "  [4/5] Detecting device..." -ForegroundColor Yellow
$deviceName = $env:COMPUTERNAME
Write-Host "        Device: $deviceName" -ForegroundColor Green

Write-Host "  [5/5] Checking for Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if ($gitInstalled) {
    Write-Host "        Git found: $($gitInstalled.Source)" -ForegroundColor Green
} else {
    Write-Host "        Git not found (optional - install with: winget install Git.Git)" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Green
Write-Host "       INSTALLATION COMPLETE" -ForegroundColor Green
Write-Host "  ================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "    1. Close this PowerShell window" -ForegroundColor Gray
Write-Host "    2. Open a new PowerShell window" -ForegroundColor Gray
Write-Host "    3. Type: morning" -ForegroundColor Cyan
Write-Host ""
Write-Host "  The dragon awaits. " -ForegroundColor DarkYellow
Write-Host ""
