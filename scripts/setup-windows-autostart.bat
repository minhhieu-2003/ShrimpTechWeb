@echo off
echo ============================================
echo   SETUP SHRIMPTECH AUTO-START ON BOOT
echo   (Using Windows Task Scheduler)
echo ============================================
echo.

set "SCRIPT_DIR=%~dp0.."
set "NODE_PATH=%ProgramFiles%\nodejs\node.exe"
set "SERVER_PATH=%SCRIPT_DIR%\server.js"

echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found in PATH
    echo    Please install Node.js first
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('where node') do set "NODE_PATH=%%i"
echo ✅ Node.js found: %NODE_PATH%
echo.

echo Creating Windows scheduled task...
echo This requires Administrator privileges!
echo.

schtasks /create /tn "ShrimpTech Email Server" ^
    /tr "\"%NODE_PATH%\" \"%SERVER_PATH%\"" ^
    /sc onstart ^
    /ru SYSTEM ^
    /rl HIGHEST ^
    /f

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo   ✅ TASK CREATED SUCCESSFULLY!
    echo ============================================
    echo.
    echo The server will now auto-start when Windows boots.
    echo.
    echo To start it now, run:
    echo   schtasks /run /tn "ShrimpTech Email Server"
    echo.
    echo To stop it:
    echo   taskkill /F /IM node.exe
    echo.
    echo To remove auto-start:
    echo   schtasks /delete /tn "ShrimpTech Email Server" /f
    echo.
) else (
    echo.
    echo ❌ Failed to create task
    echo    Please run this script as Administrator!
    echo.
)

pause
