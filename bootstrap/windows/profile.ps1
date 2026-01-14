# ═══════════════════════════════════════════════════════════════════════════
# CODEX-MONAD Morning CLI System for PowerShell
# Universal Bootstrap Edition - Auto-detects paths
# ═══════════════════════════════════════════════════════════════════════════

# --- Auto-Detect CODEX Repository ---
$CODEX_REPO = $null
$PossibleRepoPaths = @(
    "D:\HINENI_HUB\10-repos-central\CODEX-MONAD",
    "E:\HINENI_HUB\10-repos-central\CODEX-MONAD",
    "F:\HINENI_HUB\10-repos-central\CODEX-MONAD",
    "G:\HINENI_HUB\10-repos-central\CODEX-MONAD",
    "$HOME\Documents\GitHub\CODEX-MONAD",
    "$HOME\GitHub\CODEX-MONAD",
    "$HOME\CODEX\CODEX-MONAD",
    "$HOME\Code\CODEX-MONAD"
)

foreach ($path in $PossibleRepoPaths) {
    if (Test-Path $path) {
        $CODEX_REPO = $path
        break
    }
}

# --- Configuration ---
$DEVICE_NAME = $env:COMPUTERNAME
$CODEX_STAGING = "$HOME\Documents\CODEX_STAGING"
$NOTES_DIR = "$CODEX_STAGING\notes"

# Ensure directories exist
New-Item -ItemType Directory -Path $NOTES_DIR -Force | Out-Null
New-Item -ItemType Directory -Path "$CODEX_STAGING\import_ready" -Force | Out-Null

# --- Dragon ASCII Art ---
$DragonArt = @(
@"
        /\___/\
       /       \
      |  #   #  |
       \   ^   /      CODEX DRAGON SAYS:
        |     |__
        /       \
       /         \ 
      |           |
"@,
@"
     /|                        |\
    / |           CODEX        | \
   /  |      ___________       |  \
  /   |     /           \      |   \
 /    |    |   WISDOM    |     |    \
 \    |     \___________/      |    /
  \   |                        |   /
   \  |________________________|  /
"@
)

# --- Dragon Fortunes Database ---
$DragonWisdom = @(
    "The infrastructure is conscious of itself.",
    "Already working before you begin.",
    "Save everything that should or can be saved.",
    "The shebang has been shebanged.",
    "Charge on delivery - systems prove worth through results.",
    "Feature, not a bug.",
    "The portal discovers itself.",
    "Pure signal, no noise.",
    "The monad reflects the universe internally.",
    "Distributed cognition is still cognition.",
    "The floppy constraint is a gift.",
    "HINENI - Here I Am.",
    "Backup is not paranoia. Backup is love.",
    "Git push is a prayer. Git pull is an answer.",
    "Sync early. Sync often. Sync always.",
    "You can not have everything. Where would you put it?",
    "On a clear disk you can seek forever.",
    "Time flies like an arrow. Fruit flies like a banana.",
    "The best way to predict the future is to create it.",
    "Simplicity is the ultimate sophistication.",
    "There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.",
    "It works on my machine.",
    "It compiles. Ship it.",
    "Have you tried turning it off and on again?",
    "The cloud is just someone elses computer.",
    "The obstacle is the way. -- Marcus Aurelius",
    "Memento mori - Remember you will die.",
    "Amor fati - Love your fate.",
    "Do or do not. There is no try. -- Yoda",
    "May the Force be with you.",
    "42. -- The Answer to Life, the Universe, and Everything",
    "Dont Panic. -- Hitchhikers Guide",
    "Nobody expects the Spanish Inquisition!",
    "Always look on the bright side of life.",
    "Fear is the mind-killer. -- Dune",
    "The spice must flow. -- Dune",
    "Make it so. -- Picard",
    "Live long and prosper. -- Spock",
    "This too shall pass.",
    "Know thyself. -- Delphic Oracle",
    "With great power comes great responsibility.",
    "Stay hungry, stay foolish. -- Steve Jobs",
    "Be excellent to each other. -- Bill and Ted"
)

