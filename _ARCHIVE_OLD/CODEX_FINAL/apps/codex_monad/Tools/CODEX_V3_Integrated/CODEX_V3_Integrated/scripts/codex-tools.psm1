
#requires -Version 5.1
using namespace System.IO

function Write-Log {
  param([Parameter(Mandatory=$true)][string]$Message,[ValidateSet('INFO','WARN','ERROR','DEBUG')][string]$Level='INFO',[string]$LogPath)
  $ts=(Get-Date).ToString("yyyy-MM-dd HH:mm:ss"); $line="[$ts][$Level] $Message"
  Write-Host $line
  if($LogPath){ New-Item -ItemType Directory -Path ([Path]::GetDirectoryName($LogPath)) -ErrorAction SilentlyContinue|Out-Null; Add-Content -Path $LogPath -Value $line }
}

function Get-LanguageFromExtension{param([string]$PathOrExt)
  $ext=$PathOrExt; if($PathOrExt -and $PathOrExt.Contains(".")){$ext=[Path]::GetExtension($PathOrExt)}
  switch -Regex ($ext.ToLower()){
    '\.ps1|\.psm1|\.psd1' {'PowerShell'}
    '\.bat|\.cmd'{'Batch'}
    '\.sh|\.zsh|\.bash|\.fish'{'Shell'}
    '\.py'{'Python'}
    '\.js|\.mjs|\.cjs'{'JavaScript'}
    '\.ts'{'TypeScript'}
    '\.cs|\.csproj|\.sln'{'CSharp'}
    '\.cpp|\.hpp|\.c|\.h'{'C/C++'}
    '\.java'{'Java'}
    '\.swift|\.xcodeproj|\.xcworkspace'{'Swift'}
    '\.go'{'Go'}
    '\.rb'{'Ruby'}
    '\.php'{'PHP'}
    '\.rs|Cargo\.toml'{'Rust'}
    '\.scala'{'Scala'}
    '\.kt|\.kts'{'Kotlin'}
    'CMakeLists\.txt'{'CMake'}
    'Makefile'{'Make'}
    'package\.json'{'Node'}
    'pyproject\.toml|setup\.py'{'Python'}
    '\.sql'{'SQL'}
    '\.pdf|\.docx?|\.pptx?|\.xlsx?'{'Document'}
    '\.jpg|\.jpeg|\.png|\.gif|\.tif|\.tiff|\.bmp|\.webp|\.heic|\.ico|\.svg'{'Image'}
    '\.mp3|\.m4a|\.aac|\.wav|\.flac|\.ogg|\.oga|\.aiff?|\.wma'{'Audio'}
    '\.mp4|\.mkv|\.mov|\.avi|\.wmv|\.m4v|\.webm|\.flv'{'Video'}
    default{'Text'}
  }
}

function Get-EntryPointScore{param([string]$Path)
  $n=[Path]::GetFileName($Path).ToLower(); $s=0
  if($n -eq 'package.json'){$s+=10}
  if($n -eq 'setup.py' -or $n -eq 'pyproject.toml'){$s+=8}
  if($n -eq 'cmakelists.txt' -or $n -eq 'makefile'){$s+=6}
  if($n.EndsWith('.sln') -or $n.EndsWith('.xcodeproj')){$s+=9}
  return $s
}

function Get-FileTagsFromPath{param([string]$FullPath)
  $tags=[System.Collections.Generic.List[string]]::new()
  ($FullPath -split '[\\/]' | Where-Object {$_ -ne ''}) | ForEach-Object {
    switch -Regex ($_.ToLower()){
      'codex'{ $tags.Add('codex') }
      'obsidian'{ $tags.Add('obsidian') }
      'xcode'{ $tags.Add('xcode') }
      '\.sln$|visual studio'{ $tags.Add('visualstudio') }
      'snort3'{ $tags.Add('snort3') }
      'scripts?'{ $tags.Add('scripts') }
      'thoth'{ $tags.Add('thoth') }
      'kernel'{ $tags.Add('kernel') }
    }
  }
  return ($tags | Select-Object -Unique)
}

