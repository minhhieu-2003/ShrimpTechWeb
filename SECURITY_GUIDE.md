# 🔒 Hướng Dẫn Bảo Mật - SHRIMPTECH

## 📋 Mục Lục
- [Thiết lập Environment Variables](#thiết-lập-environment-variables)
- [Sử dụng .env File](#sử-dụng-env-file)
- [Kiểm tra Bảo mật](#kiểm-tra-bảo-mật)
- [Push Code An Toàn](#push-code-an-toàn)
- [Best Practices](#best-practices)

---

## 🔐 Thiết lập Environment Variables

### Bước 1: Tạo file .env

```bash
# Copy file template
cp .env.example .env
```

### Bước 2: Điền thông tin vào .env

Mở file `.env` và điền thông tin thật:

```env
# GMAIL SMTP CONFIGURATION
SMTP_USER=shrimptech.vhu.hutech@gmail.com
SMTP_PASS=aewb xgdn jlfv alcc
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# ADMIN EMAIL
ADMIN_EMAIL=shrimptech.vhu.hutech@gmail.com

# SERVER CONFIG
NODE_ENV=production
PORT=3001
```

### Bước 3: Lấy App Password từ Gmail

1. Truy cập: https://myaccount.google.com/security
2. Bật **2-Step Verification** (xác thực 2 bước)
3. Vào **App passwords** (Mật khẩu ứng dụng)
4. Chọn **Mail** và **Other (Custom name)**
5. Nhập tên: "SHRIMPTECH"
6. Copy mật khẩu 16 ký tự và paste vào `SMTP_PASS`

---

## 📁 Sử dụng .env File

### Trong Server Code

```javascript
// Load environment variables
require('dotenv').config();

// Hoặc dùng env-loader
const { config } = require('./config/env-loader');

// Sử dụng
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
```

### Trong API Files

```javascript
// api/contact.js
require('dotenv').config();

const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
```

### ❌ KHÔNG BAO GIỜ làm như này:

```javascript
// WRONG - Hardcoded credentials
const emailConfig = {
    auth: {
        user: 'shrimptech.vhu.hutech@gmail.com',
        pass: 'aewb xgdn jlfv alcc'  // ❌ NGUY HIỂM!
    }
};
```

---

## 🔍 Kiểm tra Bảo mật

### Chạy Security Check

```bash
# Kiểm tra toàn bộ dự án
node scripts/check-env-security.js
```

Output mẫu:
```
🔒 SHRIMPTECH Security Checker - Environment Variables

📝 Checking files for hardcoded credentials...
📝 Checking .gitignore configuration...
✅ .gitignore is properly configured
📝 Checking .env files...
✅ .env file exists
✅ .env.example template exists

============================================================
SECURITY CHECK RESULTS
============================================================

✅ No security issues found!
✨ Your code is safe to push to GitHub
```

### Kiểm tra Manual

Trước khi push, kiểm tra:

1. ✅ File `.env` có trong `.gitignore`
2. ✅ File `.env` KHÔNG có trong git staging
3. ✅ Không có mật khẩu hardcoded trong code
4. ✅ File `.env.example` chỉ có giá trị mẫu

```bash
# Kiểm tra files sẽ được push
git status

# Kiểm tra nội dung sẽ push
git diff --cached

# Tìm các file .env
git ls-files | grep .env
# Chỉ nên thấy .env.example, KHÔNG có .env
```

---

## 🚀 Push Code An Toàn

### Quy trình Push chuẩn

```bash
# 1. Kiểm tra bảo mật
node scripts/check-env-security.js

# 2. Kiểm tra git status
git status

# 3. Add files (KHÔNG add .env)
git add .

# 4. Kiểm tra lại files staged
git status

# 5. Commit
git commit -m "feat: update email system with secure env variables"

# 6. Push
git push origin main
```

### ⚠️ Nếu đã commit .env nhầm

```bash
# Xóa .env khỏi git cache (giữ file local)
git rm --cached .env

# Commit lại
git commit -m "fix: remove .env from git tracking"

# Push
git push origin main
```

### 🆘 Nếu đã push .env lên GitHub

**NGUY HIỂM! Cần xử lý ngay:**

1. **Thay đổi tất cả mật khẩu:**
   - Gmail App Password
   - Tất cả API keys, tokens

2. **Xóa .env khỏi git history:**
```bash
# Sử dụng BFG Repo-Cleaner
java -jar bfg.jar --delete-files .env

git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

3. **Hoặc tạo repo mới:**
   - Tạo repo mới trên GitHub
   - Copy code (KHÔNG copy .git folder)
   - Push lên repo mới

---

## ✅ Best Practices

### 1. Quản lý Environment Variables

```
✅ DO:
- Dùng .env cho local development
- Dùng platform environment cho production (Vercel, Railway, etc.)
- Có .env.example template
- Validate env variables khi start server

❌ DON'T:
- Commit .env file
- Hardcode credentials
- Share .env qua email/chat
- Dùng cùng credentials cho dev và prod
```

### 2. Structure Files

```
project/
├── .env                 # ❌ Git ignored - Local only
├── .env.example         # ✅ Committed - Template only
├── .gitignore           # ✅ Must include .env
├── config/
│   └── env-loader.js    # ✅ Load & validate env vars
├── server.js            # ✅ Use process.env.*
└── api/
    └── contact.js       # ✅ Use process.env.*
```

### 3. .gitignore Configuration

Đảm bảo `.gitignore` có:

```gitignore
# Environment variables - CRITICAL
.env
.env.*
*.env
!.env.example

# Never commit these
node_modules/
npm-debug.log*
deployment-report.json
fly.toml
```

### 4. Production Deployment

**Vercel:**
```bash
# Set env variables in Vercel dashboard
Settings → Environment Variables
```

**Railway:**
```bash
# Set in Railway dashboard
Variables tab
```

**PM2 Ecosystem:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    env: {
      NODE_ENV: 'production',
      // DO NOT put sensitive data here
      // Use .env file instead
    }
  }]
};
```

### 5. Security Checklist

Trước mỗi lần push:

- [ ] Chạy `node scripts/check-env-security.js`
- [ ] Kiểm tra `git status` không có .env
- [ ] Review code changes
- [ ] Test locally với .env
- [ ] Đảm bảo .env.example updated
- [ ] Không có hardcoded credentials

---

## 🛠️ Tools và Scripts

### Available Scripts

```bash
# Security check
npm run security-check
# hoặc
node scripts/check-env-security.js

# Test email với env
node tests/check-all-email-servers.js

# Validate environment
node config/env-loader.js
```

### Pre-commit Hook (Optional)

Tạo `.git/hooks/pre-commit`:

```bash
#!/bin/sh

echo "🔍 Running security check..."

# Run security check
node scripts/check-env-security.js

if [ $? -ne 0 ]; then
    echo "❌ Security check failed! Commit aborted."
    exit 1
fi

# Check if .env is staged
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "❌ Error: .env file is staged! Commit aborted."
    exit 1
fi

echo "✅ Security check passed!"
exit 0
```

```bash
# Make it executable
chmod +x .git/hooks/pre-commit
```

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Đọc kỹ error messages
2. Kiểm tra `.env` file format
3. Verify Gmail App Password
4. Test với `node tests/check-all-email-servers.js`

---

## 📚 Tài Liệu Tham Khảo

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**⚠️ QUAN TRỌNG:** KHÔNG BAO GIỜ share file `.env` qua bất kỳ kênh nào!

**Made with 🦐 by SHRIMPTECH Team**
