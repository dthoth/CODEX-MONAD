
param(
  [string[]]$Roots = @("C:\","D:\","E:\"),
  [string]$Out = "E:\CODEX_V3\notes\Snippets\SNIPPETS_Grep.md",
  [string]$Regex = "(HINENI|Shebang|CODEX_MONAD|Seedline|DIN-\d{3,})",
  [int]$MaxKB = 64
)
$matches = @()
foreach($r in $Roots){
  if (-not (Test-Path $r)) { continue }
  Get-ChildItem -Path $r -Recurse -Force -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Length -le ($MaxKB*1024) } |
    ForEach-Object {
      $p = $_.FullName
      try {
        $t = Get-Content -Raw -Path $p -ErrorAction Stop
        if ($t -match $Regex) {
          $matches += [PSCustomObject]@{Path=$p; Size=$_.Length; Snip=$t.Substring(0,[Math]::Min($t.Length,1000))}
        }
      } catch {}
    }
}
$lines = @("# Snippets — Grep", "", "> Pattern: $Regex", "")
foreach($m in $matches){
  $lines += "## " + $m.Path
  $lines += ""
  $lines += "```"
  $lines += $m.Snip
  $lines += "```"
  $lines += ""
}
$dir = Split-Path -Parent $Out
New-Item -ItemType Directory -Path $dir -ErrorAction SilentlyContinue | Out-Null
$lines | Set-Content -Path $Out -Force
Write-Host "Snippet book written: $Out"
