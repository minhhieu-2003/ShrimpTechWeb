"use strict";

var nodemailer = require('nodemailer');

var cors = require('cors'); // CORS configuration


var corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:5500', 'https://shrimp-tech2-lhohw9gzp-tranminh-hieus-projects.vercel.app', 'https://shrimptech2.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}; // Email configuration

var emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'shrimptech.vhu.hutech@gmail.com',
    pass: process.env.SMTP_PASS || 'fozfanmhglzorrad' // Use App Password

  },
  tls: {
    rejectUnauthorized: false
  }
}; // Create transporter

var transporter = nodemailer.createTransporter(emailConfig); // Verify transporter

transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Configuration Error:', error);
  } else {
    console.log('✅ SMTP Server ready to send emails');
  }
}); // Email templates

var emailTemplates = {
  // Customer confirmation email
  customerConfirmation: function customerConfirmation(data) {
    return {
      subject: '🦐 Cảm ơn bạn đã liên hệ SHRIMP TECH - Xác nhận đã nhận thông tin',
      html: "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"UTF-8\">\n            <style>\n                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }\n                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }\n                .header { background: linear-gradient(135deg, #00b4d8, #0077b6); padding: 30px; text-align: center; color: white; }\n                .header h1 { margin: 0; font-size: 24px; }\n                .content { padding: 30px; }\n                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }\n                .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #00b4d8; }\n                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }\n                .shrimp-emoji { font-size: 24px; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <div class=\"shrimp-emoji\">\uD83E\uDD90</div>\n                    <h1>SHRIMP TECH</h1>\n                    <p>C\xF4ng ngh\u1EC7 IoT th\xF4ng minh cho nu\xF4i t\xF4m</p>\n                </div>\n                <div class=\"content\">\n                    <h2>Xin ch\xE0o ".concat(data.name, "!</h2>\n                    <p>C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 quan t\xE2m v\xE0 li\xEAn h\u1EC7 v\u1EDBi SHRIMP TECH. Ch\xFAng t\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c th\xF4ng tin c\u1EE7a b\u1EA1n v\xE0 s\u1EBD ph\u1EA3n h\u1ED3i trong th\u1EDDi gian s\u1EDBm nh\u1EA5t.</p>\n                    \n                    <div class=\"info-grid\">\n                        <div class=\"info-item\">\n                            <strong>\uD83D\uDC64 H\u1ECD t\xEAn:</strong><br>").concat(data.name, "\n                        </div>\n                        <div class=\"info-item\">\n                            <strong>\uD83D\uDCE7 Email:</strong><br>").concat(data.email, "\n                        </div>\n                        <div class=\"info-item\">\n                            <strong>\uD83D\uDCF1 \u0110i\u1EC7n tho\u1EA1i:</strong><br>").concat(data.phone, "\n                        </div>\n                        <div class=\"info-item\">\n                            <strong>\uD83C\uDFE2 C\xF4ng ty:</strong><br>").concat(data.company || 'Không có', "\n                        </div>\n                    </div>\n                    \n                    <div style=\"background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n                        <strong>\uD83D\uDCAC N\u1ED9i dung tin nh\u1EAFn:</strong><br>\n                        ").concat(data.message, "\n                    </div>\n                    \n                    <p><strong>\uD83D\uDCDE Li\xEAn h\u1EC7 kh\u1EA9n c\u1EA5p:</strong></p>\n                    <ul>\n                        <li>Hotline 1: <strong>0835 749 407</strong></li>\n                        <li>Hotline 2: <strong>0826 529 739</strong></li>\n                        <li>Email: <strong>shrimptech.vhu.hutech@gmail.com</strong></li>\n                    </ul>\n                </div>\n                <div class=\"footer\">\n                    <p>\xA9 2025 SHRIMP TECH - N\xE2ng t\u1EA7m ng\xE0nh nu\xF4i t\xF4m Vi\u1EC7t Nam v\u1EDBi c\xF4ng ngh\u1EC7 IoT</p>\n                    <p>\uD83C\uDF10 Website: <a href=\"https://shrimptech.com\">shrimptech.com</a></p>\n                </div>\n            </div>\n        </body>\n        </html>\n        ")
    };
  },
  // Admin notification email
  adminNotification: function adminNotification(data) {
    return {
      subject: "\uD83D\uDEA8 [SHRIMP TECH] Li\xEAn h\u1EC7 m\u1EDBi t\u1EEB ".concat(data.name, " - ").concat(data.email),
      html: "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"UTF-8\">\n            <style>\n                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }\n                .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }\n                .header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); padding: 20px; text-align: center; color: white; }\n                .content { padding: 30px; }\n                .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }\n                .customer-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }\n                .actions { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\uD83D\uDEA8 LI\xCAN H\u1EC6 M\u1EDAI - SHRIMP TECH</h1>\n                    <p>Th\u1EDDi gian: ".concat(new Date().toLocaleString('vi-VN'), "</p>\n                </div>\n                <div class=\"content\">\n                    <div class=\"urgent\">\n                        <strong>\u26A1 TH\xD4NG TIN KH\xC1CH H\xC0NG M\u1EDAI</strong><br>\n                        Vui l\xF2ng ph\u1EA3n h\u1ED3i trong v\xF2ng 2 gi\u1EDD \u0111\u1EC3 \u0111\u1EA3m b\u1EA3o ch\u1EA5t l\u01B0\u1EE3ng d\u1ECBch v\u1EE5.\n                    </div>\n                    \n                    <div class=\"customer-info\">\n                        <h3>\uD83D\uDC64 Th\xF4ng tin li\xEAn h\u1EC7:</h3>\n                        <p><strong>H\u1ECD t\xEAn:</strong> ").concat(data.name, "</p>\n                        <p><strong>Email:</strong> <a href=\"mailto:").concat(data.email, "\">").concat(data.email, "</a></p>\n                        <p><strong>\u0110i\u1EC7n tho\u1EA1i:</strong> <a href=\"tel:").concat(data.phone, "\">").concat(data.phone, "</a></p>\n                        <p><strong>C\xF4ng ty:</strong> ").concat(data.company || 'Không có thông tin', "</p>\n                        <p><strong>Ngu\u1ED3n:</strong> ").concat(data.source || 'Website', "</p>\n                    </div>\n                    \n                    <div style=\"background: #f1f3f4; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n                        <h3>\uD83D\uDCAC N\u1ED9i dung tin nh\u1EAFn:</h3>\n                        <p style=\"white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00b4d8;\">").concat(data.message, "</p>\n                    </div>\n                    \n                    <div class=\"actions\">\n                        <h3>\uD83C\uDFAF H\xE0nh \u0111\u1ED9ng c\u1EA7n th\u1EF1c hi\u1EC7n:</h3>\n                        <ul>\n                            <li>\u2705 Ph\u1EA3n h\u1ED3i email kh\xE1ch h\xE0ng</li>\n                            <li>\uD83D\uDCDE G\u1ECDi \u0111i\u1EC7n t\u01B0 v\u1EA5n (n\u1EBFu c\u1EA7n)</li>\n                            <li>\uD83D\uDCDD C\u1EADp nh\u1EADt CRM system</li>\n                            <li>\uD83D\uDCCA Ph\xE2n t\xEDch nhu c\u1EA7u kh\xE1ch h\xE0ng</li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </body>\n        </html>\n        ")
    };
  }
}; // Main handler function

