@echo off
chcp 65001 >nul
echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║         CODEX-MONAD SYNC PROTOCOL                            ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Find repo
set "REPO="
if exist "%USERPROFILE%\Documents\GitHub\CODEX-MONAD\.git" (
    set "REPO=%USERPROFILE%\Documents\GitHub\CODEX-MONAD"
) else if exist "%USERPROFILE%\OneDrive\CODEX-MONAD-main\.git" (
    set "REPO=%USERPROFILE%\OneDrive\CODEX-MONAD-main"
) else if exist "C:\Users\dthot\GitHub\CODEX-MONAD\.git" (
    set "REPO=C:\Users\dthot\GitHub\CODEX-MONAD"
)

if "%REPO%"=="" (
    echo  [!] CODEX-MONAD repository not found!
    echo      Checked:
    echo        - %USERPROFILE%\Documents\GitHub\CODEX-MONAD
    echo        - %USERPROFILE%\OneDrive\CODEX-MONAD-main
    pause
    exit /b 1
)

echo  Repository: %REPO%
cd /d "%REPO%"
echo.

:: Show current state
echo  ────────────────────────────────────────────────────────────────
echo  Branch:
git branch --show-current
echo.
echo  Remote:
git remote -v | head -1
echo  ────────────────────────────────────────────────────────────────
echo.

:: Pull first
echo  [PULL] Fetching latest from remote...
git fetch
git pull
echo.

:: Show status
echo  [STATUS] Local changes:
echo  ────────────────────────────────────────────────────────────────
git status -s
if %errorlevel%==0 (
    git status -s | find /v /c "" >nul && (
        echo   [No uncommitted changes]
    )
)
echo  ────────────────────────────────────────────────────────────────
echo.

:: Prompt for commit
set /p "COMMIT=Commit and push? (y/N): "
if /i "%COMMIT%"=="y" goto :docommit
if /i "%COMMIT%"=="yes" goto :docommit
echo  [Skipped] No changes committed.
goto :done

:docommit
echo.
set /p "MSG=Commit message: "
if "%MSG%"=="" (
    set "MSG=sync: updates from %COMPUTERNAME% at %date% %time%"
)

echo.
echo  [COMMIT] Staging all changes...
git add -A

echo  [COMMIT] Committing: %MSG%
git commit -m "%MSG%"

echo  [PUSH] Pushing to remote...
git push

if %errorlevel%==0 (
    echo.
    echo  [✓] Successfully synced!
) else (
    echo.
    echo  [!] Push failed - check connection or conflicts
)

:done
echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║  Sync complete.                                              ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.
pause
