@echo off
setlocal
set "ASTRO_TELEMETRY_DISABLED=1"
cd /d "%~dp0"
for /d %%D in ("%~dp0..\.tools\node-*-win-x64") do set "PATH=%%~fD;%PATH%"
call npm.cmd run dev
