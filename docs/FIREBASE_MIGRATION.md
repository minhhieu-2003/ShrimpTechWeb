# ShrimpTech Firebase Migration Guide

## Chuyển đổi từ Railway sang Firebase

### 1. Tổng quan thay đổi

**Trước (Railway):**
- API endpoint: `https://shrimptechshrimptech-production.up.railway.app/api`
- Node.js Express server
- Hosting riêng biệt

**Sau (Firebase):**
- Firebase Functions: `https://us-central1-shrimptech-web.cloudfunctions.net/`
- Firebase Hosting: `https://shrimptech-web.web.app`
- Tích hợp hoàn toàn với Firebase ecosystem

### 2. Những file đã được cập nhật

#### 2.1 Cấu hình Firebase
- `firebase.json` - Cấu hình hosting và functions với rewrites
- `functions/index.js` - Firebase Functions cho email service
- `functions/package.json` - Dependencies cho Firebase Functions

#### 2.2 Frontend JavaScript
- `public/js/email-service.js` - Cập nhật endpoints sang Firebase
- `public/js/backend-handler.js` - Tối ưu cho Firebase Functions

#### 2.3 Scripts triển khai
- `scripts/firebase-deploy.bat` - Deploy lên Firebase
- `scripts/firebase-emulator.bat` - Test local với emulator

### 3. Cách sử dụng

#### 3.1 Development (Local Testing)
```bash
# Khởi động Firebase Emulator
cd d:\ReactNative_Project\ShrimpTech2
firebase emulators:start --only hosting,functions

# Hoặc sử dụng script
scripts\firebase-emulator.bat
```

**Endpoints khi development:**
- Web: `http://localhost:5000`
- Functions: `http://localhost:5001/shrimptech-web/us-central1/`

#### 3.2 Production Deployment
```bash
# Deploy lên Firebase
scripts\firebase-deploy.bat

# Hoặc thủ công
cd functions
npm install
cd ..
firebase deploy
```

**Production endpoints:**
- Web: `https://shrimptech-web.web.app`
- Functions: `https://us-central1-shrimptech-web.cloudfunctions.net/`

### 4. API Endpoints mới

#### 4.1 Contact Form
```
POST /api/contact
# Được route đến: sendContactEmail function
```

#### 4.2 Newsletter
```
POST /api/newsletter
# Được route đến: sendNewsletterEmail function
```

#### 4.3 Health Check
```
GET /api/health
# Được route đến: healthCheck function
```

### 5. Tính năng mới với Firebase

#### 5.1 Firestore Database
- Tự động lưu contact forms
- Lưu newsletter subscriptions
- Real-time sync capabilities

#### 5.2 Firebase Hosting Rewrites
- API calls được tự động route đến Functions
- Không cần CORS configuration phức tạp
- Tích hợp seamless

#### 5.3 Emulator Suite
- Test local không cần deploy
- Debug functions dễ dàng
- Hot reload trong development

### 6. Environment Variables

Firebase Functions sử dụng config thay vì .env:
```bash
firebase functions:config:set email.user="shrimptech.vhu.hutech@gmail.com"
firebase functions:config:set email.password="dcnruttjfxapqdyb"
```

### 7. Monitoring & Logs

```bash
# Xem logs functions
firebase functions:log

# Xem logs realtime
firebase functions:log --follow
```

### 8. Rollback Plan

Nếu cần rollback về Railway:
1. Khôi phục `public/js/email-service.js` với Railway endpoints
2. Khôi phục `firebase.json` về cấu hình hosting only
3. Restart Railway server nếu cần

### 9. Performance Benefits

#### Firebase vs Railway:
- ⚡ Faster cold starts với Cloud Functions
- 🌍 Global CDN với Firebase Hosting  
- 📊 Built-in analytics và monitoring
- 💰 Pay-as-you-use pricing model
- 🔄 Auto-scaling
- 🔒 Enterprise security

### 10. Next Steps

1. Test email functionality với emulator
2. Deploy lên production Firebase
3. Update DNS nếu cần
4. Monitor performance và logs
5. Remove Railway dependencies khi stable
