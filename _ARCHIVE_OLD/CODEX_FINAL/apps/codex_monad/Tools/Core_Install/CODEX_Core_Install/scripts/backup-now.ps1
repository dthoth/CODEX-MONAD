
param([string]$Root = "E:\CODEX_V3")
$stamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
$zip = Join-Path $Root "_backups\CODEX_V3_$stamp.zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($Root,$zip)
Write-Host "Backup created: $zip"
