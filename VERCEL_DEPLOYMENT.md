# 🚀 Vercel Deployment Guide - SHRIMPTECH

## 📋 Tổng quan

Dự án SHRIMPTECH được deploy lên Vercel với cấu trúc:
- **Frontend**: Static files từ thư mục `public/`
- **Backend**: Express.js server chạy serverless
- **API**: `/api/*` routes

## 🔧 Cấu hình Vercel

### 1. File `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*\\.(js|css|html|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|webp|mp4|webm))",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 2. Environment Variables

Trên Vercel Dashboard, set các biến:

```env
NODE_ENV=production
SMTP_USER=shrimptech.vhu.hutech@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
ADMIN_EMAIL=shrimptech.vhu.hutech@gmail.com
```

**⚠️ QUAN TRỌNG**: 
- KHÔNG set `PORT` trên Vercel (Vercel tự động assign)
- Dùng Gmail App Password, KHÔNG dùng password thật

### 3. Cấu trúc Routes

#### Static Files
- `/` → `public/index.html`
- `/styles.css` → `public/styles.css`
- `/js/*.js` → `public/js/*.js`
- `/assets/*` → `public/assets/*`

#### API Endpoints
- `/api/status` → Server status
- `/api/health` → Health check
- `/api/contact` → Contact form
- `/api/newsletter` → Newsletter subscription

## 🚀 Deploy Steps

### Bước 1: Push to GitHub

```bash
# Kiểm tra security
npm run security-check

# Add & commit
git add .
git commit -m "chore: update vercel configuration"
git push origin main
```

### Bước 2: Vercel Auto-Deploy

Vercel sẽ tự động:
1. Detect push to `main` branch
2. Build project
3. Deploy lên production

### Bước 3: Kiểm tra Deployment

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Test endpoints
curl https://your-domain.vercel.app/api/status
```

## 🔍 Troubleshooting

### Lỗi: "ENOENT: no such file or directory"

**Nguyên nhân**: Vercel không tìm thấy static files

**Giải pháp**:
1. Kiểm tra `vercel.json` có build static files
2. Đảm bảo `public/` folder tồn tại
3. Check `.vercelignore` không ignore `public/`

### Lỗi: "Cannot find module"

**Nguyên nhân**: Dependencies không được install

**Giải pháp**:
```json
// package.json
{
  "dependencies": {
    "express": "^4.19.2",
    "nodemailer": "^7.0.6",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "express-rate-limit": "^8.1.0",
    "dotenv": "^17.2.2"
  }
}
```

### Lỗi: "SMTP Authentication Failed"

**Nguyên nhân**: Environment variables không set

**Giải pháp**:
1. Vào Vercel Dashboard
2. Settings → Environment Variables
3. Add `SMTP_USER` và `SMTP_PASS`
4. Redeploy

### Lỗi: CORS Issues

**Nguyên nhân**: Origin không được allow

**Giải pháp** (trong `server.js`):
```javascript
const allowedOrigins = [
  'https://your-domain.vercel.app',
  'https://shrimptech.vn',
  'https://www.shrimptech.vn'
];
```

## 📊 Performance Optimization

### 1. Static Files Caching

Vercel tự động cache static files với:
- Edge caching
- CDN distribution
- Automatic compression

### 2. Serverless Function Optimization

```javascript
// Warm-up function
if (process.env.VERCEL === '1') {
  // Vercel serverless mode
  console.log('Running in Vercel serverless mode');
}
```

### 3. Environment-specific Code

```javascript
// Development vs Production
const isDevelopment = process.env.NODE_ENV !== 'production';
const isVercel = process.env.VERCEL === '1';

if (isDevelopment) {
  // Development-only code
}

if (isVercel) {
  // Vercel-specific optimizations
}
```

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Set trên Vercel Dashboard
- ❌ KHÔNG commit vào Git
- ✅ Dùng `.env.example` làm template

### 2. CORS Configuration
- ✅ Whitelist specific origins
- ❌ KHÔNG dùng `*` wildcard
- ✅ Include production domains

### 3. Rate Limiting
```javascript
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});
```

## 📝 Checklist trước Deploy

- [ ] `npm run security-check` passed
- [ ] `.env` NOT committed
- [ ] `vercel.json` configured correctly
- [ ] Environment variables set on Vercel
- [ ] CORS origins updated
- [ ] Dependencies in `package.json`
- [ ] Static files in `public/`
- [ ] Test API endpoints locally
- [ ] Gmail App Password valid

## 🌐 Custom Domain Setup

### 1. Add Domain on Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `shrimptech.vn`
3. Add domain: `www.shrimptech.vn`

### 2. DNS Configuration

Point domain to Vercel:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Update CORS

```javascript
const allowedOrigins = [
  'https://shrimptech.vn',
  'https://www.shrimptech.vn'
];
```

## 📞 Support

Nếu gặp vấn đề:

1. Check Vercel logs: `vercel logs`
2. Review deployment: Vercel Dashboard → Deployments
3. Test locally: `npm start`
4. Check environment variables: Vercel Dashboard → Settings

---

**Made with 🦐 by SHRIMPTECH Team**
