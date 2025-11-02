"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var nodemailer = require('nodemailer');

require('dotenv').config();
/**
 * Free Email Service Configuration
 * Supports multiple free email providers:
 * 1. Brevo (Sendinblue) - 300 emails/day
 * 2. Mailjet - 200 emails/day  
 * 3. Gmail SMTP - 100-500 emails/day
 * 4. Mailgun - 5000 emails/month (first month)
 */
// Email provider configurations


var emailProviders = {
  // Brevo (Sendinblue) - Recommended free option
  brevo: {
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER || '',
      // Your Brevo SMTP login
      pass: process.env.BREVO_PASS || '' // Your Brevo SMTP password

    }
  },
  // Mailjet - Alternative free option
  mailjet: {
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILJET_API_KEY || '',
      // Mailjet API Key
      pass: process.env.MAILJET_SECRET_KEY || '' // Mailjet Secret Key

    }
  },
  // Gmail SMTP - Fallback option
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  },
  // Mailgun SMTP
  mailgun: {
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILGUN_SMTP_USER || '',
      pass: process.env.MAILGUN_SMTP_PASS || ''
    }
  }
}; // Create transporter with fallback support

var createFreeEmailTransporter = function createFreeEmailTransporter() {
  // Determine which provider to use based on environment variables
  var provider = 'gmail'; // Default fallback

  if (process.env.BREVO_USER && process.env.BREVO_PASS) {
    provider = 'brevo';
    console.log('📧 Using Brevo (Sendinblue) SMTP');
  } else if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
    provider = 'mailjet';
    console.log('📧 Using Mailjet SMTP');
  } else if (process.env.MAILGUN_SMTP_USER && process.env.MAILGUN_SMTP_PASS) {
    provider = 'mailgun';
    console.log('📧 Using Mailgun SMTP');
  } else {
    console.log('📧 Using Gmail SMTP (fallback)');
  }

  var config = emailProviders[provider];
  return nodemailer.createTransport(_objectSpread({}, config, {
    // Enhanced settings for better deliverability
    tls: {
      rejectUnauthorized: false
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  }));
}; // Create beautiful HTML email template


var createContactEmailHTML = function createContactEmailHTML(formData, clientIP) {
  var name = formData.name,
      email = formData.email,
      phone = formData.phone,
      company = formData.company,
      farmType = formData.farmType,
      subject = formData.subject,
      message = formData.message,
      newsletter = formData.newsletter; // Convert codes to readable text

  var farmTypeText = {
    'pond-small': 'Ao tròn nổi (50-700m²)',
    'pond-medium': 'Ao lót bạt đáy (700–1.000m²)',
    'pond-large': 'Ao siêu thâm canh tổng hợp (1.000–3.000m² mỗi ao)',
    'research': 'Nghiên cứu/Học thuật',
    'other': 'Khác'
  }[farmType] || farmType;
  var subjectText = {
    'product-info': 'Thông tin sản phẩm',
    'consultation': 'Tư vấn hệ thống',
    'technical': 'Tư vấn kỹ thuật',
    'installation': 'Lắp đặt & bảo trì',
    'partnership': 'Hợp tác đại lý',
    'research': 'Hợp tác nghiên cứu',
    'other': 'Khác'
  }[subject] || subject;
  return "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"utf-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>SHRIMPTECH - Li\xEAn h\u1EC7 m\u1EDBi</title>\n        </head>\n        <body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;\">\n            <div style=\"max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">\n                <!-- Header -->\n                <div style=\"background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;\">\n                    <h1 style=\"color: white; margin: 0; font-size: 28px;\">\uD83E\uDD90 SHRIMPTECH</h1>\n                    <p style=\"color: #cce6ff; margin: 10px 0 0; font-size: 16px;\">C\xF4ng ngh\u1EC7 nu\xF4i t\xF4m th\xF4ng minh</p>\n                </div>\n                \n                <!-- Alert Badge -->\n                <div style=\"background: #ff6b35; color: white; text-align: center; padding: 15px; font-weight: bold; font-size: 18px;\">\n                    \uD83D\uDD14 LI\xCAN H\u1EC6 M\u1EDAI T\u1EEA WEBSITE\n                </div>\n                \n                <!-- Content -->\n                <div style=\"padding: 30px;\">\n                    <h2 style=\"color: #0066cc; margin-top: 0; border-bottom: 2px solid #e6f3ff; padding-bottom: 10px;\">\n                        \uD83D\uDCCB Th\xF4ng tin kh\xE1ch h\xE0ng\n                    </h2>\n                    \n                    <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 25px;\">\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold; width: 30%;\">\uD83D\uDC64 H\u1ECD t\xEAn:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\">".concat(name, "</td>\n                        </tr>\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;\">\uD83D\uDCE7 Email:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\"><a href=\"mailto:").concat(email, "\" style=\"color: #0066cc; text-decoration: none;\">").concat(email, "</a></td>\n                        </tr>\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;\">\uD83D\uDCF1 \u0110i\u1EC7n tho\u1EA1i:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\"><a href=\"tel:").concat(phone, "\" style=\"color: #0066cc; text-decoration: none;\">").concat(phone, "</a></td>\n                        </tr>\n                        ").concat(company ? "\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;\">\uD83C\uDFE2 C\xF4ng ty:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\">".concat(company, "</td>\n                        </tr>") : '', "\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;\">\uD83D\uDC1F Lo\u1EA1i ao:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\">").concat(farmTypeText, "</td>\n                        </tr>\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;\">\uD83D\uDCDD Ch\u1EE7 \u0111\u1EC1:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\">").concat(subjectText, "</td>\n                        </tr>\n                        <tr>\n                            <td style=\"padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;\">\uD83D\uDCEC Newsletter:</td>\n                            <td style=\"padding: 12px; border: 1px solid #dee2e6;\">").concat(newsletter ? '✅ Có đăng ký' : '❌ Không đăng ký', "</td>\n                        </tr>\n                    </table>\n                    \n                    <h3 style=\"color: #0066cc; margin-bottom: 15px;\">\uD83D\uDCAC Tin nh\u1EAFn:</h3>\n                    <div style=\"background: #f8f9fa; padding: 20px; border-left: 4px solid #0066cc; margin-bottom: 25px; line-height: 1.6;\">\n                        ").concat(message.replace(/\n/g, '<br>'), "\n                    </div>\n                    \n                    <!-- Action Buttons -->\n                    <div style=\"text-align: center; margin: 30px 0;\">\n                        <a href=\"mailto:").concat(email, "?subject=Re: ").concat(subjectText, " - SHRIMPTECH\" \n                           style=\"background: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;\">\n                            \u2709\uFE0F Tr\u1EA3 l\u1EDDi Email\n                        </a>\n                        <a href=\"tel:").concat(phone, "\" \n                           style=\"background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;\">\n                            \uD83D\uDCDE G\u1ECDi \u0111i\u1EC7n\n                        </a>\n                    </div>\n                </div>\n                \n                <!-- Footer -->\n                <div style=\"background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;\">\n                    <p style=\"margin: 0; color: #6c757d; font-size: 14px;\">\n                        <strong>Th\u1EDDi gian:</strong> ").concat(new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh'
  }), "<br>\n                        <strong>IP:</strong> ").concat(clientIP, "<br>\n                        <strong>Ngu\u1ED3n:</strong> Website ShrimpTech.vn\n                    </p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
}; // Create confirmation email for customer


