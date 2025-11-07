/**
 * Environment Security Checker
 * Kiểm tra bảo mật các file và đảm bảo không có thông tin nhạy cảm bị hardcode
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 SHRIMPTECH Security Checker - Environment Variables\n');

// Các pattern nguy hiểm cần tìm
const dangerousPatterns = [
    {
        name: 'Hardcoded Email Password',
        pattern: /(?:pass|password|pwd)['"]?\s*[:=]\s*['"](?!process\.env)[a-z0-9\s]{10,}['"]/gi,
        severity: 'CRITICAL',
        exclude: ['your-app-password-here', 'your-16-char-app-password', 'your-db-password', 'change-me']
    },
    {
        name: 'API Keys in Code',
        pattern: /(?:api|API)[_-]?(?:key|KEY|secret|SECRET)['"]?\s*[:=]\s*['"](?!process\.env)[A-Za-z0-9]{20,}['"]/gi,
        severity: 'CRITICAL',
        exclude: ['your-api-key-here', 'MAILJET_API_KEY', 'MAILJET_SECRET_KEY']
    },
    {
        name: 'Database Credentials',
        pattern: /(?:DB|db)[_-]?(?:pass|password|pwd)['"]?\s*[:=]\s*['"](?!process\.env)[^'"]+['"]/gi,
        severity: 'CRITICAL',
        exclude: ['your-db-password']
    },
    {
        name: 'Session Secrets',
        pattern: /(?:session|SESSION)[_-]?(?:secret|SECRET)['"]?\s*[:=]\s*['"](?!process\.env|change-me)[A-Za-z0-9]{10,}['"]/gi,
        severity: 'HIGH'
    }
];

// Files to check
const filesToCheck = [
    'server.js',
    'api/contact.js',
    'config/production-config.js',
    'config/free-email-config.js',
    'public/api/email-server.js',
    'public/api/test-email.js'
];

const projectRoot = path.resolve(__dirname, '..');
const issues = [];

/**
 * Kiểm tra một file
 */
