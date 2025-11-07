"use strict";

var nodemailer = require('nodemailer');

require('dotenv').config();

console.log('🔐 SHRIMPTECH - Verify New SMTP App Password');
console.log('='.repeat(60)); // Display configuration (mask password)

console.log('\n📋 Current Configuration:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '587');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (aewb xgdn jlfv alcc)' : '❌ NOT SET');

if (!process.env.SMTP_PASS) {
  console.error('\n❌ ERROR: SMTP_PASS not found in .env file');
  console.log('Please add: SMTP_PASS=aewb xgdn jlfv alcc');
  process.exit(1);
} // Create transporter


var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true,
  logger: true
});
console.log('\n🔌 Testing SMTP Connection...');
transporter.verify(function (error, success) {
  if (error) {
    console.log('\n❌ SMTP Verification FAILED:');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Verify App Password: aewb xgdn jlfv alcc');
    console.log('2. Check 2FA is enabled: https://myaccount.google.com/security');
    console.log('3. Generate new App Password: https://myaccount.google.com/apppasswords');
    console.log('4. Update .env file with new password');
    process.exit(1);
  } else {
    console.log('\n✅ SMTP Verification SUCCESSFUL!');
    console.log('Server is ready to send emails'); // Send test email

    sendTestEmail();
  }
});

function sendTestEmail() {
  var info;
  return regeneratorRuntime.async(function sendTestEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('\n📧 Sending Test Email...');
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "\"SHRIMPTECH Test\" <".concat(process.env.SMTP_USER, ">"),
            to: process.env.SMTP_USER,
            subject: '✅ SHRIMPTECH - New SMTP Password Verified',
            html: "\n                <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n                    <div style=\"background: linear-gradient(135deg, #0066cc, #004499); padding: 30px; text-align: center;\">\n                        <h1 style=\"color: white; margin: 0;\">\uD83E\uDD90 SHRIMPTECH</h1>\n                        <p style=\"color: white; margin: 10px 0 0;\">SMTP Auto Mail System</p>\n                    </div>\n                    <div style=\"padding: 30px; background: white;\">\n                        <h2 style=\"color: #0066cc;\">\u2705 New App Password Verified Successfully!</h2>\n                        \n                        <div style=\"background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;\">\n                            <p style=\"margin: 0;\"><strong>\u2705 Verification Results:</strong></p>\n                            <ul style=\"margin: 10px 0 0;\">\n                                <li>New App Password: <code>aewb xgdn jlfv alcc</code></li>\n                                <li>SMTP Connection: OK</li>\n                                <li>Email Sending: OK</li>\n                                <li>Auto Mail System: OPERATIONAL</li>\n                            </ul>\n                        </div>\n                        \n                        <p><strong>Test Time:</strong> ".concat(new Date().toLocaleString('vi-VN'), "</p>\n                        <p><strong>SMTP Server:</strong> ").concat(process.env.SMTP_HOST || 'smtp.gmail.com', "</p>\n                        <p><strong>Email Account:</strong> ").concat(process.env.SMTP_USER, "</p>\n                        \n                        <p style=\"color: #666; font-size: 14px; margin-top: 20px;\">\n                            H\u1EC7 th\u1ED1ng email t\u1EF1 \u0111\u1ED9ng c\u1EE7a ShrimpTech \u0111ang ho\u1EA1t \u0111\u1ED9ng b\xECnh th\u01B0\u1EDDng v\u1EDBi App Password m\u1EDBi.\n                        </p>\n                    </div>\n                    <div style=\"background: #f8f9fa; padding: 15px; text-align: center;\">\n                        <p style=\"margin: 0; font-size: 12px; color: #999;\">\n                            \xA9 2024 SHRIMPTECH - Auto Mail System v2.2\n                        </p>\n                    </div>\n                </div>\n            ")
          }));

        case 4:
          info = _context.sent;
          console.log('\n✅ Test Email Sent Successfully!');
          console.log('Message ID:', info.messageId);
          console.log('Response:', info.response);
          console.log('\n📬 Check your inbox:', process.env.SMTP_USER);
          console.log('\n🎉 New App Password is working correctly!');
          process.exit(0);
          _context.next = 18;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          console.log('\n❌ Test Email Failed:');
          console.error('Error:', _context.t0.message);
          process.exit(1);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
}