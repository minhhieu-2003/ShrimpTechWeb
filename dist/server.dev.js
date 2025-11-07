"use strict";

var express = require('express');

var path = require('path');

var cors = require('cors');

var rateLimit = require('express-rate-limit');

var nodemailer = require('nodemailer');

var helmet = require('helmet');

var InputValidator = require('./middleware/input-validator');

var fs = require('fs');

require('dotenv').config(); // Import config production


var PRODUCTION_CONFIG;

try {
  PRODUCTION_CONFIG = require('./config/production-config');
} catch (_unused) {
  console.warn('⚠️ Không thể tải cấu hình production, dùng config mặc định');
  PRODUCTION_CONFIG = {
    CSP: null
  };
}

var app = express();
var inputValidator = new InputValidator();
console.log('🔧 Khởi tạo ShrimpTech Server v2.2 (Bản Clean)...'); // CSP config

var cspConfig = PRODUCTION_CONFIG.CSP || {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com", "https://www.gstatic.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://shrimptech-c6e93.web.app", "https://shrimptech-c6e93.firebaseapp.com", "https://unpkg.com", "https://kit.fontawesome.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com", "https://kit.fontawesome.com", "data:", "blob:"],
  connectSrc: ["'self'", "https://shrimptech.vn", "https://www.shrimptech.vn", "https://api.shrimptech.vn", "https://formspree.io", "https://*.vercel.app", "https://*.railway.app", "http://localhost:3000", "http://localhost:3001"],
  frameSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'", "https://formspree.io"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"]
}; // Helmet security

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xFrameOptions: {
    action: 'deny'
  },
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
app.use(helmet.contentSecurityPolicy({
  directives: cspConfig
})); // Extra headers

app.use(function (req, res, next) {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), ambient-light-sensor=()');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}); // --- CORS ---

var allowedOrigins = ['http://localhost:3000', // Add your frontend's origin
'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002', 'https://shrimptech.vn', 'https://www.shrimptech.vn', 'https://shrimptech-c6e93.web.app', 'https://shrimptech-c6e93.firebaseapp.com'];
app.use(cors({
  origin: function origin(_origin, callback) {
    if (!_origin || allowedOrigins.includes(_origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})); // --- Middleware ---

app.use(express.json({
  limit: '10mb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
})); // Static

app.use(express["static"](path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
  setHeaders: function setHeaders(res, filePath) {
    if (filePath.includes('?v=') || filePath.includes('.v.')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }

    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    }
  }
})); // --- Favicon ---

app.get('/favicon.ico', function (req, res) {
  var faviconPath = path.join(__dirname, 'public', 'favicon.ico');

  if (fs.existsSync(faviconPath)) {
    return res.sendFile(faviconPath, {
      maxAge: 3600 * 1000
    });
  }

  return res.sendStatus(204);
}); // --- Rate limiting ---

var contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Thử lại sau 15 phút.'
  }
});
var generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Thử lại sau.'
  }
});
app.use('/api/contact', contactLimiter);
app.use('/api/newsletter', contactLimiter);
app.use('/api/', generalLimiter); // --- Email ---

var transporter = null;
var emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
    pass: process.env.SMTP_PASS // Removed hardcoded password - must use .env

  }
};

if (!process.env.SMTP_PASS) {
  console.warn('⚠️ WARNING: SMTP_PASS not set in .env file');
}

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

transporter.verify(function (err) {
  if (err) console.error('❌ SMTP lỗi:', err.message);else console.log('✅ SMTP sẵn sàng:', process.env.SMTP_USER);
}); // --- API ---

app.get('/api/status', function (req, res) {
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
app.get('/api/health', function (req, res) {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});
app.post('/api/contact', inputValidator.validateContactMiddleware(), function _callee(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          data = req.validatedData;

          if (!transporter) {
            _context.next = 7;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: "[SHRIMPTECH] Li\xEAn h\u1EC7 t\u1EEB ".concat(data.name),
            html: "<h2>\uD83E\uDD90 SHRIMPTECH - Li\xEAn h\u1EC7 m\u1EDBi</h2>\n               <p><strong>T\xEAn:</strong> ".concat(data.name, "</p>\n               <p><strong>Email:</strong> ").concat(data.email, "</p>\n               <p><strong>\u0110i\u1EC7n tho\u1EA1i:</strong> ").concat(data.phone, "</p>\n               <p><strong>Tin nh\u1EAFn:</strong><br>").concat(data.message, "</p>")
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.SMTP_USER,
            to: data.email,
            subject: '[SHRIMPTECH] Xác nhận đã nhận được liên hệ',
            html: "<p>Xin ch\xE0o <b>".concat(data.name, "</b>, ch\xFAng t\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c tin nh\u1EAFn c\u1EE7a b\u1EA1n.</p>")
          }));

        case 7:
          res.json({
            success: true,
            message: 'Đã nhận liên hệ, vui lòng kiểm tra email.'
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('❌ Lỗi contact:', _context.t0.message);
          res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra.'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
app.post('/api/newsletter', inputValidator.validateNewsletterMiddleware(), function _callee2(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          data = req.validatedData;

          if (!transporter) {
            _context2.next = 5;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: '[SHRIMPTECH] Đăng ký newsletter',
            html: "<p>Email: ".concat(data.email, "</p>")
          }));

        case 5:
          res.json({
            success: true,
            message: 'Đăng ký newsletter thành công!'
          });
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error('❌ Lỗi newsletter:', _context2.t0.message);
          res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra.'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // --- Route chính ---

app.get('/', function (req, res) {
  return res.sendFile(path.join(__dirname, 'public/index.html'));
}); // --- 404 ---

app.use(function (req, res) {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại',
    url: req.url,
    method: req.method,
    availableEndpoints: ['GET /api/status', 'GET /api/health', 'POST /api/contact', 'POST /api/newsletter']
  });
}); // --- 500 ---

app.use(function (err, req, res, next) {
  console.error('💥 Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ'
  });
}); // --- Start ---

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  console.log("\uD83C\uDF10 SHRIMPTECH Server running on http://localhost:".concat(PORT, " (ENV PORT=").concat(process.env.PORT || 'not set', ")"));
}); // Graceful shutdown helper

function shutdown(signal) {
  console.log("\uD83D\uDED1 Nh\u1EADn ".concat(signal, ", d\u1EEBng server an to\xE0n"));
  server.close(function (err) {
    if (err) {
      console.error('Lỗi khi đóng server:', err);
      process.exit(1);
    }

    process.exit(0);
  }); // Force exit nếu không đóng kịp

  setTimeout(function () {
    console.error('⚠️ Server không đóng kịp, thoát cưỡng bức');
    process.exit(1);
  }, 10000);
}

['SIGTERM', 'SIGINT'].forEach(function (sig) {
  return process.on(sig, function () {
    return shutdown(sig);
  });
});
process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});
process.on('unhandledRejection', function (reason) {
  console.error('Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});
module.exports = app;