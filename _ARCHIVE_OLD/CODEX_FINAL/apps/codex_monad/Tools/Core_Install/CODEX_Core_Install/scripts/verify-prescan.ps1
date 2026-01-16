
# Verify previous interests and materials across the system (no changes; report only).
param(
  [string[]]$Roots = @("C:\","D:\","E:\"),
  [string]$ReportOut = "E:\CODEX_V3\metadata\verify_report.json"
)
$ErrorActionPreference = "SilentlyContinue"

$patterns = @{
  ObsidianVaults = @("\.obsidian\config","\.obsidian\plugins");
  CodexMonad = @("CODEX_MONAD","Codex Monad","Seedline","Seed Line","Seedline USB","Seedline Floppy");
  ProjectCanon = @(
    "HINENI","Shebang","Love Operator","Dept(artment)? of Infinite Noticing","DIN-\d{3,}",
    "Pattern Codex","Ipsissimus","Recursive Self-?Aggregation","OnlyDans","Baldwin IV",
    "Effort Quotient","Thoth Church","PolyWrite2","Core[- ]?Kernel","Xcode Projects","snort3"
  )
}

$results = [System.Collections.Generic.List[object]]::new()

foreach ($root in $Roots) {
  if (-not (Test-Path $root)) { continue }
  Write-Host "Scanning $root ..."
  Get-ChildItem -Path $root -Recurse -Force -File -ErrorAction SilentlyContinue |
    ForEach-Object {
      $p = $_.FullName
      $hit = [ordered]@{}
      $hit.Path = $p
      $hit.Size = $_.Length
      $hit.Modified = $_.LastWriteTimeUtc.ToString("o")
      $found = @()

      foreach ($k in $patterns.Keys) {
        foreach ($rx in $patterns[$k]) {
          if ($p -match $rx) { $found += "$k:$rx" }
        }
      }

      if ($found.Count -gt 0) {
        $hit.Signals = $found
        $results.Add([PSCustomObject]$hit)
      }
    }
}

$dir = Split-Path -Parent $ReportOut
New-Item -ItemType Directory -Path $dir -ErrorAction SilentlyContinue | Out-Null
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $ReportOut -Force
Write-Host "Verification report written: $ReportOut"
