# 🔧 Firebase Configuration Update

## ⚠️ Vấn đề đã giải quyết

**Vấn đề cũ:** Firebase project cần nâng cấp lên Blaze plan để sử dụng Cloud Functions.

**Giải pháp:** Sử dụng Firebase Hosting (miễn phí) + Node.js server external cho email.

## 🆕 Cấu hình mới

### 1. Firebase Hosting (Miễn phí)
- ✅ Host static files (HTML, CSS, JS)
- ✅ Không cần Blaze plan
- ✅ URL: https://shrimptech-c6e93.web.app

### 2. Node.js Server (Railway)
- ✅ Xử lý API email
- ✅ URL: https://shrimptechshrimptech-production.up.railway.app
- ✅ Endpoints: /api/contact, /api/newsletter

## 📁 Files đã thay đổi

### `firebase.json`
```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `public/js/email-service.js`
- Cập nhật endpoints để dùng Railway server
- Loại bỏ Firebase Functions URLs

## 🚀 Deployment mới

### Deploy Hosting only
```bash
# Tự động
npm run firebase:deploy

# Hoặc manual
firebase deploy --only hosting
```

### Chạy emulator
```bash
# Hosting only
npm run firebase:emulator

# Hoặc 
firebase emulators:start --only hosting
```

## 🔗 URLs

### Production
- **Website:** https://shrimptech-c6e93.web.app
- **API Server:** https://shrimptechshrimptech-production.up.railway.app
- **Admin:** https://console.firebase.google.com/project/shrimptech-c6e93

### Development
- **Local Website:** http://localhost:5000 (Firebase emulator)
- **Local API:** http://localhost:3001 (Node.js server)

## ✅ Ưu điểm của cấu hình mới

1. **Miễn phí hoàn toàn:** Không cần Blaze plan
2. **Đơn giản:** Ít dependency
3. **Linh hoạt:** API server độc lập
4. **Stable:** Firebase Hosting rất ổn định

## 📝 Lưu ý

- Firebase Hosting chỉ serve static files
- Email API chạy trên Railway server riêng biệt
- Cần đảm bảo Railway server luôn chạy
- CORS đã được cấu hình để allow cross-origin requests

## 🔧 Troubleshooting

### Lỗi 404 khi gọi API
**Nguyên nhân:** API endpoint không đúng
**Giải pháp:** Kiểm tra `email-service.js` và Railway server status

### Lỗi CORS
**Nguyên nhân:** Railway server chưa allow domain
**Giải pháp:** Cập nhật CORS trong `server.js`

### Website không load
**Nguyên nhân:** Firebase deployment failed
**Giải pháp:** 
```bash
firebase login
firebase deploy --only hosting
```
