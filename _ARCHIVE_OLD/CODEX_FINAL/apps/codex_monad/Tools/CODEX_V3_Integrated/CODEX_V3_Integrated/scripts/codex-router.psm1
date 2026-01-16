
#requires -Version 5.1
using namespace System.IO

function Get-FractalPath {
  param([hashtable]$Config,[object]$ManifestItem)
  $pre = Join-Path $Config.OutputRoot "metadata\pre"
  $candidates = Get-ChildItem -Path $pre -Filter "ai_enrich_*.json" -ErrorAction SilentlyContinue
  foreach ($file in $candidates) {
    try {
      $raw = Get-Content -Raw -Path $file.FullName | ConvertFrom-Json
      $recs = $raw.records
      if (-not $recs -and ($raw -is [System.Collections.IEnumerable])) { $recs = $raw }
      if ($recs) {
        $rec = $recs | Where-Object { $_.path -eq $ManifestItem.path } | Select-Object -First 1
        if ($rec -and $rec.fractal_path) { return [string]$rec.fractal_path }
      }
    } catch {}
  }
  return $null
}

function Test-DINCode {
  param([string]$Path,[string]$Pattern)
  return [Text.RegularExpressions.Regex]::IsMatch($Path, $Pattern)
}

function Resolve-RoutedDestination {
  [CmdletBinding()]
  param([Parameter(Mandatory=$true)][hashtable]$Config,[Parameter(Mandatory=$true)][object]$ManifestItem)

  $route = $Config.Routing
  if (-not $route.Enable) { return $null }

  foreach ($key in $route.Precedence) {
    switch ($key) {
      'fractal_path' {
        if ($route.FractalPath.Enable) {
          $fp = Get-FractalPath -Config $Config -ManifestItem $ManifestItem
          if ($fp) {
            $leaf = $fp -replace '^[\\/]+','' -replace '[^a-zA-Z0-9_\\/ -]',''
            $lang = if ($ManifestItem.language) { $ManifestItem.language } else { 'Text' }
            return ("collection\{0}\{1}" -f $lang, $leaf)
          }
        }
      }
      'themes' {
        $themes = $ManifestItem.themes
        if (-not $themes) { $themes = @() }
        foreach ($t in $themes) {
          if ($route.ThemeBuckets.ContainsKey($t)) { return $route.ThemeBuckets[$t] }
        }
      }
      'din_code' {
        if ($route.DIN.Enable -and (Test-DINCode -Path $ManifestItem.path -Pattern $route.DIN.Pattern)) {
          return $route.DIN.Target
        }
      }
      'project' {
        $proj = ([IO.Path]::GetFileName($ManifestItem.projectRoot)).Replace(' ','_')
        $lang = if ($ManifestItem.language) { $ManifestItem.language } else { 'Text' }
        return ($route.ProjectFallback -replace "{language}", $lang -replace "{project}", $proj)
      }
      'language' {
        $lang = if ($ManifestItem.language) { $ManifestItem.language } else { 'Text' }
        return ($route.LanguageFallback -replace "{language}", $lang)
      }
    }
  }
  return $null
}