function Should-ExcludePath{param([string]$FullPath,[string[]]$ExcludeFolders)
  foreach($ex in $ExcludeFolders){ if($FullPath.ToLower().Contains($ex.Trim().ToLower())){ return $true } }
  return $false
}

function Get-CodexCandidates{
  [CmdletBinding()]
  param([Parameter(Mandatory=$true)][hashtable]$Config,[string]$LogPath)

  $includeExts=$Config.IncludeExtensions; $exclude=$Config.ExcludeFolders; $always=$Config.AlwaysIncludePaths

  $sources=@()
  foreach($s in @($Config.ReadOnlySources + $Config.WritableSources)){
    foreach($p in $s.paths){ if(Test-Path $p){ $sources+=$p } else { Write-Log -Message "Source path not found: $p" -Level WARN -LogPath $LogPath } }
  }

  $results=[System.Collections.Generic.List[object]]::new()

  foreach($root in $always){
    $matches=Get-ChildItem -Path $root -Recurse -ErrorAction SilentlyContinue
    foreach($m in $matches){
      if($m.PSIsContainer){ continue }
      $path=$m.FullName
      if(Should-ExcludePath -FullPath $path -ExcludeFolders $exclude){ continue }
      $name=[IO.Path]::GetFileName($path); $ext=[IO.Path]::GetExtension($path)
      $ok=$true
      if($ext -ne '' -and ($includeExts -notcontains $ext) -and ($name -notin @('CMakeLists.txt','Makefile','package.json','pyproject.toml','setup.py','Cargo.toml','go.mod'))){
        if($ext.ToLower() -notin @('.md','.rtf','.rtfd','.txt','.csv','.json','.yml','.yaml','.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.epub')){ $ok=$false }
      }
      if($ok){ $results.Add([PSCustomObject]@{ FullPath=$path; SourceRoot=$root; Language=(Get-LanguageFromExtension $path) }) }
    }
  }

  foreach($src in $sources){
    foreach($ext in $includeExts){
      try{
        $pattern= if($ext.StartsWith(".")){"*$ext"} else {$ext}
        $files=Get-ChildItem -Path $src -Recurse -Include $pattern -File -ErrorAction SilentlyContinue
        foreach($f in $files){
          if(Should-ExcludePath -FullPath $f.FullName -ExcludeFolders $exclude){ continue }
          $results.Add([PSCustomObject]@{ FullPath=$f.FullName; SourceRoot=$src; Language=(Get-LanguageFromExtension $f.FullName) })
        }
      } catch { Write-Log -Message "Scan error at $src for pattern $ext: $($_.Exception.Message)" -Level WARN -LogPath $LogPath }
    }
  }

  if($Config.IncludeMedia){
    $mediaExts=@(
      '.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.odt','.odp','.ods','.rtf','.rtfd','.epub',
      '.jpg','.jpeg','.png','.gif','.tif','.tiff','.bmp','.webp','.heic','.ico','.svg',
      '.mp3','.m4a','.aac','.wav','.flac','.ogg','.oga','.aiff','.aif','.wma',
      '.mp4','.mkv','.mov','.avi','.wmv','.m4v','.webm','.flv',
      '.zip','.7z','.rar','.tar','.gz','.bz2','.xz'
    )
    foreach($src in $sources){
      foreach($ext in $mediaExts){
        try{
          $files=Get-ChildItem -Path $src -Recurse -Include "*$ext" -File -ErrorAction SilentlyContinue
          foreach($f in $files){
            if(Should-ExcludePath -FullPath $f.FullName -ExcludeFolders $exclude){ continue }
            $results.Add([PSCustomObject]@{ FullPath=$f.FullName; SourceRoot=$src; Language=(Get-LanguageFromExtension $f.FullName) })
          }
        } catch { Write-Log -Message "Media scan error at $src for pattern $ext: $($_.Exception.Message)" -Level WARN -LogPath $LogPath }
      }
    }
  }

  $unique=$results | Group-Object FullPath | ForEach-Object { $_.Group[0] }
  return $unique
}

