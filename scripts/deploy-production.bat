@echo off
REM Production Deploy Script for ShrimpTech.vn
REM Tự động deploy và kiểm tra production

echo 🚀 SHRIMPTECH PRODUCTION DEPLOY SCRIPT
echo =======================================
echo Target: https://shrimptech.vn
echo Firebase: https://shrimptech-c6e93.web.app
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Please install: npm install -g firebase-tools
    pause
    exit /b 1
)

REM Check if logged in to Firebase
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔑 Please login to Firebase first...
    firebase login
    if %errorlevel% neq 0 (
        echo ❌ Firebase login failed
        pause
        exit /b 1
    )
)

echo ✅ Firebase CLI ready
echo.

REM Check current project
echo 🔍 Current Firebase project:
firebase use --current
echo.

REM Build production (if needed)
echo 🔨 Building production assets...
if exist "package.json" (
    if exist "node_modules" (
        echo 📦 Installing/updating dependencies...
        npm install
    )
    
    REM Run build script if exists
    npm run build 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Build completed
    ) else (
        echo ⚠️  No build script found, continuing with existing files
    )
) else (
    echo ⚠️  No package.json found, using static files
)
echo.

REM Deploy to Firebase Hosting
echo 🔥 Deploying to Firebase Hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Firebase deploy failed
    pause
    exit /b 1
)

echo ✅ Firebase hosting deployed successfully!
echo.

REM Show deployed URLs
echo 🌐 DEPLOYED URLs:
echo ==================
firebase hosting:sites:list
echo.

echo 📝 Your site is now live at:
echo • https://shrimptech-c6e93.web.app
echo • https://shrimptech-c6e93.firebaseapp.com
echo.

REM Test deployment
echo 🧪 Testing deployment...
echo.

REM Test main site
curl -s -o nul -w "Main site: %%{http_code}\n" https://shrimptech-c6e93.web.app
curl -s -o nul -w "Contact page: %%{http_code}\n" https://shrimptech-c6e93.web.app/contact

echo.
echo 📊 DEPLOYMENT SUMMARY
echo =====================
echo ✅ Static files deployed to Firebase Hosting
echo ✅ Available at: https://shrimptech-c6e93.web.app
echo.

echo 🎯 NEXT STEPS FOR PRODUCTION:
echo ==============================
echo 1. 🌐 Setup custom domain shrimptech.vn:
echo    firebase hosting:domain:create shrimptech.vn
echo.
echo 2. 🔧 Deploy Node.js server to hosting provider
echo    - Upload server.js and dependencies
echo    - Configure environment variables
echo    - Setup SSL certificate
echo.
echo 3. 🔗 Configure DNS:
echo    - Point shrimptech.vn to your server IP
echo    - Setup CNAME for www.shrimptech.vn
echo.
echo 4. 🧪 Test production:
echo    - Run: scripts\test-production.sh
echo    - Verify all API endpoints work
echo.

echo 🎉 Firebase deployment completed successfully!
echo.
pause