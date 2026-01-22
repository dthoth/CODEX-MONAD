@echo off
chcp 65001 >nul
echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║         CODEX-MONAD NEW MACHINE SETUP                        ║
echo  ║         Bootstrap Script for Windows                          ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.
echo  This script will configure a new machine for CODEX-MONAD.
echo.
echo  Actions:
echo    [1] Create standard folder structure
echo    [2] Set up PowerShell profile with aliases
echo    [3] Configure Git (if installed)
echo    [4] Create desktop shortcuts
echo    [5] Clone CODEX-MONAD repo (if git available)
echo.
set /p "CONFIRM=Proceed? (y/N): "
if /i not "%CONFIRM%"=="y" exit /b

echo.
echo  ════════════════════════════════════════════════════════════════
echo  [1/5] Creating folder structure...
echo  ════════════════════════════════════════════════════════════════

:: Create directories
if not exist "%USERPROFILE%\Documents\GitHub" mkdir "%USERPROFILE%\Documents\GitHub"
if not exist "%USERPROFILE%\Documents\CODEX" mkdir "%USERPROFILE%\Documents\CODEX"
if not exist "%USERPROFILE%\Documents\CODEX\archive" mkdir "%USERPROFILE%\Documents\CODEX\archive"
if not exist "%USERPROFILE%\Documents\CODEX\projects" mkdir "%USERPROFILE%\Documents\CODEX\projects"
if not exist "%USERPROFILE%\Documents\CODEX\scratch" mkdir "%USERPROFILE%\Documents\CODEX\scratch"

echo   [✓] Created ~/Documents/GitHub
echo   [✓] Created ~/Documents/CODEX/archive
echo   [✓] Created ~/Documents/CODEX/projects
echo   [✓] Created ~/Documents/CODEX/scratch
echo.

echo  ════════════════════════════════════════════════════════════════
echo  [2/5] Setting up PowerShell profile...
echo  ════════════════════════════════════════════════════════════════

:: Create PowerShell profile directory if needed
if not exist "%USERPROFILE%\Documents\WindowsPowerShell" mkdir "%USERPROFILE%\Documents\WindowsPowerShell"

:: Append to profile (or create)
set "PROFILE_PATH=%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"

echo # CODEX-MONAD Profile Additions >> "%PROFILE_PATH%"
echo # Added by new-machine.bat on %date% >> "%PROFILE_PATH%"
echo. >> "%PROFILE_PATH%"
echo # Custom prompt >> "%PROFILE_PATH%"
echo function prompt { >> "%PROFILE_PATH%"
echo     $time = Get-Date -Format "HH:mm" >> "%PROFILE_PATH%"
echo     "$env:USERNAME ^| $time ^| " >> "%PROFILE_PATH%"
echo } >> "%PROFILE_PATH%"
echo. >> "%PROFILE_PATH%"
echo # Aliases >> "%PROFILE_PATH%"
echo Set-Alias -Name g -Value git >> "%PROFILE_PATH%"
echo Set-Alias -Name c -Value code >> "%PROFILE_PATH%"
echo Set-Alias -Name py -Value python >> "%PROFILE_PATH%"
echo. >> "%PROFILE_PATH%"
echo # Quick navigation >> "%PROFILE_PATH%"
echo function codex { Set-Location "$env:USERPROFILE\Documents\CODEX" } >> "%PROFILE_PATH%"
echo function repo { Set-Location "$env:USERPROFILE\Documents\GitHub\CODEX-MONAD" } >> "%PROFILE_PATH%"
echo function desk { Set-Location "$env:USERPROFILE\Desktop" } >> "%PROFILE_PATH%"
echo. >> "%PROFILE_PATH%"
echo # Morning command >> "%PROFILE_PATH%"
echo function morning { >> "%PROFILE_PATH%"
echo     Write-Host "CODEX Morning Protocol" -ForegroundColor Yellow >> "%PROFILE_PATH%"
echo     Write-Host "======================" -ForegroundColor Yellow >> "%PROFILE_PATH%"
echo     Get-Date >> "%PROFILE_PATH%"
echo     if (Test-Path "$env:USERPROFILE\Documents\GitHub\CODEX-MONAD") { >> "%PROFILE_PATH%"
echo         Set-Location "$env:USERPROFILE\Documents\GitHub\CODEX-MONAD" >> "%PROFILE_PATH%"
echo         git status -s >> "%PROFILE_PATH%"
echo     } >> "%PROFILE_PATH%"
echo } >> "%PROFILE_PATH%"
echo. >> "%PROFILE_PATH%"
echo Write-Host "CODEX_FORGE ^| $(Get-Date -Format 'HH:mm') ^| type morning for full view" -ForegroundColor Cyan >> "%PROFILE_PATH%"

echo   [✓] PowerShell profile updated
echo       Restart PowerShell to apply changes
echo.

echo  ════════════════════════════════════════════════════════════════
echo  [3/5] Configuring Git...
echo  ════════════════════════════════════════════════════════════════

where git >nul 2>&1
if %errorlevel%==0 (
    echo   Git found. Current config:
    git config --global user.name
    git config --global user.email
    echo.
    set /p "GITCONFIG=Update git config? (y/N): "
    if /i "%GITCONFIG%"=="y" (
        set /p "GITNAME=Your name: "
        set /p "GITEMAIL=Your email: "
        git config --global user.name "%GITNAME%"
        git config --global user.email "%GITEMAIL%"
        git config --global init.defaultBranch main
        git config --global pull.rebase false
        echo   [✓] Git configured
    ) else (
        echo   [Skipped]
    )
) else (
    echo   [!] Git not found. Install from: https://git-scm.com/
)
echo.

echo  ════════════════════════════════════════════════════════════════
echo  [4/5] Creating desktop shortcuts...
echo  ════════════════════════════════════════════════════════════════

:: Copy CODEX-ARK to desktop if running from floppy/USB
if exist "%~dp0..\index.html" (
    xcopy "%~dp0..\*" "%USERPROFILE%\Desktop\CODEX-ARK\" /E /I /Y >nul
    echo   [✓] CODEX-ARK copied to Desktop
) else (
    echo   [i] Run from CODEX-ARK folder to copy to Desktop
)
echo.

echo  ════════════════════════════════════════════════════════════════
echo  [5/5] Cloning CODEX-MONAD repository...
echo  ════════════════════════════════════════════════════════════════

where git >nul 2>&1
if %errorlevel%==0 (
    if not exist "%USERPROFILE%\Documents\GitHub\CODEX-MONAD" (
        set /p "CLONE=Clone CODEX-MONAD from GitHub? (y/N): "
        if /i "%CLONE%"=="y" (
            cd /d "%USERPROFILE%\Documents\GitHub"
            git clone https://github.com/dthoth/CODEX-MONAD.git
            echo   [✓] Repository cloned
        ) else (
            echo   [Skipped]
        )
    ) else (
        echo   [i] Repository already exists
    )
) else (
    echo   [!] Git not installed - cannot clone
)

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║  Setup complete!                                             ║
echo  ║                                                               ║
echo  ║  Next steps:                                                  ║
echo  ║    1. Restart PowerShell for profile changes                 ║
echo  ║    2. Install: git, node, python, vscode (if needed)         ║
echo  ║    3. Run 'morning' command to verify setup                  ║
echo  ║    4. Install Claude Code: npm install -g @anthropic/claude  ║
echo  ║                                                               ║
echo  ║  "Everything is exactly as it should be already."            ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.
pause
