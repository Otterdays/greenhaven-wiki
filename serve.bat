@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1 || (echo Install Node.js from https://nodejs.org && pause && exit /b 1)
if not defined RPG_WIKI_BIND set RPG_WIKI_BIND=127.0.0.1:6004
for /f "tokens=2 delims=:" %%P in ("%RPG_WIKI_BIND%") do call "%~dp0..\batch\kill-port.bat" %%P
echo Starting Greenhaven wiki
echo Open http://%RPG_WIKI_BIND%
start "" /b cmd /c "ping -n 3 127.0.0.1 >nul & start http://%RPG_WIKI_BIND%"
node "%~dp0serve.mjs"
echo.
pause