# --- Cognomens ---
$Cognomens = @(
    "Rev. Lux Luther",
    "Aligner of Stars",
    "Distiller of Consciousness",
    "Builder of Dragons",
    "King of the Kingdom of Hipsters",
    "Someone Who Has To",
    "Keeper of the Floppy Constraint",
    "The Shebang Principle Made Flesh",
    "Walker Between Worlds",
    "The One Who Notices"
)

$CognomenTitles = @(
    "Your mission, should you choose to accept it:",
    "Remember:",
    "Today you are:",
    "The universe recognizes you as:",
    "Rise and be:"
)

# ═══════════════════════════════════════════════════════════════════════════
# CORE FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function Save-Fortune {
    param([string]$Fortune)
    $logFile = "$CODEX_STAGING\dragon_wisdom_log.txt"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $entry = "$timestamp | $Fortune"
    Add-Content -Path $logFile -Value $entry
}

function qn {
    param([string]$Note)
    $timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
    $filename = "$NOTES_DIR\$timestamp-note.md"
    $datestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    if ($Note) {
        $content = "---`ncreated: $datestamp`ndevice: $DEVICE_NAME`ntype: quick-note`n---`n`n$Note"
        $content | Out-File -FilePath $filename -Encoding UTF8
        Write-Host ""
        Write-Host "  [NOTE SAVED]" -ForegroundColor Green
        Write-Host "  $filename" -ForegroundColor DarkGray
        Write-Host ""
    }
    else {
        notepad $filename
    }
}