function Detect-ProjectRoot{param([string]$FilePath)
  $dir=[Path]::GetDirectoryName($FilePath); $root=(Get-Item $dir).Root.FullName
  while($dir -and $dir -ne $root){
    $names=Get-ChildItem -Path $dir -Name -Force -ErrorAction SilentlyContinue
    if($names -contains 'package.json' -or $names -contains 'pyproject.toml' -or $names -contains 'setup.py' -or
       ($names | Where-Object { $_ -like '*.sln' }) -or ($names | Where-Object { $_ -like '*.xcodeproj' }) -or
       $names -contains 'CMakeLists.txt' -or $names -contains 'Makefile'){ return $dir }
    $dir=[Path]::GetDirectoryName($dir)
  }
  return (Get-Item $FilePath).Directory.FullName
}

function New-CodexStaging{param([string]$OutputRoot)
  foreach($sub in @('collection','notes','metadata','logs','core-kernel','_backups')){
    New-Item -ItemType Directory -Path (Join-Path $OutputRoot $sub) -ErrorAction SilentlyContinue|Out-Null
  }
}

function New-CodexManifest{
  [CmdletBinding()]
  param([Parameter(Mandatory=$true)][object[]]$FileList,[Parameter(Mandatory=$true)][hashtable]$Config,[string]$LogPath)
  $manifest=[System.Collections.Generic.List[object]]::new()
  foreach($f in $FileList){
    try{
      $fi=Get-Item -LiteralPath $f.FullPath -ErrorAction Stop
      $hash=(Get-FileHash -Algorithm SHA256 -LiteralPath $fi.FullName).Hash
      $project=Detect-ProjectRoot -FilePath $fi.FullName
      $entryScore=0
      foreach($c in @('package.json','setup.py','pyproject.toml','CMakeLists.txt','Makefile')){
        $p=Join-Path $project $c; if(Test-Path $p){ $entryScore=[Math]::Max($entryScore,(Get-EntryPointScore $p)) }
      }
      $entryScore=[Math]::Max($entryScore,((Get-ChildItem -Path $project -Filter *.sln -ErrorAction SilentlyContinue).Count * 9))
      $entryScore=[Math]::Max($entryScore,((Get-ChildItem -Path $project -Filter *.xcodeproj -ErrorAction SilentlyContinue).Count * 9))
      $tags=Get-FileTagsFromPath -FullPath $fi.FullName
      $manifest.Add([PSCustomObject]@{
        id=$hash.Substring(0,16); path=$fi.FullName; name=$fi.Name; ext=$fi.Extension; size=$fi.Length
        created=$fi.CreationTimeUtc.ToString('o'); modified=$fi.LastWriteTimeUtc.ToString('o'); sha256=$hash
        drive=$fi.FullName.Substring(0,2); language=(Get-LanguageFromExtension $fi.FullName); projectRoot=$project
        entryPointScore=$entryScore; tags=$tags
      })
    } catch { Write-Log -Message "Manifest error for $($f.FullPath): $($_.Exception.Message)" -Level WARN -LogPath $LogPath }
  }
  return $manifest
}

