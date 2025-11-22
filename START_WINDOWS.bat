@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 ( echo Node.js not found. Install Node 18+ from https://nodejs.org and rerun. & pause & exit /b 1 )
if not exist node_modules ( echo Installing dependencies... & call npm ci )
call npm run start
