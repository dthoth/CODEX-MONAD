@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules call npm ci
set DISABLE_GPU=1
set PORTABLE_MODE=1
npx -y electron .
