#!/usr/bin/env node
/**
 * Security Check Script for SHRIMPTECH
 * Checks for hardcoded credentials before git commit
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 SHRIMPTECH Security Check');
console.log('='.repeat(60));

const sensitivePatterns = [
    { pattern: /aewb\s*xgdn\s*jlfv\s*alcc/gi, desc: 'SMTP App Password' },
    { pattern: /aewbxgdnjlfvalcc/gi, desc: 'SMTP App Password (no spaces)' },
    { pattern: /shrimptech\.vhu\.hutech@gmail\.com.*(?:password|pass|pwd)/gi, desc: 'Email with password reference' },
    { pattern: /SMTP_PASS\s*=\s*['"][a-z0-9]{16}['"]/gi, desc: 'Hardcoded SMTP password in quotes' },
    { pattern: /pass:\s*['"][a-z0-9]{10,}['"]/gi, desc: 'Hardcoded password in object' }
];

const filesToCheck = [
    'server.js',
    'api/contact.js',
    'public/api/email-server.js',
    'config/production-config.js',
    'config/free-email-config.js',
    'tests/verify-new-smtp-password.js',
    'tests/check-all-email-servers.js',
    'scripts/deploy-production-new.js'
];

let issuesFound = 0;
const issues = [];

console.log('\n📋 Checking files for sensitive data...\n');

filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    sensitivePatterns.forEach(({ pattern, desc }) => {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            issuesFound++;
            const issue = `${file}: ${desc} (${matches.length} occurrence(s))`;
            issues.push(issue);
            console.log(`❌ ${file}`);
            console.log(`   Issue: ${desc}`);
            console.log(`   Found: ${matches.length} occurrence(s)`);
            console.log('');
        }
    });
});

// Check if .env is in .gitignore
console.log('📋 Checking .gitignore...\n');
const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    
    const requiredIgnores = ['.env', '*.log', 'deployment-report.json', 'logs/'];
    const missing = requiredIgnores.filter(item => !gitignore.includes(item));
    
    if (missing.length > 0) {
        issuesFound += missing.length;
        console.log('❌ Missing in .gitignore:');
        missing.forEach(item => {
            console.log(`   - ${item}`);
            issues.push(`.gitignore: Missing ${item}`);
        });
        console.log('');
    } else {
        console.log('✅ .gitignore properly configured\n');
    }
} else {
    issuesFound++;
    console.log('❌ .gitignore file not found!\n');
    issues.push('.gitignore: File not found');
}

// Check if .env exists and warn
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  WARNING: .env file exists');
    console.log('   Make sure it is in .gitignore and not staged for commit\n');
}

// Summary
console.log('='.repeat(60));
console.log('📊 Security Check Summary\n');

if (issuesFound === 0) {
    console.log('✅ No security issues found!');
    console.log('✅ Safe to commit to GitHub\n');
    process.exit(0);
} else {
    console.log(`❌ Found ${issuesFound} potential security issue(s):\n`);
    issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
    });
    console.log('\n⚠️  DANGER: Do NOT commit until these issues are resolved!');
    console.log('\n💡 Actions to take:');
    console.log('1. Remove hardcoded credentials from source files');
    console.log('2. Use environment variables (process.env.SMTP_PASS)');
    console.log('3. Add sensitive files to .gitignore');
    console.log('4. Run this script again before committing\n');
    process.exit(1);
}
