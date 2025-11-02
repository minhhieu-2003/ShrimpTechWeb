"use strict";

var path = require('path');

var nodemailer = require('nodemailer');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});

var transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}); // Test connection

transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Test Failed:', error);
  } else {
    console.log('✅ SMTP Test Successful - Server ready to send emails');
    console.log('📧 Using email:', process.env.SMTP_USER || 'NOT_CONFIGURED');
  }
}); // Test send email

function testEmail() {
  var info;
  return regeneratorRuntime.async(function testEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "\"SHRIMP TECH Test\" <".concat(process.env.SMTP_USER, ">"),
            to: process.env.SMTP_USER,
            subject: '🦐 SMTP Test - ' + new Date().toLocaleString('vi-VN'),
            html: "\n                <h2>\uD83E\uDD90 SHRIMP TECH - SMTP Test Email</h2>\n                <p>\u2705 Email configuration is working correctly!</p>\n                <p><strong>Timestamp:</strong> ".concat(new Date().toISOString(), "</p>\n                <p><strong>Configuration:</strong> Using environment variables</p>\n            ")
          }));

        case 3:
          info = _context.sent;
          console.log('✅ Test email sent:', info.messageId);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('❌ Test email failed:', _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

testEmail();