@echo off
echo 🦐 SHRIMPTECH Auto Email System Setup
echo =====================================
echo.

REM Set workspace directory
set WORKSPACE_DIR=%~dp0..

echo 📁 Workspace directory: %WORKSPACE_DIR%
echo.

echo 🔧 Setting up Auto Email System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available
echo.

REM Check if we're in Firebase project
if exist "%WORKSPACE_DIR%\firebase.json" (
    echo ✅ Firebase project detected
) else (
    echo ⚠️ Firebase configuration not found
    echo Auto email system will work without Firebase hosting
)
echo.

REM Test email system dependencies
echo 🧪 Testing email system dependencies...

REM Check if all required files exist
set "REQUIRED_FILES=public\js\auto-email-service.js public\js\email-fallback.js public\js\backend-handler.js config\email-templates.js tests\test-auto-email-system.html"

for %%f in (%REQUIRED_FILES%) do (
    if exist "%WORKSPACE_DIR%\%%f" (
        echo ✅ %%f
    ) else (
        echo ❌ Missing: %%f
        set "MISSING_FILES=true"
    )
)

if defined MISSING_FILES (
    echo.
    echo ❌ Some required files are missing!
    echo Please ensure all auto email system files are present.
    pause
    exit /b 1
)

echo.
echo ✅ All required files are present
echo.

REM Test server if available
echo 🧪 Testing email server...
cd /d "%WORKSPACE_DIR%"

REM Check if server.js exists
if exist "server.js" (
    echo ✅ Email server found
    
    REM Install dependencies if package.json exists
    if exist "package.json" (
        echo 📦 Installing server dependencies...
        call npm install
        if errorlevel 1 (
            echo ⚠️ Failed to install dependencies, but continuing...
        ) else (
            echo ✅ Dependencies installed
        )
    )
    
    REM Try to start server in background for testing
    echo 🚀 Starting server for testing...
    start /b cmd /c "node server.js > server_test.log 2>&1"
    
    REM Wait a moment for server to start
    timeout /t 3 /nobreak >nul
    
    REM Test server connectivity
    curl -s http://localhost:3001/status >nul 2>&1
    if errorlevel 1 (
        echo ⚠️ Server test failed, but auto email system can work independently
    ) else (
        echo ✅ Server is working
    )
    
    REM Stop test server
    taskkill /f /im node.exe >nul 2>&1
    
) else (
    echo ⚠️ No email server found, using client-side only mode
)

echo.
echo 🌐 Testing web access...

REM Open test page in default browser
set "TEST_PAGE=%WORKSPACE_DIR%\tests\test-auto-email-system.html"
if exist "%TEST_PAGE%" (
    echo 🚀 Opening auto email test page...
    start "" "%TEST_PAGE%"
    echo.
    echo 📋 Test Instructions:
    echo 1. The test page should open in your browser
    echo 2. Check if all services are initialized (green checkmarks)
    echo 3. Try the test form with your real email
    echo 4. Verify you receive confirmation email
    echo 5. Check console output for any errors
    echo.
) else (
    echo ❌ Test page not found
)

REM Firebase deployment option
echo 🔥 Firebase Deployment Options:
echo.
if exist "%WORKSPACE_DIR%\firebase.json" (
    echo To deploy to Firebase:
    echo   firebase serve          # Test locally
    echo   firebase deploy         # Deploy to production
    echo.
    echo Firebase project: %WORKSPACE_DIR%
) else (
    echo To initialize Firebase:
    echo   firebase init hosting
    echo   firebase serve
    echo   firebase deploy
)

echo.
echo 📖 Documentation:
echo   docs\AUTO_EMAIL_SYSTEM.md     # Complete documentation
echo   tests\test-auto-email-system.html  # Interactive testing
echo.

echo 🎯 Quick Start:
echo 1. Open test page to verify functionality
echo 2. Check email templates in config\email-templates.js
echo 3. Configure SMTP settings if needed
echo 4. Deploy to Firebase or your web server
echo.

echo ✅ Auto Email System setup completed!
echo.
echo 📞 Support:
echo   Email: shrimptech.vhu.hutech@gmail.com
echo   Hotline: 0835749407 ^| 0826529739
echo.

pause
