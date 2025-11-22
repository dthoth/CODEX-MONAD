
#requires -Version 5.1
using namespace System.IO

function Write-Log {
  param([Parameter(Mandatory=$true)][string]$Message,[ValidateSet('INFO','WARN','ERROR','DEBUG')][string]$Level='INFO',[string]$LogPath)
  $ts=(Get-Date).ToString("yyyy-MM-dd HH:mm:ss"); $line="[$ts][$Level] $Message"
  Write-Host $line
  if($LogPath){ New-Item -ItemType Directory -Path ([Path]::GetDirectoryName($LogPath)) -ErrorAction SilentlyContinue|Out-Null; Add-Content -Path $LogPath -Value $line }
}

function Get-PlainText {
  [CmdletBinding()]
  param([Parameter(Mandatory=$true)][string]$Path,[int]$MaxBytes=1048576) # 1MB cap per file
  try {
    $ext = [IO.Path]::GetExtension($Path).ToLowerInvariant()
    if ($ext -in @('.md','.txt','.json','.yaml','.yml','.toml','.ps1','.psm1','.psd1','.sh','.py','.js','.ts','.c','.h','.cpp','.cs','.java','.swift','.go','.rb','.php','.rs','.kt','.sql','.rtf')) {
      $bytes = [IO.File]::ReadAllBytes($Path)
      if ($bytes.Length -gt $MaxBytes) { $bytes = $bytes[0..($MaxBytes-1)] }
      $text = [Text.Encoding]::UTF8.GetString($bytes)
      if ($ext -eq '.rtf') {
        # naive RTF strip: remove {\*...}, {\...}, \controlwords and braces
        $text = ($text -replace '\{\\\*.*?\}',' ' -replace '\\[a-zA-Z]+\d*',' ' -replace '[\{\}]',' ')
      }
      return $text
    }
    # For binary docs (pdf/docx) we skip deep parsing for now
    return $null
  } catch { return $null }
}

function Detect-Themes {
  [CmdletBinding()]
  param([Parameter(Mandatory=$true)][string]$Path,[hashtable]$ThemeMaps,[int]$MaxBytes=262144)
  $text = Get-PlainText -Path $Path -MaxBytes $MaxBytes
  $themes = [System.Collections.Generic.List[string]]::new()
  if ($null -eq $text) {
    # try filename/folders
    $hay = $Path
  } else {
    $hay = $Path + "`n" + $text
  }
  foreach ($k in $ThemeMaps.Keys) {
    if ([Text.RegularExpressions.Regex]::IsMatch($hay, $k, [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
      $themes.Add($ThemeMaps[$k])
    }
  }
  return ($themes | Select-Object -Unique)
}

function Build-MetaIndex {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory=$true)][object[]]$Manifest,
    [Parameter(Mandatory=$true)][hashtable]$Config,
    [string]$LogPath
  )
  $meta = [System.Collections.Generic.List[object]]::new()
  $maps = @{}; $maps = $Config.Meta.ThemeMaps

  $i=0
  foreach ($m in $Manifest) {
    $i++
    if ($i % 500 -eq 0) { Write-Log -Message "Meta scan progress: $i / $($Manifest.Count)" -Level DEBUG -LogPath $LogPath }
    $themes = Detect-Themes -Path $m.path -ThemeMaps $maps
    $rec = [PSCustomObject]@{
      id = $m.id
      path = $m.path
      language = $m.language
      projectRoot = $m.projectRoot
      tags = $m.tags
      themes = $themes
    }
    $meta.Add($rec)
  }

  $out = Join-Path $Config.OutputRoot "metadata\codex.meta.index.json"
  $meta | ConvertTo-Json -Depth 6 | Set-Content -Path $out -Force

  if ($Config.Meta.WriteBackIntoManifest) {
    # merge themes back into main manifest file for convenience
    $manifestPath = Join-Path $Config.OutputRoot "metadata\codex.manifest.json"
    if (Test-Path $manifestPath) {
      $manifest = Get-Content -Raw -Path $manifestPath | ConvertFrom-Json
      $map = @{}
      foreach ($x in $meta) { $map[$x.id] = $x.themes }
      foreach ($m in $manifest) {
        if ($map.ContainsKey($m.id)) { $m | Add-Member -NotePropertyName themes -NotePropertyValue $map[$m.id] -Force }
      }
      $manifest | ConvertTo-Json -Depth 6 | Set-Content -Path $manifestPath -Force
    }
  }
  Write-Log -Message "Meta index built: $out" -Level INFO -LogPath $LogPath
  return $out
}

