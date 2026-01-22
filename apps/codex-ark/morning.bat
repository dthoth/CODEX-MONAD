@echo off
chcp 65001 >nul
echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║         CODEX-MONAD MORNING PROTOCOL                         ║
echo  ║         %date% %time%                            ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Divine Triage Check
echo  [TRIAGE] What matters most today?
echo  ────────────────────────────────────────────────────────────────
echo   1. Life/Death (Safety, Health, Samson)
echo   2. Catastrophic Loss Prevention (Deadlines, Critical Systems)
echo   3. High-Value Irreversible (Time-sensitive opportunities)
echo   4. Maintenance (Keep systems running)
echo   5. Growth (Learning, Building, Creating)
echo   6. Optional (Nice-to-have)
echo  ────────────────────────────────────────────────────────────────
echo.

:: Sync repos
echo  [1/5] Syncing CODEX-MONAD repositories...
echo.

if exist "%USERPROFILE%\Documents\GitHub\CODEX-MONAD" (
    echo   GitHub repo found. Pulling...
    cd /d "%USERPROFILE%\Documents\GitHub\CODEX-MONAD"
    git pull 2>nul || echo   [!] Git pull failed - check connection
) else (
    echo   [!] GitHub repo not found at expected path
)

if exist "%USERPROFILE%\OneDrive\CODEX-MONAD-main" (
    echo   OneDrive repo found.
) else (
    echo   [i] OneDrive repo not present on this machine
)

echo.

:: Repository Status
echo  [2/5] Repository Status:
echo  ────────────────────────────────────────────────────────────────
cd /d "%USERPROFILE%\Documents\GitHub\CODEX-MONAD" 2>nul && (
    echo   Branch:
    git branch --show-current
    echo.
    echo   Recent commits:
    git log --oneline -5
    echo.
    echo   Local changes:
    git status -s
    if "%errorlevel%"=="0" echo   [Clean - no uncommitted changes]
)
echo  ────────────────────────────────────────────────────────────────
echo.

:: Check key processes
echo  [3/5] System Status:
echo  ────────────────────────────────────────────────────────────────
tasklist /fi "imagename eq claude.exe" 2>nul | find /i "claude" >nul && echo   [✓] Claude Code running || echo   [ ] Claude Code not running
tasklist /fi "imagename eq electron.exe" 2>nul | find /i "electron" >nul && echo   [✓] Electron app running || echo   [ ] No Electron apps
tasklist /fi "imagename eq node.exe" 2>nul | find /i "node" >nul && echo   [✓] Node.js running || echo   [ ] Node.js not running
tasklist /fi "imagename eq python.exe" 2>nul | find /i "python" >nul && echo   [✓] Python running || echo   [ ] Python not running
echo  ────────────────────────────────────────────────────────────────
echo.

:: Disk space check
echo  [4/5] Storage:
echo  ────────────────────────────────────────────────────────────────
for /f "tokens=3" %%a in ('dir c:\ ^| findstr /c:"bytes free"') do echo   C: %%a bytes free
echo  ────────────────────────────────────────────────────────────────
echo.

:: Launch portal
echo  [5/5] Launching CODEX Portal...
if exist "%~dp0gui-portal.html" (
    start "" "%~dp0gui-portal.html"
    echo   [✓] Portal launched
) else if exist "%~dp0index.html" (
    start "" "%~dp0index.html"
    echo   [✓] ARK index launched
) else (
    echo   [!] No portal found - run from CODEX-ARK directory
)

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║  Morning protocol complete. The day begins.                  ║
echo  ║                                                               ║
echo  ║  "Everything is exactly as it should be already."            ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.
echo  Press any key to continue or close this window...
pause >nul
