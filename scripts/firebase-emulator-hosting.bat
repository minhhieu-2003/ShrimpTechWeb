@echo off
echo ========================================
echo  SHRIMPTECH Firebase Hosting Emulator
echo  (Free tier - Hosting only)
echo ========================================
echo.

echo 🔧 Starting Firebase Hosting emulator...
echo 📧 Email API will use external Node.js server
echo.
echo 🌐 Hosting will be available at: http://localhost:5000
echo 📱 Admin UI will be available at: http://localhost:4000
echo.
echo ⚡ To stop: Press Ctrl+C
echo.

call firebase emulators:start --only hosting

pause
