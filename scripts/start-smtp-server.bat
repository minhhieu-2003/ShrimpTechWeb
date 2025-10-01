@echo off
echo ==========================================
echo  SHRIMPTECH SMTP EMAIL SYSTEM
echo ==========================================
echo.
echo Starting SMTP-only email server...
echo Railway deployment removed - using local SMTP only
echo.

cd /d "%~dp0\.."

echo Checking environment variables...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file with SMTP configuration
    pause
    exit /b 1
)

echo Starting Node.js server with SMTP configuration...
node server.js

pause
