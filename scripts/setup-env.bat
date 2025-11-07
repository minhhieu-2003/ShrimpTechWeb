@echo off
REM ====================================
REM SHRIMPTECH - Environment Setup Script
REM ====================================

echo.
echo ====================================
echo   SHRIMPTECH Environment Setup
echo ====================================
echo.

REM Check if .env exists
if exist .env (
    echo [WARNING] .env file already exists!
    echo.
    set /p OVERWRITE="Do you want to overwrite it? (y/N): "
    if /i not "%OVERWRITE%"=="y" (
        echo Setup cancelled.
        goto :END
    )
)

REM Copy .env.example to .env
echo Copying .env.example to .env...
copy .env.example .env >nul

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Created .env file
    echo.
    echo ====================================
    echo   NEXT STEPS
    echo ====================================
    echo.
    echo 1. Open .env file and fill in your actual values
    echo 2. Get Gmail App Password:
    echo    - Visit: https://myaccount.google.com/security
    echo    - Enable 2-Step Verification
    echo    - Generate App Password for "Mail"
    echo 3. Replace values in .env:
    echo    - SMTP_USER=your-email@gmail.com
    echo    - SMTP_PASS=your-16-char-app-password
    echo 4. Run security check:
    echo    - node scripts/check-env-security.js
    echo.
    echo [IMPORTANT] NEVER commit .env file to GitHub!
    echo.
) else (
    echo [ERROR] Failed to create .env file
    echo Please copy .env.example to .env manually
)

:END
echo.
pause
