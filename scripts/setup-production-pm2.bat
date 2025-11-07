@echo off
echo ============================================
echo   SETUP SHRIMPTECH PRODUCTION WITH PM2
echo ============================================
echo.

echo [1/4] Installing PM2 globally...
call npm install -g pm2
if %errorlevel% neq 0 (
    echo ❌ Failed to install PM2
    pause
    exit /b 1
)

echo.
echo [2/4] Installing PM2 Windows Service...
call npm install -g pm2-windows-service
if %errorlevel% neq 0 (
    echo ❌ Failed to install PM2 Windows Service
    pause
    exit /b 1
)

echo.
echo [3/4] Creating PM2 Windows Service...
call pm2-service-install -n PM2-ShrimpTech
if %errorlevel% neq 0 (
    echo ⚠️  Service might already exist or need admin rights
    echo    Run this script as Administrator!
)

echo.
echo [4/4] Starting ShrimpTech server with PM2...
cd /d "%~dp0.."
call pm2 start ecosystem.config.js
call pm2 save

echo.
echo ============================================
echo   ✅ PRODUCTION SETUP COMPLETE!
echo ============================================
echo.
echo Server will now:
echo   • Auto-start when Windows boots
echo   • Auto-restart if crashed
echo   • Run in background
echo.
echo Useful commands:
echo   pm2 status          - Check server status
echo   pm2 logs            - View logs
echo   pm2 restart all     - Restart server
echo   pm2 stop all        - Stop server
echo   pm2 monit           - Real-time monitoring
echo.
pause
