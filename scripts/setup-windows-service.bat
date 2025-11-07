@echo off
echo ============================================
echo   SETUP PM2 AS WINDOWS SERVICE
echo   (Run as Administrator!)
echo ============================================
echo.

echo [1/2] Installing pm2-windows-service...
call npm install -g pm2-windows-service
if %errorlevel% neq 0 (
    echo ❌ Failed to install pm2-windows-service
    pause
    exit /b 1
)

echo.
echo [2/2] Installing PM2 service...
echo.
echo ⚠️  This will open a configuration wizard.
echo     Please configure:
echo     - Service name: PM2-ShrimpTech
echo     - Startup type: Automatic
echo     - Account: Local System
echo.
pause

call pm2-service-install -n PM2-ShrimpTech

echo.
echo ============================================
echo   ✅ SERVICE INSTALLED!
echo ============================================
echo.
echo To manage the service:
echo   - Open Services: services.msc
echo   - Find: PM2-ShrimpTech
echo   - Right-click to Start/Stop/Restart
echo.
echo The service will auto-start on Windows boot!
echo.
pause