var createConfirmationEmailHTML = function createConfirmationEmailHTML(formData) {
  var name = formData.name;
  return "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"utf-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>SHRIMPTECH - X\xE1c nh\u1EADn li\xEAn h\u1EC7</title>\n        </head>\n        <body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;\">\n            <div style=\"max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">\n                <!-- Header -->\n                <div style=\"background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;\">\n                    <h1 style=\"color: white; margin: 0; font-size: 28px;\">\uD83E\uDD90 SHRIMPTECH</h1>\n                    <p style=\"color: #cce6ff; margin: 10px 0 0; font-size: 16px;\">C\xF4ng ngh\u1EC7 nu\xF4i t\xF4m th\xF4ng minh</p>\n                </div>\n                \n                <!-- Success Badge -->\n                <div style=\"background: #28a745; color: white; text-align: center; padding: 15px; font-weight: bold; font-size: 18px;\">\n                    \u2705 LI\xCAN H\u1EC6 TH\xC0NH C\xD4NG\n                </div>\n                \n                <!-- Content -->\n                <div style=\"padding: 30px;\">\n                    <h2 style=\"color: #0066cc; margin-top: 0;\">Xin ch\xE0o ".concat(name, "!</h2>\n                    <p style=\"line-height: 1.6; font-size: 16px;\">\n                        C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 li\xEAn h\u1EC7 v\u1EDBi <strong>SHRIMPTECH</strong>. Ch\xFAng t\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c th\xF4ng tin c\u1EE7a b\u1EA1n v\xE0 s\u1EBD ph\u1EA3n h\u1ED3i trong v\xF2ng <strong>24 gi\u1EDD</strong>.\n                    </p>\n                    \n                    <div style=\"background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0;\">\n                        <h3 style=\"color: #0066cc; margin-top: 0;\">\uD83D\uDCDE Li\xEAn h\u1EC7 kh\u1EA9n c\u1EA5p:</h3>\n                        <p style=\"margin: 10px 0; font-size: 16px;\">\n                            <strong>Hotline:</strong> <a href=\"tel:0835749407\" style=\"color: #0066cc;\">0835749407</a> | <a href=\"tel:0826529739\" style=\"color: #0066cc;\">0826529739</a><br>\n                            <strong>Email:</strong> <a href=\"mailto:shrimptech.vhu.hutech@gmail.com\" style=\"color: #0066cc;\">shrimptech.vhu.hutech@gmail.com</a>\n                        </p>\n                    </div>\n                    \n                    <p style=\"line-height: 1.6; font-size: 16px;\">\n                        Trong th\u1EDDi gian ch\u1EDD \u0111\u1EE3i, b\u1EA1n c\xF3 th\u1EC3 t\xECm hi\u1EC3u th\xEAm v\u1EC1 c\xE1c s\u1EA3n ph\u1EA9m v\xE0 d\u1ECBch v\u1EE5 c\u1EE7a ch\xFAng t\xF4i t\u1EA1i website.\n                    </p>\n                    \n                    <div style=\"text-align: center; margin: 30px 0;\">\n                        <a href=\"https://shrimptech.vn\" \n                           style=\"background: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;\">\n                            \uD83C\uDF10 Truy c\u1EADp Website\n                        </a>\n                    </div>\n                </div>\n                \n                <!-- Footer -->\n                <div style=\"background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;\">\n                    <p style=\"margin: 0; color: #6c757d; font-size: 14px;\">\n                        \xA9 2024 SHRIMPTECH - C\xF4ng ngh\u1EC7 nu\xF4i t\xF4m th\xF4ng minh<br>\n                        Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng, vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi.\n                    </p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
}; // Create contact email object


var createContactEmail = function createContactEmail(formData, clientIP) {
  var name = formData.name,
      email = formData.email,
      subject = formData.subject;
  var subjectText = {
    'product-info': 'Thông tin sản phẩm',
    'consultation': 'Tư vấn hệ thống',
    'technical': 'Tư vấn kỹ thuật',
    'installation': 'Lắp đặt & bảo trì',
    'partnership': 'Hợp tác đại lý',
    'research': 'Hợp tác nghiên cứu',
    'other': 'Khác'
  }[subject] || subject;
  return {
    from: {
      name: 'SHRIMPTECH Contact System',
      address: process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'noreply@example.com'
    },
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    replyTo: {
      name: name,
      address: email
    },
    subject: "\uD83E\uDD90 SHRIMPTECH - Li\xEAn h\u1EC7 m\u1EDBi: ".concat(name, " (").concat(subjectText, ")"),
    html: createContactEmailHTML(formData, clientIP),
    headers: {
      'Message-ID': "<contact-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9), "@shrimptech.vn>"),
      'X-Mailer': 'SHRIMPTECH Contact System v3.0',
      'X-Priority': '2',
      'Importance': 'High'
    }
  };
}; // Create confirmation email object


var createConfirmationEmail = function createConfirmationEmail(formData) {
  var name = formData.name,
      email = formData.email;
  return {
    from: {
      name: 'SHRIMPTECH',
      address: process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'noreply@example.com'
    },
    to: email,
    subject: '✅ SHRIMPTECH - Xác nhận liên hệ thành công',
    html: createConfirmationEmailHTML(formData),
    headers: {
      'Message-ID': "<confirmation-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9), "@shrimptech.vn>"),
      'X-Mailer': 'SHRIMPTECH Confirmation System v3.0'
    }
  };
}; // Newsletter email


var createNewsletterEmail = function createNewsletterEmail(email) {
  return {
    from: {
      name: 'SHRIMPTECH Newsletter',
      address: process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'noreply@example.com'
    },
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: '🦐 SHRIMPTECH - Đăng ký Newsletter mới',
    html: "\n            <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n                <div style=\"background: linear-gradient(135deg, #0066cc, #004499); padding: 20px; text-align: center;\">\n                    <h2 style=\"color: white; margin: 0;\">\uD83E\uDD90 SHRIMPTECH Newsletter</h2>\n                </div>\n                <div style=\"background: white; padding: 20px; border: 1px solid #dee2e6;\">\n                    <h3 style=\"color: #0066cc;\">\uD83D\uDCEC \u0110\u0103ng k\xFD Newsletter m\u1EDBi</h3>\n                    <p><strong>Email:</strong> <a href=\"mailto:".concat(email, "\" style=\"color: #0066cc;\">").concat(email, "</a></p>\n                    <p><strong>Th\u1EDDi gian:</strong> ").concat(new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh'
    }), "</p>\n                    <p><strong>Ngu\u1ED3n:</strong> Website Newsletter Form</p>\n                </div>\n            </div>\n        "),
    headers: {
      'Message-ID': "<newsletter-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9), "@shrimptech.vn>"),
      'X-Mailer': 'SHRIMPTECH Newsletter System v3.0'
    }
  };
};

module.exports = {
  createFreeEmailTransporter: createFreeEmailTransporter,
  createContactEmail: createContactEmail,
  createConfirmationEmail: createConfirmationEmail,
  createNewsletterEmail: createNewsletterEmail,
  emailProviders: emailProviders
};