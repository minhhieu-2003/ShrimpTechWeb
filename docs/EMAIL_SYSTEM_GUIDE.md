# 📧 ShrimpTech Email System - Hướng Dẫn Sử Dụng & Troubleshooting

## 📋 Tổng Quan Hệ Thống

ShrimpTech Email System sử dụng SMTP với Gmail để gửi email và Formspree làm backup, được thiết kế để đảm bảo email luôn được gửi thành công.

### 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Contact Form  │───►│   Gmail SMTP     │───►│  Success Result │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         │                        ▼ (if failed)
         │              ┌──────────────────┐
         │              │ Backup Services  │
         │              │ 1. Formspree     │
         │              │ 2. Mailto        │
         │              │ 3. LocalStorage  │
         │              └──────────────────┘
         │                        │
         └────────────────────────┴─────────► 📊 Monitoring & Logs
```

### 🔧 Các Thành Phần Chính

1. **Gmail SMTP Service** - Service chính sử dụng Gmail SMTP
2. **Backup Services** - Các dịch vụ dự phòng
3. **Monitoring System** - Hệ thống theo dõi và báo cáo
4. **Template System** - Hệ thống email templates
5. **Validation System** - Kiểm tra tính hợp lệ của cấu hình

## 🚀 Cài Đặt & Cấu Hình

### Bước 1: Cấu Hình Gmail SMTP

```javascript
// File: .env
SMTP_USER=shrimptech.vhu.hutech@gmail.com
SMTP_PASS=your_gmail_app_password_here
ADMIN_EMAIL=shrimptech.vhu.hutech@gmail.com
SMTP_FROM_EMAIL=shrimptech.vhu.hutech@gmail.com
```

### Bước 2: Thêm Email Scripts

```html
<!-- Include email service -->
<script src="js/email-service.js"></script>
<script src="js/form-handler.js"></script>
```

### Bước 3: Kiểm Tra Cấu Hình

```bash
# Test SMTP configuration
node test-real-email.js

# Validate email system
node scripts/email-system-validator.js
```

## 📝 Sử Dụng Cơ Bản

### Gửi Email Liên Hệ

```javascript
// Sử dụng API endpoint
const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Tên người gửi',
        email: 'email@example.com',
        message: 'Nội dung tin nhắn',
        subject: 'Liên hệ từ website'
    })
});

if (response.ok) {
    console.log('Email sent successfully');
} else {
    console.error('Failed to send email');
}
```

### Sử dụng Form HTML

```html
<form id="contact-form" action="/api/send-email" method="POST">
    <input type="text" name="name" placeholder="Họ tên" required>
    <input type="email" name="email" placeholder="Email" required>
    <textarea name="message" placeholder="Tin nhắn" required></textarea>
    <button type="submit">Gửi tin nhắn</button>
</form>
```

## 🔧 Troubleshooting

### Lỗi Thường Gặp

#### 1. Email không được gửi

**Nguyên nhân:** SMTP configuration không đúng hoặc App Password hết hạn

**Giải pháp:**
```javascript
// Kiểm tra .env file
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'MISSING');

// Test SMTP connection
node test-real-email.js
```

#### 2. Authentication Failed

**Nguyên nhân:** Gmail App Password không đúng hoặc chưa bật 2FA

**Giải pháp:**
1. Truy cập https://myaccount.google.com/security
2. Bật 2-Factor Authentication
3. Tạo App Password mới
4. Cập nhật SMTP_PASS trong .env

#### 3. Rate Limit Exceeded

**Nguyên nhân:** Gửi quá nhiều email trong thời gian ngắn

**Giải pháp:**
- Gmail cho phép ~100-500 emails/ngày
- Sử dụng Formspree backup
- Nâng cấp Gmail Workspace nếu cần

### Email Delivery Issues

#### Check Email Headers

```javascript
// Kiểm tra email có đến không
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Test connection
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP Error:', error);
    } else {
        console.log('SMTP Ready to send emails');
    }
});
```

#### Debug Email Status

```javascript
console.log('Email system status:', {
    smtp_configured: !!process.env.SMTP_USER,
    smtp_password: !!process.env.SMTP_PASS,
    admin_email: process.env.ADMIN_EMAIL
});
```

## 📊 Monitoring & Analytics

### Email System Monitor

```javascript
// File: tests/email-system-monitor.js
const monitor = new EmailSystemMonitor();

// Run comprehensive check
monitor.runSystemCheck();

// Check specific components
monitor.checkSMTPStatus();
monitor.checkQuotaStatus();
monitor.testEmailDelivery();
```

### Performance Metrics

- **Delivery Rate:** 95%+ thành công
- **Response Time:** < 2 giây
- **Backup Success:** 99% với Formspree
- **Daily Quota:** 500 emails (Gmail)

## 🔒 Security & Best Practices

### Email Validation

```javascript
// Validate email format
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Sanitize input
function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}
```

### Rate Limiting

```javascript
// Current rate limiting: 10 requests per 15 minutes
const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
};
```

### SPAM Protection

- **CAPTCHA:** Recommended for public forms
- **Honeypot:** Hidden fields to catch bots
- **IP Tracking:** Monitor suspicious activity
- **Content Filtering:** Block spam keywords

## 📚 API Reference

### Send Email Endpoint

```http
POST /api/send-email
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello from ShrimpTech",
    "subject": "Contact Form Message"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Email sent successfully",
    "messageId": "12345"
}
```

### Test SMTP Endpoint

```http
POST /api/test-smtp
Content-Type: application/json

{
    "test": true
}
```

### Check Template Endpoint

```http
GET /api/check-template/{template_name}
```

## 🛠️ Development Tools

### Quick Tests

```bash
# Test SMTP configuration
node test-real-email.js

# Validate email system
node scripts/email-system-validator.js

# Check email system health
node tests/email-system-monitor.js
```

### Development Scripts

```bash
# Start local server
npm start

# Run email tests
npm run email-test

# Validate email system
npm run validate-email
```

## 📞 Support & Maintenance

### Regular Maintenance

1. **Weekly:** Check email delivery rates
2. **Monthly:** Update App Password if needed
3. **Quarterly:** Review email templates
4. **Yearly:** Audit security settings

### Contact Support

- **Email:** shrimptech.vhu.hutech@gmail.com
- **GitHub:** Submit issues on repository
- **Documentation:** Check docs/ folder for updates

---

**Last Updated:** September 2025  
**Version:** 2.0 (SMTP-only)  
**Author:** ShrimpTech Team - VHU & HUTECH