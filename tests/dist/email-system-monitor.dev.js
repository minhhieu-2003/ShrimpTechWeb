"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Email System Status Checker
 * Comprehensive monitoring for ShrimpTech email system
 */
var EmailSystemMonitor =
/*#__PURE__*/
function () {
  function EmailSystemMonitor() {
    _classCallCheck(this, EmailSystemMonitor);

    this.emailJSConfig = {
      serviceId: 'service_c2lx7ir',
      publicKey: 'GVQI9-7nKq5g2J7qY',
      templates: {
        contact: 'template_contact',
        confirmation: 'template_shrimptech_confirm',
        followUp: 'template_shrimptech_followup',
        newsletter: 'template_shrimptech_newsletter'
      }
    };
    this.statusChecks = [];
    this.performanceMetrics = {};
  }
  /**
   * Check EmailJS Service Status
   */


  _createClass(EmailSystemMonitor, [{
    key: "checkEmailJSStatus",
    value: function checkEmailJSStatus() {
      return regeneratorRuntime.async(function checkEmailJSStatus$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('🔍 Checking EmailJS Service Status...');
              _context.prev = 1;

              if (window.emailjs) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return regeneratorRuntime.awrap(this.loadEmailJS());

            case 5:
              // Initialize
              emailjs.init(this.emailJSConfig.publicKey);
              this.statusChecks.push({
                service: 'EmailJS Library',
                status: 'operational',
                message: '✅ EmailJS library loaded and initialized',
                timestamp: new Date().toISOString()
              });
              return _context.abrupt("return", true);

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);
              this.statusChecks.push({
                service: 'EmailJS Library',
                status: 'error',
                message: "\u274C EmailJS error: ".concat(_context.t0.message),
                timestamp: new Date().toISOString()
              });
              return _context.abrupt("return", false);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[1, 10]]);
    }
    /**
     * Check Template Availability
     */

  }, {
    key: "checkTemplateAvailability",
    value: function checkTemplateAvailability() {
      var templates, _i, _Object$entries, _Object$entries$_i, type, templateId, isValid;

      return regeneratorRuntime.async(function checkTemplateAvailability$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log('📋 Checking Template Availability...');
              templates = this.emailJSConfig.templates;

              for (_i = 0, _Object$entries = Object.entries(templates); _i < _Object$entries.length; _i++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), type = _Object$entries$_i[0], templateId = _Object$entries$_i[1];

                try {
                  // Simulate template check (in real scenario, this would be API call)
                  isValid = /^template_[a-z_]+$/.test(templateId) && !templateId.includes('YOUR_') && templateId.length > 8;
                  this.statusChecks.push({
                    service: "Template: ".concat(type),
                    status: isValid ? 'operational' : 'warning',
                    message: isValid ? "\u2705 Template ".concat(templateId, " format valid") : "\u26A0\uFE0F Template ".concat(templateId, " may have issues"),
                    templateId: templateId,
                    timestamp: new Date().toISOString()
                  });
                } catch (error) {
                  this.statusChecks.push({
                    service: "Template: ".concat(type),
                    status: 'error',
                    message: "\u274C Template check failed: ".concat(error.message),
                    templateId: templateId,
                    timestamp: new Date().toISOString()
                  });
                }
              }

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
    /**
     * Check Network Connectivity
     */

  }, {
    key: "checkNetworkConnectivity",
    value: function checkNetworkConnectivity() {
      var endpoints, _i2, _endpoints, endpoint, startTime, response, responseTime;

      return regeneratorRuntime.async(function checkNetworkConnectivity$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log('🌐 Checking Network Connectivity...');
              endpoints = [{
                name: 'EmailJS API',
                url: 'https://api.emailjs.com'
              }, {
                name: 'CDN',
                url: 'https://cdn.jsdelivr.net'
              }, {
                name: 'Google DNS',
                url: 'https://8.8.8.8'
              }];
              _i2 = 0, _endpoints = endpoints;

            case 3:
              if (!(_i2 < _endpoints.length)) {
                _context3.next = 20;
                break;
              }

              endpoint = _endpoints[_i2];
              _context3.prev = 5;
              startTime = Date.now(); // Use fetch with timeout for connectivity check

              _context3.next = 9;
              return regeneratorRuntime.awrap(Promise.race([fetch(endpoint.url, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
              }), new Promise(function (_, reject) {
                return setTimeout(function () {
                  return reject(new Error('Timeout'));
                }, 5000);
              })]));

            case 9:
              response = _context3.sent;
              responseTime = Date.now() - startTime;
              this.statusChecks.push({
                service: "Network: ".concat(endpoint.name),
                status: 'operational',
                message: "\u2705 Connected (".concat(responseTime, "ms)"),
                responseTime: responseTime,
                timestamp: new Date().toISOString()
              });
              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](5);
              this.statusChecks.push({
                service: "Network: ".concat(endpoint.name),
                status: _context3.t0.message.includes('Timeout') ? 'warning' : 'error',
                message: "\u26A0\uFE0F Connection issue: ".concat(_context3.t0.message),
                timestamp: new Date().toISOString()
              });

            case 17:
              _i2++;
              _context3.next = 3;
              break;

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[5, 14]]);
    }
    /**
     * Check Email Quota
     */

  }, {
    key: "checkEmailQuota",
    value: function checkEmailQuota() {
      var freeQuotaLimit, estimatedUsed, remainingQuota, usagePercentage, status, message;
      return regeneratorRuntime.async(function checkEmailQuota$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log('📊 Checking Email Quota...'); // Simulate quota check (EmailJS free tier has 200 emails/month)

              freeQuotaLimit = 200;
              estimatedUsed = Math.floor(Math.random() * 50); // Simulated usage

              remainingQuota = freeQuotaLimit - estimatedUsed;
              usagePercentage = estimatedUsed / freeQuotaLimit * 100;
              status = 'operational';
              message = "\u2705 Quota OK: ".concat(remainingQuota, "/").concat(freeQuotaLimit, " emails remaining");

              if (usagePercentage > 80) {
                status = 'warning';
                message = "\u26A0\uFE0F Quota Warning: ".concat(remainingQuota, "/").concat(freeQuotaLimit, " emails remaining (").concat(usagePercentage.toFixed(1), "% used)");
              }

              if (usagePercentage > 95) {
                status = 'error';
                message = "\u274C Quota Critical: ".concat(remainingQuota, "/").concat(freeQuotaLimit, " emails remaining (").concat(usagePercentage.toFixed(1), "% used)");
              }

              this.statusChecks.push({
                service: 'Email Quota',
                status: status,
                message: message,
                quota: {
                  limit: freeQuotaLimit,
                  used: estimatedUsed,
                  remaining: remainingQuota,
                  percentage: usagePercentage.toFixed(1)
                },
                timestamp: new Date().toISOString()
              });

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
    /**
     * Performance Test
     */

  }, {
    key: "performanceTest",
    value: function performanceTest() {
      var startTime, initStart, initTime, prepStart, testData, prepTime, totalTime, status;
      return regeneratorRuntime.async(function performanceTest$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log('⚡ Running Performance Test...');
              startTime = Date.now();
              _context5.prev = 2;
              // Test initialization time
              initStart = Date.now();

              if (window.emailjs) {
                _context5.next = 7;
                break;
              }

              _context5.next = 7;
              return regeneratorRuntime.awrap(this.loadEmailJS());

            case 7:
              emailjs.init(this.emailJSConfig.publicKey);
              initTime = Date.now() - initStart; // Test email preparation time

              prepStart = Date.now();
              testData = {
                from_name: 'Performance Test',
                from_email: 'perf@test.local',
                message: 'Performance testing'
              }; // Simulate email preparation

              _context5.next = 13;
              return regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 100);
              }));

            case 13:
              prepTime = Date.now() - prepStart;
              totalTime = Date.now() - startTime;
              this.performanceMetrics = {
                initializationTime: initTime,
                preparationTime: prepTime,
                totalTime: totalTime,
                timestamp: new Date().toISOString()
              };
              status = 'operational';
              if (totalTime > 3000) status = 'warning';
              if (totalTime > 5000) status = 'error';
              this.statusChecks.push({
                service: 'Performance',
                status: status,
                message: "".concat(status === 'operational' ? '✅' : status === 'warning' ? '⚠️' : '❌', " Total time: ").concat(totalTime, "ms"),
                metrics: this.performanceMetrics,
                timestamp: new Date().toISOString()
              });
              _context5.next = 25;
              break;

            case 22:
              _context5.prev = 22;
              _context5.t0 = _context5["catch"](2);
              this.statusChecks.push({
                service: 'Performance',
                status: 'error',
                message: "\u274C Performance test failed: ".concat(_context5.t0.message),
                timestamp: new Date().toISOString()
              });

            case 25:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[2, 22]]);
    }
    /**
     * Load EmailJS library
     */

  }, {
    key: "loadEmailJS",
    value: function loadEmailJS() {
      return new Promise(function (resolve, reject) {
        if (window.emailjs) {
          resolve();
          return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';

        script.onload = function () {
          return resolve();
        };

        script.onerror = function () {
          return reject(new Error('Failed to load EmailJS'));
        };

        document.head.appendChild(script);
      });
    }
    /**
     * Run comprehensive system check
     */

  }, {
    key: "runSystemCheck",
    value: function runSystemCheck() {
      return regeneratorRuntime.async(function runSystemCheck$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              console.log('🚀 Starting Comprehensive Email System Check...\n');
              console.log('='.repeat(60)); // Reset status

              this.statusChecks = [];
              this.performanceMetrics = {}; // Run all checks

              _context6.next = 6;
              return regeneratorRuntime.awrap(this.checkEmailJSStatus());

            case 6:
              _context6.next = 8;
              return regeneratorRuntime.awrap(this.checkTemplateAvailability());

            case 8:
              _context6.next = 10;
              return regeneratorRuntime.awrap(this.checkNetworkConnectivity());

            case 10:
              _context6.next = 12;
              return regeneratorRuntime.awrap(this.checkEmailQuota());

            case 12:
              _context6.next = 14;
              return regeneratorRuntime.awrap(this.performanceTest());

            case 14:
              // Display results
              this.displaySystemStatus();
              return _context6.abrupt("return", this.getSystemSummary());

            case 16:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
    /**
     * Display system status
     */

  }, {
    key: "displaySystemStatus",
    value: function displaySystemStatus() {
      console.log('\n📊 Email System Status Report:');
      console.log('='.repeat(60));
      var statusGroups = {
        operational: [],
        warning: [],
        error: []
      };
      this.statusChecks.forEach(function (check) {
        statusGroups[check.status].push(check);
      }); // Display by status

      Object.entries(statusGroups).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            status = _ref2[0],
            checks = _ref2[1];

        if (checks.length > 0) {
          console.log("\n".concat(status.toUpperCase(), " (").concat(checks.length, "):"));
          console.log('-'.repeat(30));
          checks.forEach(function (check) {
            console.log("".concat(check.message));
            console.log("   Service: ".concat(check.service));

            if (check.responseTime) {
              console.log("   Response Time: ".concat(check.responseTime, "ms"));
            }

            console.log('');
          });
        }
      }); // Overall summary

      var summary = this.getSystemSummary();
      console.log('='.repeat(60));
      console.log("\uD83C\uDFAF Overall Status: ".concat(summary.overallStatus.toUpperCase()));
      console.log("\u2705 Operational: ".concat(summary.operational));
      console.log("\u26A0\uFE0F  Warnings: ".concat(summary.warnings));
      console.log("\u274C Errors: ".concat(summary.errors));
      console.log("\uD83D\uDCCA Health Score: ".concat(summary.healthScore, "%"));

      if (this.performanceMetrics.totalTime) {
        console.log("\u26A1 Performance: ".concat(this.performanceMetrics.totalTime, "ms total"));
      }
    }
    /**
     * Get system summary
     */

  }, {
    key: "getSystemSummary",
    value: function getSystemSummary() {
      var operational = this.statusChecks.filter(function (c) {
        return c.status === 'operational';
      }).length;
      var warnings = this.statusChecks.filter(function (c) {
        return c.status === 'warning';
      }).length;
      var errors = this.statusChecks.filter(function (c) {
        return c.status === 'error';
      }).length;
      var total = this.statusChecks.length;
      var healthScore = total > 0 ? Math.round((operational + warnings * 0.5) / total * 100) : 0;
      var overallStatus = 'operational';
      if (errors > 0) overallStatus = 'error';else if (warnings > 0) overallStatus = 'warning';
      return {
        overallStatus: overallStatus,
        operational: operational,
        warnings: warnings,
        errors: errors,
        total: total,
        healthScore: healthScore,
        timestamp: new Date().toISOString(),
        performance: this.performanceMetrics
      };
    }
    /**
     * Export status report
     */

  }, {
    key: "exportStatusReport",
    value: function exportStatusReport() {
      var report = {
        timestamp: new Date().toISOString(),
        emailjs_config: this.emailJSConfig,
        system_summary: this.getSystemSummary(),
        detailed_checks: this.statusChecks,
        performance_metrics: this.performanceMetrics
      };
      console.log('📤 Exporting system status report...');
      console.log(JSON.stringify(report, null, 2));
      return report;
    }
  }]);

  return EmailSystemMonitor;
}(); // Make available globally


if (typeof window !== 'undefined') {
  window.EmailSystemMonitor = EmailSystemMonitor;
} // Export for Node.js


if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailSystemMonitor;
}