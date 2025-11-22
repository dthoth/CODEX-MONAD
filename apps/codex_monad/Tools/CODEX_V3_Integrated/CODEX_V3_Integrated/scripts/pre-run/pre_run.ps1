
#requires -Version 5.1
param([string]$ConfigPath = "$PSScriptRoot\..\..\codex-config.json")
$ErrorActionPreference='Stop'

Import-Module "$PSScriptRoot\..\codex-tools.psm1" -Force
Import-Module "$PSScriptRoot\..\codex-meta.psm1" -Force

if(-not (Test-Path $ConfigPath)){ throw "Config not found: $ConfigPath" }
$config = Get-Content -Raw -Path $ConfigPath | ConvertFrom-Json
$log = $config.LogPath

Write-Log -Message "=== PRE-RUN START ===" -Level INFO -LogPath $log
New-Item -ItemType Directory -Path (Join-Path $config.OutputRoot "metadata\pre") -ErrorAction SilentlyContinue | Out-Null

$candidates = Get-CodexCandidates -Config $config -LogPath $log
if ($candidates.Count -gt $config.PreRun.MaxFiles) {
  Write-Log -Message "Capping candidates from $($candidates.Count) to $($config.PreRun.MaxFiles)" -Level WARN -LogPath $log
  $candidates = $candidates[0..($config.PreRun.MaxFiles-1)]
}
$manifest = New-CodexManifest -FileList $candidates -Config $config -LogPath $log

$catalogPath = Join-Path $config.OutputRoot "metadata\pre\catalog.jsonl"
Remove-Item -Force -ErrorAction SilentlyContinue $catalogPath | Out-Null
foreach($m in $manifest){
  $obj = [PSCustomObject]@{ id=$m.id; path=$m.path; name=$m.name; size=$m.size; ext=$m.ext; language=$m.language; projectRoot=$m.projectRoot; tags=$m.tags }
  ($obj | ConvertTo-Json -Compress) | Add-Content -Path $catalogPath
}
Write-Log -Message "Catalog saved: $catalogPath" -Level INFO -LogPath $log

$py = "$PSScriptRoot\python_pre\build_signatures.py"
& python "$py" --config "$ConfigPath" --catalog "$catalogPath" 2>&1 | ForEach-Object { Write-Log -Message $_ -Level DEBUG -LogPath $log }

& python "$PSScriptRoot\python_pre\cluster_and_layout.py" --config "$ConfigPath" 2>&1 | ForEach-Object { Write-Log -Message $_ -Level DEBUG -LogPath $log }

if ($config.Meta.AI.Enable -and $config.Meta.AI.Mode -eq 'webhook' -and $config.Meta.AI.Endpoint -ne '') {
  & powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\ai_enrich.ps1" -ConfigPath $ConfigPath
}

Write-Log -Message "=== PRE-RUN END ===" -Level INFO -LogPath $log
Write-Host "`nPre-run complete. See metadata\pre for outputs."
