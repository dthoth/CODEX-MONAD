
#requires -Version 5.1
param([string]$ConfigPath = "$PSScriptRoot\..\codex-config.json")
$ErrorActionPreference='Stop'
Import-Module "$PSScriptRoot\codex-tools.psm1" -Force

if(-not (Test-Path $ConfigPath)){ throw "Config not found: $ConfigPath" }
$config = Get-Content -Raw -Path $ConfigPath | ConvertFrom-Json
$log = $config.LogPath

Write-Log -Message "=== CODEX V3 RUN START ===" -Level INFO -LogPath $log
Write-Log -Message "DryRun: $($config.DryRun)  OutputRoot: $($config.OutputRoot)" -Level INFO -LogPath $log

New-CodexStaging -OutputRoot $config.OutputRoot

Write-Log -Message "Scanning sources..." -Level INFO -LogPath $log
$candidates = Get-CodexCandidates -Config $config -LogPath $log
Write-Log -Message ("Candidates found: {0}" -f $candidates.Count) -Level INFO -LogPath $log

# ---- APPLY PROPOSED LAYOUT (optional) ----
if ($config.PreRun.ProposedLayout.Enable -and $config.PreRun.ProposedLayout.ApplyAutoLayout) {
  $mapPath = Join-Path $config.OutputRoot "metadata\proposed_layout.json"
  if (Test-Path $mapPath) {
    Write-Log -Message "Applying ProposedLayout map: $mapPath" -Level INFO -LogPath $log
    $layout = Get-Content -Raw -Path $mapPath | ConvertFrom-Json
    $Global:__Codex_Override_Targets = @{}
    foreach ($cluster in $layout) {
      foreach ($m in $cluster.members) {
        $Global:__Codex_Override_Targets[$m] = $cluster.target
      }
    }
  } else {
    Write-Log -Message "Proposed layout not found; skipping." -Level WARN -LogPath $log
  }
}

Write-Log -Message "Building manifest..." -Level INFO -LogPath $log
$manifest = New-CodexManifest -FileList $candidates -Config $config -LogPath $log

$manifestPath = Join-Path $config.OutputRoot "metadata\codex.manifest.json"
$manifest | ConvertTo-Json -Depth 6 | Set-Content -Path $manifestPath -Force
Write-Log -Message "Manifest saved: $manifestPath" -Level INFO -LogPath $log

Write-Log -Message "Copying files (E:\ writes restricted to OutputRoot)..." -Level INFO -LogPath $log
Copy-CodexFiles -Manifest $manifest -Config $config -LogPath $log

$indexPath = New-CodexIndexMarkdown -Manifest $manifest -OutputRoot $config.OutputRoot
Write-Log -Message "Index generated: $indexPath" -Level INFO -LogPath $log

$modsOut = New-CoreKernelModuleManifest -Manifest $manifest -Config $config -LogPath $log
Write-Log -Message "Core-kernel modules manifest prepared: $modsOut" -Level INFO -LogPath $log

$zip = New-CodexBackupZip -OutputRoot $config.OutputRoot -Config $config -LogPath $log
Write-Log -Message "Backup outcome: $zip" -Level INFO -LogPath $log

Write-Log -Message "=== CODEX V3 RUN END ===" -Level INFO -LogPath $log
Write-Host "`nDone. Check logs at $log"
