@echo off
echo 🦐 SHRIMPTECH Email System Startup
echo ====================================

echo.
echo 📋 Checking system requirements...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if we're in the correct directory
if not exist "public\api\package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Navigate to API directory
cd public\api

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found
    echo 📝 Creating .env from template...
    copy .env.example .env
    echo.
    echo ⚡ IMPORTANT: Please edit .env file with your email credentials:
    echo    - SMTP_USER: Your Gmail address
    echo    - SMTP_PASS: Your Gmail App Password
    echo.
    echo 📖 Instructions:
    echo    1. Enable 2-Factor Authentication on Gmail
    echo    2. Generate App Password: https://myaccount.google.com/apppasswords
    echo    3. Update SMTP_PASS in .env file
    echo.
    notepad .env
    echo.
    echo Press any key after you've configured the .env file...
    pause >nul
)

echo.
echo 🧪 Testing email system...
node test-email.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Email test failed. Please check your configuration.
    echo 🔧 Common issues:
    echo    - Wrong App Password in .env
    echo    - 2FA not enabled on Gmail
    echo    - Incorrect email address
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Starting SHRIMPTECH Email API Server...
echo 🌐 Server will run on http://localhost:3001
echo 📧 Ready to handle contact forms and newsletters
echo.
echo Press Ctrl+C to stop the server
echo ====================================
echo.

npm start