function notes {
    param([string]$Action)

    if ($Action -eq "sync") {
        $batchName = "batch_" + (Get-Date -Format "yyyyMMdd_HHmmss")
        $batch = "$CODEX_STAGING\import_ready\$batchName"
        New-Item -ItemType Directory -Path $batch -Force | Out-Null
        $files = Get-ChildItem "$NOTES_DIR\*.md" -ErrorAction SilentlyContinue
        if ($files) {
            $files | Move-Item -Destination $batch
            Write-Host ""
            Write-Host "  [NOTES SYNCED]" -ForegroundColor Cyan
            Write-Host "  Moved $($files.Count) notes" -ForegroundColor DarkGray
            Write-Host ""
        }
        else {
            Write-Host "  No notes to sync" -ForegroundColor Yellow
        }
    }
    elseif ($Action -eq "today") {
        $today = Get-Date -Format "yyyy-MM-dd"
        Write-Host ""
        Write-Host "  TODAY'S NOTES:" -ForegroundColor Yellow
        Get-ChildItem "$NOTES_DIR\*$today*.md" -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "    $($_.BaseName)" -ForegroundColor Gray
        }
        Write-Host ""
    }
    elseif ($Action -eq "open") {
        explorer $NOTES_DIR
    }
    else {
        $files = Get-ChildItem "$NOTES_DIR\*.md" -ErrorAction SilentlyContinue
        $count = 0
        if ($files) { $count = $files.Count }
        Write-Host ""
        Write-Host "  STAGED NOTES ($count pending):" -ForegroundColor Yellow
        Get-ChildItem "$NOTES_DIR\*.md" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | ForEach-Object {
            Write-Host "    $($_.BaseName)" -ForegroundColor Gray
        }
        Write-Host ""
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# DRAGON SYSTEM
# ═══════════════════════════════════════════════════════════════════════════

function dragon {
    $Global:LastFortune = $DragonWisdom | Get-Random
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Yellow
    Write-Host "       THE DRAGON SPEAKS" -ForegroundColor DarkYellow
    Write-Host "  ================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    $Global:LastFortune" -ForegroundColor White
    Write-Host ""
}

function keeper {
    if ($Global:LastFortune) {
        Save-Fortune $Global:LastFortune
        Write-Host ""
        Write-Host "  [WISDOM PRESERVED]" -ForegroundColor Green
        Write-Host "  Saved to dragon_wisdom_log.txt" -ForegroundColor DarkGray
        Write-Host ""
    }
    else {
        Write-Host ""
        Write-Host "  [ERROR] No fortune to save" -ForegroundColor Red
        Write-Host "  Run dragon first!" -ForegroundColor DarkGray
        Write-Host ""
    }
}

function wisdom {
    $logFile = "$CODEX_STAGING\dragon_wisdom_log.txt"
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host "       DRAGON WISDOM ARCHIVE" -ForegroundColor Cyan
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path $logFile) {
        $lines = Get-Content $logFile
        Write-Host "  $($lines.Count) fortunes saved" -ForegroundColor DarkGray
        Write-Host ""
        Get-Content $logFile | Select-Object -Last 10 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "  No wisdom saved yet" -ForegroundColor DarkGray
        Write-Host "  Use dragon then keeper to save!" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════════════════
# NAVIGATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function codex {
    if ($CODEX_REPO -and (Test-Path $CODEX_REPO)) {
        Set-Location $CODEX_REPO
        Write-Host ""
        Write-Host "  ================================================" -ForegroundColor Magenta
        Write-Host "       CODEX-MONAD" -ForegroundColor Magenta
        Write-Host "  ================================================" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "  $CODEX_REPO" -ForegroundColor DarkGray
        Write-Host ""
        
        if (Test-Path ".git") {
            $branch = git branch --show-current 2>$null
            $changes = (git status --porcelain 2>$null | Measure-Object).Count
            Write-Host "  Branch: $branch" -ForegroundColor Cyan
            if ($changes -gt 0) {
                Write-Host "  Changes: $changes uncommitted" -ForegroundColor Yellow
            }
            else {
                Write-Host "  Status: Clean" -ForegroundColor Green
            }
        }
        Write-Host ""
    }
    else {
        Write-Host "  [ERROR] CODEX-MONAD not found" -ForegroundColor Red
        Write-Host "  Checked paths:" -ForegroundColor DarkGray
        foreach ($p in $PossibleRepoPaths) {
            Write-Host "    - $p" -ForegroundColor DarkGray
        }
    }
}

function apps {
    if (-not $CODEX_REPO) {
        Write-Host "  [ERROR] CODEX_REPO not found" -ForegroundColor Red
        return
    }
    $appsPath = "$CODEX_REPO\apps"
    if (Test-Path $appsPath) {
        Set-Location $appsPath
        Write-Host ""
        Write-Host "  ================================================" -ForegroundColor Green
        Write-Host "       CODEX APPS" -ForegroundColor Green
        Write-Host "  ================================================" -ForegroundColor Green
        Write-Host ""
        
        Get-ChildItem -Directory | ForEach-Object {
            $hasManifest = Test-Path "$($_.FullName)\app.json"
            if ($hasManifest) {
                Write-Host "    [x] $($_.Name)" -ForegroundColor Cyan
            }
            else {
                Write-Host "    [ ] $($_.Name)" -ForegroundColor DarkGray
            }
        }
        Write-Host ""
    }
    else {
        Write-Host "  [ERROR] Apps folder not found" -ForegroundColor Red
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# GIT WORKFLOW FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function sync {
    if (-not (Test-Path ".git")) {
        Write-Host "  [ERROR] Not a git repository" -ForegroundColor Red
        return
    }
    
    $repo = Split-Path -Leaf (Get-Location)
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host "       SYNCING: $repo" -ForegroundColor Cyan
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "  Fetching..." -ForegroundColor DarkGray
    git fetch --quiet 2>$null
    
    Write-Host "  Pulling..." -ForegroundColor DarkGray
    git pull --quiet 2>$null
    
    Write-Host "  [DONE] Sync complete" -ForegroundColor Green
    Write-Host ""
}

function ship {
    param([string]$Message)
    
    if (-not (Test-Path ".git")) {
        Write-Host "  [ERROR] Not a git repository" -ForegroundColor Red
        return
    }
    
    $changes = (git status --porcelain 2>$null | Measure-Object).Count
    if ($changes -eq 0) {
        Write-Host "  Nothing to ship" -ForegroundColor Yellow
        return
    }
    
    $repo = Split-Path -Leaf (Get-Location)
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Magenta
    Write-Host "       SHIPPING: $repo" -ForegroundColor Magenta
    Write-Host "  ================================================" -ForegroundColor Magenta
    Write-Host ""
    
    Write-Host "  Changes:" -ForegroundColor DarkGray
    git status --short
    Write-Host ""
    
    if (-not $Message) {
        $Message = Read-Host "  Commit message"
        if (-not $Message) {
            $ts = Get-Date -Format "yyyy-MM-dd HH:mm"
            $Message = "Quick update $ts"
        }
    }
    
    git add .
    git commit -m $Message --quiet 2>$null
    
    Write-Host "  Pushing..." -ForegroundColor DarkGray
    git push 2>$null
    
    Write-Host ""
    Write-Host "  [SHIPPED]" -ForegroundColor Green
    Write-Host ""
}

function fleet {
    $repos = @()
    
    # Add repos from possible HINENI_HUB locations
    $hubDrives = @("D:", "E:", "F:", "G:")
    foreach ($drive in $hubDrives) {
        $hubPath = "$drive\HINENI_HUB\10-repos-central"
        if (Test-Path $hubPath) {
            Get-ChildItem $hubPath -Directory | ForEach-Object {
                if (Test-Path "$($_.FullName)\.git") {
                    $repos += $_.FullName
                }
            }
        }
    }
    
    # Add local repos
    $localPaths = @(
        "$HOME\Documents\GitHub",
        "$HOME\GitHub",
        "$HOME\Code"
    )
    foreach ($localPath in $localPaths) {
        if (Test-Path $localPath) {
            Get-ChildItem $localPath -Directory | ForEach-Object {
                if (Test-Path "$($_.FullName)\.git") {
                    $repos += $_.FullName
                }
            }
        }
    }
    
    # Remove duplicates
    $repos = $repos | Select-Object -Unique
    
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host "       FLEET STATUS" -ForegroundColor Cyan
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($repos.Count -eq 0) {
        Write-Host "  No repositories found" -ForegroundColor DarkGray
    }
    else {
        foreach ($repo in $repos) {
            $name = Split-Path -Leaf $repo
            Push-Location $repo
            
            $branch = git branch --show-current 2>$null
            $changes = (git status --porcelain 2>$null | Measure-Object).Count
            
            if ($changes -gt 0) {
                Write-Host "    [*] $name ($branch) - $changes changes" -ForegroundColor Yellow
            }
            else {
                Write-Host "    [ok] $name ($branch)" -ForegroundColor Green
            }
            
            Pop-Location
        }
    }
    
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════════════════
# PERSONAL / FUN FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function lux {
    $cognomen = $Cognomens | Get-Random
    $title = $CognomenTitles | Get-Random
    
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Yellow
    Write-Host "       COGNOMEN" -ForegroundColor DarkYellow
    Write-Host "  ================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    $title" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    $cognomen" -ForegroundColor White
    Write-Host ""
}

function hierarchies {
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Magenta
    Write-Host "       DIVINE TRIAGE - Priority Hierarchies" -ForegroundColor Magenta
    Write-Host "  ================================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "    1. HEALTH" -ForegroundColor Red
    Write-Host "       Body, mind, immediate safety" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    2. PARENTING" -ForegroundColor Yellow
    Write-Host "       Samson's needs, presence, support" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    3. CLIENTS" -ForegroundColor Green
    Write-Host "       Paid work, deadlines, deliverables" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    4. PROJECTS" -ForegroundColor Cyan
    Write-Host "       CODEX, infrastructure, systems" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    5. CREATIVE" -ForegroundColor Blue
    Write-Host "       Writing, music, art, HINENI" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    6. MAINTENANCE" -ForegroundColor Gray
    Write-Host "       Bills, admin, cleanup, life ops" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    Charge on delivery - systems prove worth through results." -ForegroundColor DarkGray
    Write-Host ""
}

function timestamp {
    $ts = Get-Date -Format "yyyy-MM-dd_HHmmss"
    $iso = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    
    Set-Clipboard -Value $ts
    
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host "       TIMESTAMP" -ForegroundColor Cyan
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    File:  $ts" -ForegroundColor White
    Write-Host "    ISO:   $iso" -ForegroundColor White
    Write-Host ""
    Write-Host "    Copied to clipboard!" -ForegroundColor Green
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════════════════
# PORTAL / GUI FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function gui {
    if (-not $CODEX_REPO) {
        Write-Host "  [ERROR] CODEX_REPO not found" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host "       CODEX PORTAL" -ForegroundColor Cyan
    Write-Host "  ================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if npm is available
    $npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmInstalled) {
        Write-Host "    Launching Electron..." -ForegroundColor DarkGray
        Write-Host ""
        Push-Location $CODEX_REPO
        npm start
        Pop-Location
    }
    else {
        # Fallback: open index.html in browser
        $indexPath = "$CODEX_REPO\index.html"
        if (Test-Path $indexPath) {
            Write-Host "    Opening in browser..." -ForegroundColor DarkGray
            Start-Process $indexPath
        }
        else {
            Write-Host "    [ERROR] Portal not found" -ForegroundColor Red
        }
    }
}

function portal {
    hierarchies
}

# ═══════════════════════════════════════════════════════════════════════════
# MORNING RITUAL
# ═══════════════════════════════════════════════════════════════════════════

function morning {
    Clear-Host

    # 15% chance to show dragon art
    $roll = Get-Random -Minimum 1 -Maximum 8
    if ($roll -eq 1) {
        $art = $DragonArt | Get-Random
        Write-Host $art -ForegroundColor DarkYellow
        Write-Host ""
    }

    $dateStr = Get-Date -Format "dddd, MMMM dd, yyyy"
    $timeStr = Get-Date -Format "h:mm tt"
    
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor DarkCyan
    Write-Host "    $dateStr  $timeStr" -ForegroundColor White
    Write-Host "    $DEVICE_NAME (CODEX)" -ForegroundColor DarkGray
    Write-Host "  ================================================" -ForegroundColor DarkCyan

    # Show repo status if found
    if ($CODEX_REPO) {
        Write-Host "    Repo: $CODEX_REPO" -ForegroundColor DarkGray
    }
    else {
        Write-Host "    [!] CODEX repo not detected" -ForegroundColor DarkYellow
    }

    $Global:LastFortune = $DragonWisdom | Get-Random
    Write-Host ""
    Write-Host "  DRAGON:" -ForegroundColor DarkYellow
    Write-Host "    $Global:LastFortune" -ForegroundColor Yellow
    Write-Host ""

    notes

    Write-Host "  COMMANDS:" -ForegroundColor Magenta
    Write-Host "    dragon       Fortune        |  keeper       Save fortune"
    Write-Host "    gui          Portal         |  codex        Go to repo"
    Write-Host "    qn 'note'    Quick capture  |  notes        Browse all"
    Write-Host "    sync         Git pull       |  ship 'msg'   Git push"
    Write-Host "    fleet        All repos      |  hierarchies  Priorities"
    Write-Host "    lux          Cognomen       |  timestamp    Copy time"
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════════════════
# AUTO-GREETING ON NEW SHELL
# ═══════════════════════════════════════════════════════════════════════════

$timeNow = Get-Date -Format "HH:mm"
Write-Host "$DEVICE_NAME | $timeNow | type morning for full view" -ForegroundColor DarkCyan
