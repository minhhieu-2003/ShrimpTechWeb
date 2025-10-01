@echo off
echo ========================================
echo  SHRIMPTECH Firebase Hosting Deploy
echo  (Free tier - Hosting only)
echo ========================================
echo.

echo 📦 Building project...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Deploying to Firebase Hosting only...
echo (No Functions - using external Node.js server)
call firebase deploy --only hosting

if errorlevel 1 (
    echo.
    echo ❌ Firebase deployment failed!
    echo.
    echo 💡 Possible solutions:
    echo 1. Check internet connection
    echo 2. Run: firebase login
    echo 3. Check project ID in .firebaserc
    echo 4. Make sure you have access to the project
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ Firebase Hosting deployed successfully!
    echo.
    echo 🌐 Your website is available at:
    echo    https://shrimptech-c6e93.web.app
    echo    https://shrimptech-c6e93.firebaseapp.com
    echo.
    echo 📧 Email API runs on external Node.js server:
    echo    https://shrimptechshrimptech-production.up.railway.app
    echo.
    echo 📝 Next steps:
    echo 1. Test the website
    echo 2. Test contact form
    echo 3. Update DNS if needed
    echo.
)

pause
