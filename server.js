const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const InputValidator = require('./middleware/input-validator');
const fs = require('fs');
require('dotenv').config();

// Import config production
let PRODUCTION_CONFIG;
try {
  PRODUCTION_CONFIG = require('./config/production-config');
} catch {
  console.warn('⚠️ Không thể tải cấu hình production, dùng config mặc định');
  PRODUCTION_CONFIG = { CSP: null };
}

const app = express();
const inputValidator = new InputValidator();

console.log('🔧 Khởi tạo ShrimpTech Server v2.2 (Bản Clean)...');

// CSP config
const cspConfig = PRODUCTION_CONFIG.CSP || {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'", "'unsafe-inline'",
    "https://apis.google.com",
    "https://www.gstatic.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://shrimptech-c6e93.web.app",
    "https://shrimptech-c6e93.firebaseapp.com",
    "https://unpkg.com",
    "https://kit.fontawesome.com"
  ],
  styleSrc: [
    "'self'", "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com"
  ],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  fontSrc: [
    "'self'", "https://fonts.gstatic.com",
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://use.fontawesome.com",
    "https://kit.fontawesome.com",
    "data:", "blob:"
  ],
  connectSrc: [
    "'self'",
    "https://shrimptech.vn",
    "https://www.shrimptech.vn",
    "https://api.shrimptech.vn",
    "https://formspree.io",
    "https://*.vercel.app",
    "https://*.railway.app",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  frameSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'", "https://formspree.io"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"]
};

// Helmet security
app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xFrameOptions: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use(helmet.contentSecurityPolicy({ directives: cspConfig }));

// Extra headers
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), ambient-light-sensor=()');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// --- CORS ---
const allowedOrigins = [
  'https://shrimptech.vn',
  'https://www.shrimptech.vn',
  'https://shrimptech-c6e93.web.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// --- Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.includes('?v=') || filePath.includes('.v.')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    }
  }
}));

// --- Favicon ---
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    return res.sendFile(faviconPath, { maxAge: 3600 * 1000 });
  }
  return res.sendStatus(204);
});

// --- Rate limiting ---
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Thử lại sau 15 phút.'
  }
});
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Thử lại sau.'
  }
});
app.use('/api/contact', contactLimiter);
app.use('/api/newsletter', contactLimiter);
app.use('/api/', generalLimiter);

// --- Email ---
let transporter = null;
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
        pass: process.env.SMTP_PASS || 'fozfanmhglzorrad'
    }
};
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}
transporter.verify(err => {
  if (err) console.error('❌ SMTP lỗi:', err.message);
  else console.log('✅ SMTP sẵn sàng:', process.env.SMTP_USER);
});

// --- API ---
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.2.0',
    security: {
      csp: 'enabled',
      hsts: 'enabled',
      rateLimit: 'enabled',
      inputValidation: 'enabled'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/contact', inputValidator.validateContactMiddleware(), async (req, res) => {
  try {
    const data = req.validatedData;
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `[SHRIMPTECH] Liên hệ từ ${data.name}`,
        html: `<h2>🦐 SHRIMPTECH - Liên hệ mới</h2>
               <p><strong>Tên:</strong> ${data.name}</p>
               <p><strong>Email:</strong> ${data.email}</p>
               <p><strong>Điện thoại:</strong> ${data.phone}</p>
               <p><strong>Tin nhắn:</strong><br>${data.message}</p>`
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: data.email,
        subject: '[SHRIMPTECH] Xác nhận đã nhận được liên hệ',
        html: `<p>Xin chào <b>${data.name}</b>, chúng tôi đã nhận được tin nhắn của bạn.</p>`
      });
    }
    res.json({ success: true, message: 'Đã nhận liên hệ, vui lòng kiểm tra email.' });
  } catch (err) {
    console.error('❌ Lỗi contact:', err.message);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
  }
});

app.post('/api/newsletter', inputValidator.validateNewsletterMiddleware(), async (req, res) => {
  try {
    const data = req.validatedData;
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: '[SHRIMPTECH] Đăng ký newsletter',
        html: `<p>Email: ${data.email}</p>`
      });
    }
    res.json({ success: true, message: 'Đăng ký newsletter thành công!' });
  } catch (err) {
    console.error('❌ Lỗi newsletter:', err.message);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
  }
});

// --- Route chính ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại',
    url: req.url,
    method: req.method,
    availableEndpoints: [
      'GET /api/status',
      'GET /api/health',
      'POST /api/contact',
      'POST /api/newsletter'
    ]
  });
});

// --- 500 ---
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ'
  });
});

// --- Start ---
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🌐 SHRIMPTECH Server running on http://localhost:${PORT} (ENV PORT=${process.env.PORT || 'not set'})`);
});

// Graceful shutdown helper
function shutdown(signal) {
  console.log(`🛑 Nhận ${signal}, dừng server an toàn`);
  server.close(err => {
    if (err) {
      console.error('Lỗi khi đóng server:', err);
      process.exit(1);
    }
    process.exit(0);
  });
  // Force exit nếu không đóng kịp
  setTimeout(() => {
    console.error('⚠️ Server không đóng kịp, thoát cưỡng bức');
    process.exit(1);
  }, 10000);
}

['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => shutdown(sig)));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});

module.exports = app;
