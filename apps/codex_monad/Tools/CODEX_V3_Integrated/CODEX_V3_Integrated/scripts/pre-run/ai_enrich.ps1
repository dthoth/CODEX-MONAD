
param([string]$ConfigPath = "$PSScriptRoot\..\..\codex-config.json")
$ErrorActionPreference='Continue'
$config = Get-Content -Raw -Path $ConfigPath | ConvertFrom-Json
$log = $config.LogPath
function Write-Log { param([string]$Message,[string]$Level='INFO')
  $ts=(Get-Date).ToString("yyyy-MM-dd HH:mm:ss"); $line="[$ts][$Level] $Message"; Write-Host $line
  if($log){ New-Item -ItemType Directory -Path ([IO.Path]::GetDirectoryName($log)) -ErrorAction SilentlyContinue|Out-Null; Add-Content -Path $log -Value $line }
}
if(-not $config.Meta.AI.Enable -or $config.Meta.AI.Mode -ne 'webhook' -or [string]::IsNullOrWhiteSpace($config.Meta.AI.Endpoint)){
  Write-Log "AI webhook disabled or not configured." "WARN"; exit 0
}
$pre = Join-Path $config.OutputRoot "metadata\pre"
$catalogPath = Join-Path $pre "catalog.jsonl"
$endpoint = $config.Meta.AI.Endpoint
$auth = $config.Meta.AI.AuthHeader
$batch = [int]$config.Meta.AI.BatchSize
$fields = $config.Meta.AI.Fields
$items = @()
Get-Content -Path $catalogPath | ForEach-Object { $r = $_ | ConvertFrom-Json; $items += [PSCustomObject]@{ id=$r.id; path=$r.path } }
for($i=0; $i -lt $items.Count; $i+=$batch){
  $chunk = $items[$i..([Math]::Min($i+$batch-1, $items.Count-1))]
  $payload = [PSCustomObject]@{ records = $chunk; want = $fields }
  try {
    $headers = @{}; if(-not [string]::IsNullOrWhiteSpace($auth)){ $headers["Authorization"]=$auth }
    $resp = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -Body ($payload | ConvertTo-Json -Depth 6) -ContentType "application/json" -TimeoutSec 120
    $out = Join-Path $pre ("ai_enrich_" + $i + ".json"); ($resp | ConvertTo-Json -Depth 8) | Set-Content -Path $out -Force
  } catch { Write-Log "AI webhook error at batch $i: $($_.Exception.Message)" "WARN" }
}
Write-Log "AI enrichment pass complete."
