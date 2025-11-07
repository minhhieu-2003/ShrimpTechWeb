#!/bin/bash

# ====================================
# SHRIMPTECH - Environment Setup Script
# ====================================

echo ""
echo "===================================="
echo "  SHRIMPTECH Environment Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "[WARNING] .env file already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " OVERWRITE
    if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
echo "Copying .env.example to .env..."
cp .env.example .env

if [ $? -eq 0 ]; then
    echo "[SUCCESS] Created .env file"
    echo ""
    echo "===================================="
    echo "  NEXT STEPS"
    echo "===================================="
    echo ""
    echo "1. Open .env file and fill in your actual values"
    echo "2. Get Gmail App Password:"
    echo "   - Visit: https://myaccount.google.com/security"
    echo "   - Enable 2-Step Verification"
    echo "   - Generate App Password for 'Mail'"
    echo "3. Replace values in .env:"
    echo "   - SMTP_USER=your-email@gmail.com"
    echo "   - SMTP_PASS=your-16-char-app-password"
    echo "4. Run security check:"
    echo "   - npm run security-check"
    echo ""
    echo "[IMPORTANT] NEVER commit .env file to GitHub!"
    echo ""
else
    echo "[ERROR] Failed to create .env file"
    echo "Please copy .env.example to .env manually"
    exit 1
fi
