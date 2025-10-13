# 📧 SHRIMPTECH Email System v3.0

Hệ thống email tự động cho form liên hệ và newsletter, hỗ trợ nhiều nhà cung cấp email miễn phí.

## 🎯 Tính năng

- ✅ Hỗ trợ 4 nhà cung cấp email miễn phí
- ✅ Tự động fallback khi provider chính gặp lỗi
- ✅ Email HTML đẹp với responsive design
- ✅ Gửi email xác nhận cho khách hàng
- ✅ Rate limiting và bảo mật
- ✅ Logging chi tiết
- ✅ Test suite hoàn chình

## 🚀 Cài đặt nhanh

1. **Copy file cấu hình:**
   ```bash
   copy .env.example .env
   ```

2. **Chọn một email provider và cấu hình .env:**
   
   **Brevo (Khuyến nghị):**
   ```env
   BREVO_USER=your-brevo-login
   BREVO_PASS=your-brevo-password
   ```
   
   **Mailjet:**
   ```env
   MAILJET_API_KEY=your-api-key
   MAILJET_SECRET_KEY=your-secret-key
   ```

3. **Test cấu hình:**
   ```bash
   npm run test:email
   ```

4. **Khởi động server:**
   ```bash
   npm start
   ```

## 📊 So sánh các provider

| Provider | Miễn phí/ngày | Ưu điểm | Đăng ký |
|----------|---------------|---------|---------|
| **Brevo** | 300 emails | Dễ dùng, không cần thẻ | [Link](https://brevo.com) |
| **Mailjet** | 200 emails | API mạnh, tracking tốt | [Link](https://mailjet.com) |
| **Mailgun** | 5000/tháng | Chuyên nghiệp, tính năng cao | [Link](https://mailgun.com) |
| **Gmail** | 100-500 | Dự phòng, cần App Password | - |

## 🔧 Scripts

```bash
# Test cấu hình email
npm run test:email

# Xem cấu hình hiện tại
npm run test:email:quick

# Khởi động server
npm start

# Test email cơ bản
npm test
```

## 📝 API Endpoints

### POST /api/contact
Gửi email từ form liên hệ.

**Request:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "test@example.com", 
  "phone": "0123456789",
  "company": "Công ty ABC",
  "farmType": "pond-medium",
  "subject": "product-info",
  "message": "Tôi muốn tìm hiểu về sản phẩm...",
  "newsletter": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.",
  "details": {
    "messageId": "<email-id@provider.com>",
    "confirmationSent": true,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/newsletter
Đăng ký newsletter.

**Request:**
```json
{
  "email": "user@example.com"
}
```

## 🎨 Email Templates

### Contact Email (Gửi cho admin)
- Header với logo SHRIMPTECH
- Thông tin khách hàng dạng bảng
- Nút hành động (Reply Email, Call Phone)
- Footer với timestamp và IP

### Confirmation Email (Gửi cho khách hàng)
- Xác nhận đã nhận thông tin
- Thông tin liên hệ khẩn cấp
- Link trở về website

### Newsletter Email
- Thông báo đăng ký newsletter mới
- Thông tin subscriber

## 🔒 Bảo mật

- Rate limiting: 10 requests/15 phút
- CORS configuration
- Input validation
- Email format validation
- XSS protection trong templates

## 🐛 Troubleshooting

### Lỗi SMTP Authentication
```
❌ Free Email SMTP Connection Error: Invalid login
```
**Giải pháp:**
- Kiểm tra username/password trong .env
- Đảm bảo provider được cấu hình đúng

### Lỗi Rate Limit
```
❌ Too many requests from this IP
```
**Giải pháp:**
- Đợi 15 phút trước khi thử lại
- Liên hệ admin để tăng limit

### Email không đến
**Kiểm tra:**
1. Spam folder
2. Email provider limits
3. Server logs
4. DNS configuration (cho Mailgun)

## 📞 Hỗ trợ

- **Email:** shrimptech.vhu.hutech@gmail.com
- **Hotline:** 0835749407 | 0826529739
- **Website:** https://shrimptech.vn

## 📄 Files quan trọng

- `config/free-email-config.js` - Cấu hình email providers
- `server.js` - Main server với API endpoints  
- `tests/test-email-config.js` - Test suite
- `docs/EMAIL_SETUP_GUIDE.md` - Hướng dẫn chi tiết
- `.env.example` - Template cấu hình
