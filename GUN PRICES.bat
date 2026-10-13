@echo off
REM ===================================================================
REM  GUN PRICES - double-click this.
REM
REM  "yes make it one file i can double click". This is that file. It
REM  checks the shop computer has what it needs, installs anything
REM  missing, then asks which of the two jobs to do.
REM
REM  Everything it writes lands in this same folder.
REM ===================================================================
title Gun prices - Lamar's Pawn Desk
cd /d "%~dp0"
color 0F
cls
echo.
echo   ===========================================
echo     GUN PRICES
echo   ===========================================
echo.

REM ---- 1. is Node here? ----------------------------------------------
where node >/dev/null 2>nul
if %errorlevel% equ 0 goto HAVENODE
echo   This computer needs Node first. Trying to install it...
echo.
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
where node >/dev/null 2>nul
if %errorlevel% equ 0 (
  echo.
  echo   Node is installed. CLOSE THIS WINDOW and double-click this file
  echo   again, so the computer notices it.
  echo.
  pause
  exit /b 0
)
echo.
echo   That did not work. Opening the Node website.
echo   Click the big green button, install it, then double-click this
echo   file again.
echo.
start https://nodejs.org/
pause
exit /b 1

:HAVENODE
for /f "tokens=*" %%v in ('node --version') do set NODEV=%%v
echo   Node %NODEV% - good.

REM ---- 2. the browser it drives --------------------------------------
if exist "node_modules\playwright" goto HAVEPW
echo   Getting the browser it needs. This takes a few minutes, once.
echo.
call npm install playwright --no-audit --no-fund
if errorlevel 1 goto NPMFAIL
call npx playwright install chromium
if errorlevel 1 goto NPMFAIL
echo.
echo   Done. That was the one-time part.
:HAVEPW

REM ---- 3. which job --------------------------------------------------
echo.
echo   ---------------------------------------------------------------
echo    1   Test it on ONE gun  ^(do this first - writes nothing^)
echo    2   Read ALL the guns   ^(about an hour - leave it running^)
echo    3   Quit
echo   ---------------------------------------------------------------
echo.
set /p PICK=  Type 1, 2 or 3 and press Enter: 
echo.
if "%PICK%"=="1" goto PROBE
if "%PICK%"=="2" goto FULL
exit /b 0

:PROBE
node tools\gun-overnight.mjs --probe
echo.
echo   ===========================================
echo     Look in this folder for two files starting gun-probe
echo     One is a picture, one is text. Send Claude both.
echo   ===========================================
echo.
pause
exit /b 0

:FULL
node tools\gun-overnight.mjs
echo.
echo   ===========================================
echo     Look in this folder for two files starting gun-prices
echo     Read the one ending .md FIRST. It says what it skipped.
echo     Then load the .csv in the desk, under Setup.
echo   ===========================================
echo.
pause
exit /b 0

:NPMFAIL
echo.
echo   Something went wrong getting the browser. Usually that is the
echo   shop internet. Try again in a minute; if it keeps failing, send
echo   Claude a photo of this window.
echo.
pause
exit /b 1