function Resolve-DestinationPath{param([string]$OutputRoot,[object]$ManifestItem)
  Import-Module "$PSScriptRoot\codex-router.psm1" -Force

  # If a ProposedLayout override exists for this source path, honor it
  if ($Global:__Codex_Override_Targets -and $Global:__Codex_Override_Targets.ContainsKey($ManifestItem.path)) {
    $target = $Global:__Codex_Override_Targets[$ManifestItem.path]
    $parts = $target -split '[\\/]'
    if ($parts.Length -ge 3) {
      $type = $parts[0]; $lang = $parts[1]; $proj = $parts[2]
      $destDir = Join-Path (Join-Path $OutputRoot $type) (Join-Path $lang $proj)
      return (Join-Path $destDir $ManifestItem.name)
    }
  }


  try {
    if ($Global:__Codex_Override_Targets -and $Global:__Codex_Override_Targets.ContainsKey($ManifestItem.path)) {
      $target = $Global:__Codex_Override_Targets[$ManifestItem.path]
      $parts = $target -split '[\\/]'
      if ($parts.Length -ge 3) {
        $type = $parts[0]; $lang = $parts[1]; $proj = $parts[2]
        $destDir = Join-Path (Join-Path $OutputRoot $type) (Join-Path $lang $proj)
        return (Join-Path $destDir $ManifestItem.name)
      }
    }
    $cfgPath = Join-Path (Split-Path -Parent $PSScriptRoot) "codex-config.json"
    $cfg = Get-Content -Raw -Path $cfgPath | ConvertFrom-Json
    $routed = Resolve-RoutedDestination -Config $cfg -ManifestItem $ManifestItem
    if ($routed) {
      $parts = $routed -split '[\\/]'
      if ($parts.Length -ge 3) {
        $type = $parts[0]; $lang = $parts[1]; $proj = $parts[2]
        $destDir = Join-Path (Join-Path $OutputRoot $type) (Join-Path $lang $proj)
        return (Join-Path $destDir $ManifestItem.name)
      }
    }
  } catch {}

  $type= if($ManifestItem.tags -contains 'codex' -or $ManifestItem.language -eq 'Text' -or $ManifestItem.language -eq 'Document'){ 'notes' } else { 'collection' }
  $lang=$ManifestItem.language; if([string]::IsNullOrWhiteSpace($lang)){ $lang='Text' }
  $proj=([IO.Path]::GetFileName($ManifestItem.projectRoot)).Replace(' ','_'); if([string]::IsNullOrWhiteSpace($proj)){ $proj='misc' }
  $destDir=Join-Path (Join-Path $OutputRoot $type) (Join-Path $lang $proj)
  return (Join-Path $destDir $ManifestItem.name)
}

function Copy-CodexFiles{
  [CmdletBinding()]
  param([Parameter(Mandatory=$true)][object[]]$Manifest,[Parameter(Mandatory=$true)][hashtable]$Config,[string]$LogPath)
  $outputRoot=$Config.OutputRoot; $maxMB=[int]$Config.MaxCopySizeMB; $handling=$Config.LargeFileHandling; $dry=[bool]$Config.DryRun

  $copied=0
  foreach($m in $Manifest){
    try{
      $src=$m.path; $dest=Resolve-DestinationPath -OutputRoot $outputRoot -ManifestItem $m
      $destDir=[Path]::GetDirectoryName($dest); $sizeMB=[Math]::Round($m.size/1MB,2)

      # Guard: ensure destination is within OutputRoot (allows E:\ writes only there)
      $fullOut=[IO.Path]::GetFullPath($outputRoot); $fullDestDir=[IO.Path]::GetFullPath($destDir)
      if(-not $fullDestDir.StartsWith($fullOut,[System.StringComparison]::OrdinalIgnoreCase)){
        throw "Destination $fullDestDir is outside OutputRoot $fullOut. Aborting copy for safety."
      }

      if($dry){ Write-Log -Message "[DRY-RUN] Would place '$src' ($sizeMB MB) -> '$dest'" -Level INFO -LogPath $LogPath; continue }
      New-Item -ItemType Directory -Path $destDir -ErrorAction SilentlyContinue|Out-Null
      if($m.size -gt ($maxMB * 1MB) -and $handling -eq 'Link'){
        Set-Content -Path ($dest + ".link.txt") -Value "LARGE FILE PLACEHOLDER -> $src"
      } else {
        Copy-Item -LiteralPath $src -Destination $dest -Force -ErrorAction Stop
        $copied++
      }
    } catch { Write-Log -Message "Copy error for $($m.path): $($_.Exception.Message)" -Level WARN -LogPath $LogPath }
  }
  Write-Log -Message "Copy complete. Files copied: $copied" -Level INFO -LogPath $LogPath
}

