#!/usr/bin/env node

/**
 * Security Check Script for SHRIMPTECH
 * Checks for hardcoded credentials before git commit
 */
"use strict";

var fs = require('fs');

var path = require('path');

console.log('🔐 SHRIMPTECH Security Check');
console.log('='.repeat(60));
var sensitivePatterns = [{
  pattern: /aewb\s*xgdn\s*jlfv\s*alcc/gi,
  desc: 'SMTP App Password'
}, {
  pattern: /aewbxgdnjlfvalcc/gi,
  desc: 'SMTP App Password (no spaces)'
}, {
  pattern: /shrimptech\.vhu\.hutech@gmail\.com.*(?:password|pass|pwd)/gi,
  desc: 'Email with password reference'
}, {
  pattern: /SMTP_PASS\s*=\s*['"][a-z0-9]{16}['"]/gi,
  desc: 'Hardcoded SMTP password in quotes'
}, {
  pattern: /pass:\s*['"][a-z0-9]{10,}['"]/gi,
  desc: 'Hardcoded password in object'
}];
var filesToCheck = ['server.js', 'api/contact.js', 'public/api/email-server.js', 'config/production-config.js', 'config/free-email-config.js', 'tests/verify-new-smtp-password.js', 'tests/check-all-email-servers.js', 'scripts/deploy-production-new.js'];
var issuesFound = 0;
var issues = [];
console.log('\n📋 Checking files for sensitive data...\n');
filesToCheck.forEach(function (file) {
  var filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    console.log("\u26A0\uFE0F  File not found: ".concat(file));
    return;
  }

  var content = fs.readFileSync(filePath, 'utf8');
  sensitivePatterns.forEach(function (_ref) {
    var pattern = _ref.pattern,
        desc = _ref.desc;
    var matches = content.match(pattern);

    if (matches && matches.length > 0) {
      issuesFound++;
      var issue = "".concat(file, ": ").concat(desc, " (").concat(matches.length, " occurrence(s))");
      issues.push(issue);
      console.log("\u274C ".concat(file));
      console.log("   Issue: ".concat(desc));
      console.log("   Found: ".concat(matches.length, " occurrence(s)"));
      console.log('');
    }
  });
}); // Check if .env is in .gitignore

console.log('📋 Checking .gitignore...\n');
var gitignorePath = path.join(__dirname, '..', '.gitignore');

if (fs.existsSync(gitignorePath)) {
  var gitignore = fs.readFileSync(gitignorePath, 'utf8');
  var requiredIgnores = ['.env', '*.log', 'deployment-report.json', 'logs/'];
  var missing = requiredIgnores.filter(function (item) {
    return !gitignore.includes(item);
  });

  if (missing.length > 0) {
    issuesFound += missing.length;
    console.log('❌ Missing in .gitignore:');
    missing.forEach(function (item) {
      console.log("   - ".concat(item));
      issues.push(".gitignore: Missing ".concat(item));
    });
    console.log('');
  } else {
    console.log('✅ .gitignore properly configured\n');
  }
} else {
  issuesFound++;
  console.log('❌ .gitignore file not found!\n');
  issues.push('.gitignore: File not found');
} // Check if .env exists and warn


var envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  WARNING: .env file exists');
  console.log('   Make sure it is in .gitignore and not staged for commit\n');
} // Summary


console.log('='.repeat(60));
console.log('📊 Security Check Summary\n');

if (issuesFound === 0) {
  console.log('✅ No security issues found!');
  console.log('✅ Safe to commit to GitHub\n');
  process.exit(0);
} else {
  console.log("\u274C Found ".concat(issuesFound, " potential security issue(s):\n"));
  issues.forEach(function (issue, index) {
    console.log("".concat(index + 1, ". ").concat(issue));
  });
  console.log('\n⚠️  DANGER: Do NOT commit until these issues are resolved!');
  console.log('\n💡 Actions to take:');
  console.log('1. Remove hardcoded credentials from source files');
  console.log('2. Use environment variables (process.env.SMTP_PASS)');
  console.log('3. Add sensitive files to .gitignore');
  console.log('4. Run this script again before committing\n');
  process.exit(1);
}