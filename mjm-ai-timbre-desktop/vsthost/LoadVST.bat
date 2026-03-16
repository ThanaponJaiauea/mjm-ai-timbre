@echo off
setlocal EnableDelayedExpansion

echo =========================================
echo   VSTHost Auto-Loader
echo =========================================

if "%~1"=="" (
    echo Error: No VST path specified!
    echo Usage: LoadVST.bat ^<VST_Path^> ^[VSTHost_Path^]
    exit /b 1
)

set "VSTPath=%~1"
if "%~2"=="" (
    set "VSTHostPath=%~dp0VSTHost.exe"
) else (
    set "VSTHostPath=%~2"
)

set "VSTHostDir=%~dp0"
set "IniPath=%VSTHostDir%VSTHost.ini"
set "BackupPath=%VSTHostDir%VSTHost.ini.backup"

echo VST: %VSTPath%
echo Host: %VSTHostPath%
echo.

echo [1/3] Backing up VSTHost.ini...
if exist "%IniPath%" (
    copy /Y "%IniPath%" "%BackupPath%" >nul
    echo   ✓ Backup created
)

echo [2/3] Creating VSTHost.ini...
(
echo [Main]
echo ShowSplash=0
echo StayOnTop=1
echo.
echo [Plugins]
echo Plugin1=%VSTPath%
) > "%IniPath%"
echo   ✓ INI created: %IniPath%

echo [3/3] Starting VSTHost...
start "" "%VSTHostPath%"

echo.
echo =========================================
echo   ✓ VSTHost Started!
echo =========================================
echo.
echo VSTHost should load: %VSTPath%
echo.
echo If VST UI doesn't appear:
echo   • Check VSTHost window (may be behind other windows)
echo   • Press Ctrl+Shift+P in VSTHost to manually load
echo.

timeout /t 3 /nobreak >nul
exit /b 0
