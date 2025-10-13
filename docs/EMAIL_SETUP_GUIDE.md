# 📧 Hướng dẫn cấu hình Email miễn phí cho SHRIMPTECH

Hệ thống đã được cập nhật để hỗ trợ nhiều nhà cung cấp email miễn phí. Chọn một trong các tùy chọn dưới đây:

## 🎯 Khuyến nghị: Brevo (Sendinblue)

**Ưu điểm:**
- ✅ 300 email/ngày miễn phí
- ✅ Không cần thẻ tín dụng
- ✅ Giao diện dễ sử dụng
- ✅ Tỷ lệ delivered cao

**Cách cấu hình:**

1. **Đăng ký tài khoản:**
   - Truy cập: https://www.brevo.com/
   - Đăng ký tài khoản miễn phí

2. **Lấy thông tin SMTP:**
   - Vào Dashboard → SMTP & API → SMTP
   - Copy: Login và Master password

3. **Cấu hình trong .env:**
   ```env
   BREVO_USER=your-brevo-smtp-login
   BREVO_PASS=your-brevo-smtp-password
   ```

## 🔄 Lựa chọn thay thế: Mailjet

**Ưu điểm:**
- ✅ 200 email/ngày miễn phí
- ✅ API mạnh mẽ
- ✅ Tracking tốt

**Cách cấu hình:**

1. **Đăng ký:** https://www.mailjet.com/
2. **Lấy API Key:** Account Settings → Master API Key & Sub API key
3. **Cấu hình:**
   ```env
   MAILJET_API_KEY=your-api-key
   MAILJET_SECRET_KEY=your-secret-key
   ```

## 🚀 Cho doanh nghiệp: Mailgun

**Ưu điểm:**
- ✅ 5,000 email/tháng đầu miễn phí
- ✅ Chuyên nghiệp
- ✅ Tính năng cao cấp

**Cách cấu hình:**

1. **Đăng ký:** https://www.mailgun.com/
2. **Tạo domain hoặc dùng sandbox**
3. **Lấy SMTP credentials:**
   ```env
   MAILGUN_SMTP_USER=postmaster@your-domain.mailgun.org
   MAILGUN_SMTP_PASS=your-password
   ```

## 🔒 Dự phòng: Gmail SMTP

**Lưu ý:** Chỉ dùng cho test, không khuyến khích cho production

**Cách cấu hình:**

1. **Bật 2FA cho Gmail**
2. **Tạo App Password:**
   - Google Account → Security → 2-Step Verification → App passwords
   - Chọn "Mail" và tạo password 16 ký tự

3. **Cấu hình:**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-password
   ```

## 🔧 Thiết lập

1. **Copy file cấu hình:**
   ```bash
   copy .env.example .env
   ```

2. **Chỉnh sửa .env với thông tin của bạn**

3. **Kiểm tra kết nối:**
   ```bash
   npm start
   ```

## 📝 Thứ tự ưu tiên

Hệ thống sẽ tự động chọn provider theo thứ tự:
1. Brevo (nếu có BREVO_USER và BREVO_PASS)
2. Mailjet (nếu có MAILJET_API_KEY và MAILJET_SECRET_KEY)
3. Mailgun (nếu có MAILGUN_SMTP_USER và MAILGUN_SMTP_PASS)
4. Gmail (fallback)

## 🐛 Troubleshooting

**Lỗi xác thực:**
- Kiểm tra lại username/password
- Đảm bảo API key đúng định dạng

**Lỗi rate limit:**
- Kiểm tra giới hạn email/ngày
- Chuyển sang provider khác

**Lỗi delivered:**
- Kiểm tra spam folder
- Xác thực domain nếu cần

## 📞 Hỗ trợ

Nếu gặp vấn đề, liên hệ:
- Email: shrimptech.vhu.hutech@gmail.com
- Phone: 0835749407