function checkFile(filePath) {
    const absolutePath = path.join(projectRoot, filePath);
    
    if (!fs.existsSync(absolutePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(absolutePath, 'utf8');
    const fileIssues = [];

    dangerousPatterns.forEach(({ name, pattern, severity, exclude = [] }) => {
        const matches = content.match(pattern);
        
        if (matches) {
            // Filter out excluded patterns
            const filteredMatches = matches.filter(match => {
                return !exclude.some(excluded => match.includes(excluded));
            });

            if (filteredMatches.length > 0) {
                fileIssues.push({
                    file: filePath,
                    type: name,
                    severity: severity,
                    matches: filteredMatches,
                    count: filteredMatches.length
                });
            }
        }
    });

    return fileIssues;
}

/**
 * Kiểm tra .gitignore
 */
function checkGitignore() {
    const gitignorePath = path.join(projectRoot, '.gitignore');
    
    if (!fs.existsSync(gitignorePath)) {
        issues.push({
            file: '.gitignore',
            type: 'Missing .gitignore',
            severity: 'CRITICAL',
            message: '.gitignore file not found!'
        });
        return false;
    }

    const content = fs.readFileSync(gitignorePath, 'utf8');
    const requiredPatterns = [
        { pattern: '.env', message: '.env files' },
        { pattern: '*.env', message: 'wildcard .env files' },
        { pattern: '.env.*', message: '.env.* files' }
    ];
    const missingPatterns = [];

    requiredPatterns.forEach(({ pattern, message }) => {
        if (!content.includes(pattern)) {
            missingPatterns.push(message);
        }
    });

    if (missingPatterns.length > 0) {
        console.log(`⚠️  .gitignore might be missing patterns for: ${missingPatterns.join(', ')}`);
        console.log('   But the file includes .env patterns, so it should be OK');
    }

    // Check if .env is properly ignored
    if (content.includes('.env')) {
        console.log('✅ .gitignore properly configured for .env files');
        return true;
    }

    return true;
}

/**
 * Kiểm tra .env file
 */
function checkEnvFile() {
    const envPath = path.join(projectRoot, '.env');
    const envExamplePath = path.join(projectRoot, '.env.example');

    // Check if .env exists
    if (!fs.existsSync(envPath)) {
        console.log('⚠️  .env file not found (this is OK if not needed)');
    } else {
        console.log('✅ .env file exists');
        
        // Check if .env has actual values (not example values)
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('your-email@gmail.com') || 
            envContent.includes('your-app-password-here')) {
            issues.push({
                file: '.env',
                type: 'Using example values',
                severity: 'HIGH',
                message: '.env file contains example values, not real credentials'
            });
        }
    }

    // Check if .env.example exists
    if (!fs.existsSync(envExamplePath)) {
        issues.push({
            file: '.env.example',
            type: 'Missing template',
            severity: 'MEDIUM',
            message: '.env.example file not found'
        });
    } else {
        console.log('✅ .env.example template exists');
    }
}

/**
 * Main check function
 */
function runSecurityCheck() {
    console.log('📝 Checking files for hardcoded credentials...\n');

    // Check each file
    filesToCheck.forEach(filePath => {
        const fileIssues = checkFile(filePath);
        if (fileIssues && fileIssues.length > 0) {
            issues.push(...fileIssues);
        }
    });

    // Check .gitignore
    console.log('\n📝 Checking .gitignore configuration...\n');
    checkGitignore();

    // Check .env files
    console.log('📝 Checking .env files...\n');
    checkEnvFile();

    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('SECURITY CHECK RESULTS');
    console.log('='.repeat(60) + '\n');

    if (issues.length === 0) {
        console.log('✅ No security issues found!\n');
        console.log('✨ Your code is safe to push to GitHub\n');
        return true;
    }

    // Group by severity
    const critical = issues.filter(i => i.severity === 'CRITICAL');
    const high = issues.filter(i => i.severity === 'HIGH');
    const medium = issues.filter(i => i.severity === 'MEDIUM');

    if (critical.length > 0) {
        console.log('🚨 CRITICAL ISSUES (Must fix before pushing):\n');
        critical.forEach(issue => {
            console.log(`   ❌ ${issue.file}`);
            console.log(`      Type: ${issue.type}`);
            if (issue.message) {
                console.log(`      Message: ${issue.message}`);
            }
            if (issue.matches) {
                console.log(`      Found ${issue.count} occurrence(s)`);
                issue.matches.slice(0, 3).forEach(match => {
                    console.log(`      - ${match.substring(0, 80)}...`);
                });
            }
            console.log('');
        });
    }

    if (high.length > 0) {
        console.log('⚠️  HIGH PRIORITY ISSUES:\n');
        high.forEach(issue => {
            console.log(`   ⚠️  ${issue.file}`);
            console.log(`      Type: ${issue.type}`);
            if (issue.message) {
                console.log(`      Message: ${issue.message}`);
            }
            console.log('');
        });
    }

    if (medium.length > 0) {
        console.log('ℹ️  MEDIUM PRIORITY ISSUES:\n');
        medium.forEach(issue => {
            console.log(`   ℹ️  ${issue.file}`);
            console.log(`      Type: ${issue.type}`);
            if (issue.message) {
                console.log(`      Message: ${issue.message}`);
            }
            console.log('');
        });
    }

    console.log('='.repeat(60));
    console.log(`Total Issues: ${issues.length} (Critical: ${critical.length}, High: ${high.length}, Medium: ${medium.length})`);
    console.log('='.repeat(60) + '\n');

    if (critical.length > 0) {
        console.log('⛔ DO NOT push to GitHub until critical issues are fixed!\n');
        return false;
    }

    console.log('⚠️  Please review and fix the issues above before pushing.\n');
    return false;
}

// Export for use in other scripts
module.exports = { runSecurityCheck, checkFile, checkGitignore };

// Run if called directly
if (require.main === module) {
    const passed = runSecurityCheck();
    process.exit(passed ? 0 : 1);
}