module.exports = function _callee(req, res) {
  var _req$body, name, email, phone, company, message, source, emailRegex, phoneRegex, contactData, customerEmail, adminEmail;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Enable CORS
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Handle preflight

          if (!(req.method === 'OPTIONS')) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(200).end());

        case 5:
          if (!(req.method !== 'POST')) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(405).json({
            success: false,
            message: 'Method not allowed'
          }));

        case 7:
          _context.prev = 7;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, phone = _req$body.phone, company = _req$body.company, message = _req$body.message, source = _req$body.source; // Validation

          if (!(!name || !email || !message)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Tin nhắn)'
          }));

        case 11:
          // Email validation
          emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (emailRegex.test(email)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Email không hợp lệ'
          }));

        case 14:
          // Phone validation (Vietnamese format)
          phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

          if (!(phone && !phoneRegex.test(phone.replace(/\s/g, '')))) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Số điện thoại không hợp lệ'
          }));

        case 17:
          contactData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : '',
            company: company ? company.trim() : '',
            message: message.trim(),
            source: source || 'Website',
            timestamp: new Date().toISOString()
          }; // Send customer confirmation email

          customerEmail = emailTemplates.customerConfirmation(contactData);
          _context.next = 21;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "\"SHRIMP TECH Support\" <".concat(emailConfig.auth.user, ">"),
            to: contactData.email,
            subject: customerEmail.subject,
            html: customerEmail.html
          }));

        case 21:
          // Send admin notification email
          adminEmail = emailTemplates.adminNotification(contactData);
          _context.next = 24;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "\"SHRIMP TECH System\" <".concat(emailConfig.auth.user, ">"),
            to: emailConfig.auth.user,
            subject: adminEmail.subject,
            html: adminEmail.html
          }));

        case 24:
          console.log('✅ Emails sent successfully:', {
            customer: contactData.email,
            admin: emailConfig.auth.user,
            timestamp: new Date().toISOString()
          }); // Success response

          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: '🦐 Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
            data: {
              name: contactData.name,
              email: contactData.email,
              timestamp: contactData.timestamp
            }
          }));

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](7);
          console.error('❌ Email sending error:', _context.t0); // Return appropriate error response

          if (!(_context.t0.code === 'EAUTH')) {
            _context.next = 33;
            break;
          }

          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Lỗi xác thực email. Vui lòng thử lại sau.',
            error: 'Authentication failed'
          }));

        case 33:
          if (!(_context.t0.code === 'ECONNECTION')) {
            _context.next = 35;
            break;
          }

          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Lỗi kết nối email server. Vui lòng thử lại sau.',
            error: 'Connection failed'
          }));

        case 35:
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.',
            error: _context.t0.message
          }));

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 28]]);
}; // Health check endpoint


module.exports.health = function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(transporter.verify());

        case 3:
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'Email service is healthy',
            smtp: {
              host: emailConfig.host,
              port: emailConfig.port,
              secure: emailConfig.secure
            },
            timestamp: new Date().toISOString()
          }));

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'Email service is down',
            error: _context2.t0.message,
            timestamp: new Date().toISOString()
          }));

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 6]]);
};