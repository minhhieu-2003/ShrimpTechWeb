@echo off
title ShrimpTech Email System Tests
color 0A

echo ========================================
echo    SHRIMPTECH EMAIL SYSTEM TESTS
echo ========================================
echo.

:menu
echo Choose a test to run:
echo.
echo 1. Validate EmailJS Keys
echo 2. Test Real Email Sending
echo 3. Open Web Test Interface
echo 4. Run Full Validation Suite
echo 5. Exit
echo.
set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto validate_keys
if "%choice%"=="2" goto test_email
if "%choice%"=="3" goto open_web
if "%choice%"=="4" goto full_suite
if "%choice%"=="5" goto exit
goto invalid

:validate_keys
echo.
echo Running EmailJS Keys Validation...
echo =====================================
node scripts/validate-emailjs-keys.js
echo.
pause
goto menu

:test_email
echo.
echo Starting Email Test Server...
echo =============================
echo Opening web interface for email testing...
start http://localhost:8000/tests/test-real-email.html
echo.
echo Server running at http://localhost:8000
echo Press Ctrl+C to stop the server when done testing.
echo.
python -m http.server 8000
goto menu

:open_web
echo.
echo Opening Web Test Interface...
echo =============================
start http://localhost:8000/tests/test-emailjs-keys.html
start http://localhost:8000/tests/test-real-email.html
echo.
echo Test interfaces opened in browser.
echo.
pause
goto menu

:full_suite
echo.
echo Running Full Validation Suite...
echo =================================
echo.
echo Step 1: Validating EmailJS Keys...
node scripts/validate-emailjs-keys.js
echo.
echo Step 2: Opening test interfaces...
start http://localhost:8000/tests/test-emailjs-keys.html
start http://localhost:8000/tests/test-real-email.html
echo.
echo Step 3: Starting development server...
echo Server will run at http://localhost:8000
echo Use the web interfaces to test email functionality.
echo.
python -m http.server 8000
goto menu

:invalid
echo.
echo Invalid choice. Please enter 1-5.
echo.
pause
goto menu

:exit
echo.
echo Thanks for using ShrimpTech Email System Tests!
echo.
pause
exit