function New-CodexIndexMarkdown{param([object[]]$Manifest,[string]$OutputRoot)
  $index=Join-Path $OutputRoot "metadata\INDEX.md"
  $lines=@("# CODEX V3 Index","","| id | name | lang | project | size | modified | src | tags | themes |","|---|---|---|---|---:|---|---|---|")
  foreach($m in ($Manifest | Sort-Object -Property @{Expression='entryPointScore';Descending=$true}, @{Expression='modified';Descending=$true})){
    $sizeMB=[Math]::Round($m.size/1MB,2); $tags=($m.tags -join ",")
    $themes = ($m.PSObject.Properties.Name -contains 'themes') ? ($m.themes -join ',') : ''
    $lines += "| {0} | {1} | {2} | {3} | {4} MB | {5} | {6} | {7} | {8} |" -f $m.id,$m.name,$m.language,([IO.Path]::GetFileName($m.projectRoot)),$sizeMB,$m.modified,$m.drive,$tags,$themes
  }
  Set-Content -Path $index -Value $lines -Force; return $index
}

function New-CodexBackupZip{param([string]$OutputRoot,[hashtable]$Config,[string]$LogPath)
  if(-not $Config.Backup.Enable){ Write-Log -Message "Backup disabled in config." -Level INFO -LogPath $LogPath; return $null }
  $targetDir=$Config.Backup.Target; New-Item -ItemType Directory -Path $targetDir -ErrorAction SilentlyContinue|Out-Null
  $stamp=(Get-Date).ToString('yyyyMMdd_HHmmss'); $zip=Join-Path $targetDir "CODEX_V3_$stamp.zip"
  if($Config.DryRun){ Write-Log -Message "[DRY-RUN] Would create backup zip at $zip" -Level INFO -LogPath $LogPath; return $zip }
  Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory($OutputRoot,$zip)
  Write-Log -Message "Backup zip created: $zip" -Level INFO -LogPath $LogPath; return $zip
}

function New-CoreKernelModuleManifest{param([object[]]$Manifest,[hashtable]$Config,[string]$LogPath)
  $modsFile=$Config.Integration.CoreKernelModulesFile; $modsDir=[Path]::GetDirectoryName($modsFile); New-Item -ItemType Directory -Path $modsDir -ErrorAction SilentlyContinue|Out-Null
  $modules=@(); $byProject=$Manifest | Group-Object projectRoot
  foreach($g in $byProject){
    $proj=$g.Name
    $entry=@{
      name=[IO.Path]::GetFileName($proj); root=$proj; languages=($g.Group.language | Select-Object -Unique); entryPoints=@(); files=@($g.Group | ForEach-Object { $_.path })
    }
    foreach($f in $g.Group){
      $n=[IO.Path]::GetFileName($f.path).ToLower()
      if($n -in @('package.json','setup.py','pyproject.toml','cmakelists.txt','makefile') -or $n.EndsWith('.sln') -or $n.EndsWith('.xcodeproj')){ $entry.entryPoints += $f.path }
    }
    
  foreach ($m in $g.Group) {
    $entry.priority += [int]$m.entryPointScore
    if ($m.PSObject.Properties.Name -contains 'themes' -and $m.themes) { $entry.priority += ($m.themes.Count * 2) }
  }
  $entry.themes = ($entry.themes | Select-Object -Unique)

  $modules += $entry
  }
  $json=$modules | ConvertTo-Json -Depth 6
  if($Config.DryRun){ Write-Log -Message "[DRY-RUN] Would write modules manifest to $modsFile" -Level INFO -LogPath $LogPath; return $json }
  Set-Content -Path $modsFile -Value $json -Force; return $modsFile
}
