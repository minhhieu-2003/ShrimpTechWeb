"use strict";

var nodemailer = require('nodemailer');

require('dotenv').config();

console.log('🔍 SHRIMPTECH - Check All Email Servers');
console.log('='.repeat(60)); // Test configurations

var configs = [{
  name: 'Primary Gmail SMTP (Port 587)',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS
}, {
  name: 'Gmail SSL (Port 465)',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS
}];

function testConfig(config) {
  var transporter;
  return regeneratorRuntime.async(function testConfig$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("\n\uD83D\uDCE7 Testing: ".concat(config.name));
          console.log("   Host: ".concat(config.host, ":").concat(config.port));
          console.log("   Secure: ".concat(config.secure));
          transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
              user: config.user,
              pass: config.pass
            }
          });
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(transporter.verify());

        case 7:
          console.log("   \u2705 Status: ONLINE");
          return _context.abrupt("return", true);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          console.log("   \u274C Status: OFFLINE");
          console.log("   Error: ".concat(_context.t0.message));
          return _context.abrupt("return", false);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
}

(function _callee() {
  var results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, config, result, allSuccess;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('\n🔐 App Password: aewbxgdnjlfvalcc (no spaces)');
          console.log('📧 Email Account:', process.env.SMTP_USER);
          results = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 6;
          _iterator = configs[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 17;
            break;
          }

          config = _step.value;
          _context2.next = 12;
          return regeneratorRuntime.awrap(testConfig(config));

        case 12:
          result = _context2.sent;
          results.push({
            name: config.name,
            success: result
          });

        case 14:
          _iteratorNormalCompletion = true;
          _context2.next = 8;
          break;

        case 17:
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 23:
          _context2.prev = 23;
          _context2.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context2.prev = 26;

          if (!_didIteratorError) {
            _context2.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context2.finish(26);

        case 30:
          return _context2.finish(23);

        case 31:
          console.log('\n' + '='.repeat(60));
          console.log('📊 Summary:');
          results.forEach(function (r) {
            console.log("   ".concat(r.success ? '✅' : '❌', " ").concat(r.name));
          });
          allSuccess = results.every(function (r) {
            return r.success;
          });

          if (allSuccess) {
            console.log('\n🎉 All email servers are operational!');
            process.exit(0);
          } else {
            console.log('\n⚠️ Some servers are offline. Check configuration.');
            process.exit(1);
          }

        case 36:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 19, 23, 31], [24,, 26, 30]]);
})();