
# CODEX Core Installer (idempotent). Creates skeleton, optional Python venv, and scheduled backup task.
param(
  [string]$Root = "E:\CODEX_V3",
  [switch]$CreateVenv = $true,
  [string]$Py = "py" # use 'py' launcher if available; else 'python'
)

$ErrorActionPreference = "Continue"

# Skeleton
$dirs = @(
  "$Root\collection","$Root\notes","$Root\metadata","$Root\logs","$Root\core-kernel","$Root\_backups",
  "$Root\notes\Snippets","$Root\notes\DIN_Forms","$Root\notes\Document"
)
foreach($d in $dirs){ New-Item -ItemType Directory -Path $d -ErrorAction SilentlyContinue | Out-Null }

# Optional Python venv for CLI helpers
if ($CreateVenv) {
  try {
    & $Py -m venv "$Root\.venv"
    & "$Root\.venv\Scripts\python.exe" -m pip install --upgrade pip > "$Root\logs\pip_upgrade.log" 2>&1
  } catch {
    Write-Host "Venv creation failed: $($_.Exception.Message)"
  }
}

# Scheduled task for daily backup zip at 02:30
$taskName = "CODEX_DailyBackup"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$PSScriptRoot\backup-now.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At 2:30am
try {
  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -RunLevel Highest -ErrorAction SilentlyContinue | Out-Null
} catch {}
Write-Host "Core install complete under $Root"