function Find-Snippets {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory=$true)][object[]]$Manifest,
    [Parameter(Mandatory=$true)][hashtable]$Config
  )
  $maxKB = [int]$Config.Meta.Snippet.MaxSizeKB
  $exts  = $Config.Meta.Snippet.Extensions
  $snips = $Manifest | Where-Object {
    $_.size -le ($maxKB * 1024) -and ($exts -contains ([IO.Path]::GetExtension($_.path).ToLower()))
  }
  return $snips
}

function Consolidate-Snippets {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory=$true)][object[]]$Manifest,
    [Parameter(Mandatory=$true)][hashtable]$Config,
    [string]$LogPath
  )
  if (-not $Config.Meta.Snippet.Enable) { return $null }
  $snips = Find-Snippets -Manifest $Manifest -Config $Config
  $outRoot = $Config.Meta.Snippet.Output
  New-Item -ItemType Directory -Path $outRoot -ErrorAction SilentlyContinue | Out-Null

  # Build a quick lookup of meta themes by id if present
  $metaIndexPath = Join-Path $Config.OutputRoot "metadata\codex.meta.index.json"
  $themesById = @{}
  if (Test-Path $metaIndexPath) {
    $meta = Get-Content -Raw -Path $metaIndexPath | ConvertFrom-Json
    foreach ($m in $meta) { $themesById[$m.id] = $m.themes }
  }

  $groupMode = $Config.Meta.Snippet.GroupBy
  $groups = @{}

  foreach ($s in $snips) {
    $key = 'misc'
    switch ($groupMode) {
      'theme' {
        $ts = @()
        if ($themesById.ContainsKey($s.id) -and $themesById[$s.id]) { $ts = $themesById[$s.id] } else { $ts = @('misc') }
        foreach ($t in $ts) {
          if (-not $groups.ContainsKey($t)) { $groups[$t] = New-Object System.Collections.ArrayList }
          [void]$groups[$t].Add($s)
        }
        continue
      }
      'project' { $key = [IO.Path]::GetFileName($s.projectRoot) }
      'language' { $key = $s.language }
      default { $key = 'misc' }
    }
    if (-not $groups.ContainsKey($key)) { $groups[$key] = New-Object System.Collections.ArrayList }
    [void]$groups[$key].Add($s)
  }

  $created = @()
  foreach ($k in $groups.Keys) {
    $safe = ($k -replace '[^\w\-]+','_')
    $md = Join-Path $outRoot ("SNIPPETS_" + $safe + ".md")
    $lines = @("# Snippets — " + $k, "", "> Auto-consolidated; max size = $($Config.Meta.Snippet.MaxSizeKB) KB", "")
    foreach ($s in $groups[$k]) {
      $lines += "## " + $s.name
      $lines += ""
      $lines += "**Path:** " + $s.path
      $lines += ""
      try {
        $text = Get-Content -Raw -Path $s.path -ErrorAction Stop
      } catch {
        $text = "(unreadable)"
      }
      # fence as code for safety
      $lines += "```"
      $lines += $text
      $lines += "```"
      $lines += ""
    }
    $lines | Set-Content -Path $md -Force
    $created += $md
  }
  Write-Log -Message ("Snippet notebooks created: " + ($created.Count)) -Level INFO -LogPath $LogPath
  return $created
}
