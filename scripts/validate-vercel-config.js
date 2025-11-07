/**
 * Script to validate Vercel configuration before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SHRIMPTECH - Vercel Configuration Validator\n');
console.log('='.repeat(60));

const issues = [];
const warnings = [];
const success = [];

// 1. Check vercel.json exists and is valid
console.log('\n📝 Checking vercel.json...');
const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');

if (!fs.existsSync(vercelConfigPath)) {
    issues.push('vercel.json not found!');
} else {
    try {
        const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        
        // Check builds
        if (!config.builds || config.builds.length === 0) {
            issues.push('No builds configured in vercel.json');
        } else {
            success.push('✅ Builds configured');
        }
        
        // Check routes
        if (!config.routes || config.routes.length === 0) {
            warnings.push('No routes configured in vercel.json');
        } else {
            success.push('✅ Routes configured');
        }
        
        // Check for static build
        const hasStaticBuild = config.builds.some(b => b.use === '@vercel/static');
        if (hasStaticBuild) {
            success.push('✅ Static files build configured');
        } else {
            warnings.push('No @vercel/static build found - static files might not be served');
        }
        
    } catch (error) {
        issues.push(`vercel.json is invalid JSON: ${error.message}`);
    }
}

// 2. Check public folder exists
console.log('\n📁 Checking public folder...');
const publicPath = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicPath)) {
    issues.push('public/ folder not found!');
} else {
    success.push('✅ public/ folder exists');
    
    // Check index.html
    const indexPath = path.join(publicPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        issues.push('public/index.html not found!');
    } else {
        success.push('✅ public/index.html exists');
    }
    
    // Check critical files
    const criticalFiles = ['styles.css', '404.html'];
    criticalFiles.forEach(file => {
        if (fs.existsSync(path.join(publicPath, file))) {
            success.push(`✅ public/${file} exists`);
        } else {
            warnings.push(`public/${file} not found`);
        }
    });
}

// 3. Check .vercelignore
console.log('\n🚫 Checking .vercelignore...');
const vercelIgnorePath = path.join(__dirname, '..', '.vercelignore');

if (fs.existsSync(vercelIgnorePath)) {
    const ignoreContent = fs.readFileSync(vercelIgnorePath, 'utf8');
    
    // Should NOT ignore public/
    if (ignoreContent.includes('public/')) {
        issues.push('.vercelignore is ignoring public/ folder!');
    } else {
        success.push('✅ public/ folder is NOT ignored');
    }
    
    // Should ignore .env
    if (ignoreContent.includes('.env')) {
        success.push('✅ .env files are ignored');
    } else {
        warnings.push('.env files are NOT ignored in .vercelignore');
    }
} else {
    warnings.push('.vercelignore not found (optional)');
}

// 4. Check server.js
console.log('\n🖥️  Checking server.js...');
const serverPath = path.join(__dirname, '..', 'server.js');

if (!fs.existsSync(serverPath)) {
    issues.push('server.js not found!');
} else {
    success.push('✅ server.js exists');
    
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Check for module.exports
    if (!serverContent.includes('module.exports')) {
        issues.push('server.js does not export app (needed for Vercel)');
    } else {
        success.push('✅ server.js exports app');
    }
    
    // Check for Vercel detection
    if (serverContent.includes('process.env.VERCEL')) {
        success.push('✅ Vercel environment detection present');
    } else {
        warnings.push('No Vercel environment detection in server.js');
    }
}

// 5. Check package.json
console.log('\n📦 Checking package.json...');
const packagePath = path.join(__dirname, '..', 'package.json');

if (!fs.existsSync(packagePath)) {
    issues.push('package.json not found!');
} else {
    try {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        // Check dependencies
        const requiredDeps = ['express', 'nodemailer', 'cors', 'helmet', 'dotenv'];
        const missingDeps = requiredDeps.filter(dep => !pkg.dependencies || !pkg.dependencies[dep]);
        
        if (missingDeps.length > 0) {
            issues.push(`Missing dependencies: ${missingDeps.join(', ')}`);
        } else {
            success.push('✅ All required dependencies present');
        }
        
        // Check engines
        if (pkg.engines && pkg.engines.node) {
            success.push(`✅ Node engine specified: ${pkg.engines.node}`);
        } else {
            warnings.push('No Node.js engine specified in package.json');
        }
        
    } catch (error) {
        issues.push(`package.json is invalid JSON: ${error.message}`);
    }
}

// 6. Check .env.example
console.log('\n📋 Checking .env.example...');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envExamplePath)) {
    warnings.push('.env.example not found (optional but recommended)');
} else {
    success.push('✅ .env.example exists');
    
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    const requiredVars = ['SMTP_USER', 'SMTP_PASS', 'SMTP_HOST', 'SMTP_PORT'];
    
    requiredVars.forEach(varName => {
        if (!envContent.includes(varName)) {
            warnings.push(`${varName} not in .env.example`);
        }
    });
}

// 7. Check API folder structure
console.log('\n🔌 Checking API folder...');
const apiPath = path.join(__dirname, '..', 'api');

if (!fs.existsSync(apiPath)) {
    warnings.push('api/ folder not found (optional)');
} else {
    success.push('✅ api/ folder exists');
    
    const indexJsPath = path.join(apiPath, 'index.js');
    if (fs.existsSync(indexJsPath)) {
        success.push('✅ api/index.js exists');
    } else {
        warnings.push('api/index.js not found (recommended for Vercel)');
    }
}

// Display Results
console.log('\n' + '='.repeat(60));
console.log('VALIDATION RESULTS');
console.log('='.repeat(60));

if (success.length > 0) {
    console.log('\n✅ SUCCESS:');
    success.forEach(s => console.log(`   ${s}`));
}

if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   ⚠️  ${w}`));
}

if (issues.length > 0) {
    console.log('\n❌ CRITICAL ISSUES:');
    issues.forEach(i => console.log(`   ❌ ${i}`));
}

console.log('\n' + '='.repeat(60));
console.log(`Total: ${success.length} passed, ${warnings.length} warnings, ${issues.length} critical`);
console.log('='.repeat(60) + '\n');

if (issues.length > 0) {
    console.log('⛔ FIX CRITICAL ISSUES BEFORE DEPLOYING TO VERCEL!\n');
    process.exit(1);
} else if (warnings.length > 0) {
    console.log('⚠️  Review warnings, but deployment should work.\n');
    process.exit(0);
} else {
    console.log('✅ All checks passed! Ready to deploy to Vercel.\n');
    console.log('Next steps:');
    console.log('  1. Set environment variables on Vercel dashboard');
    console.log('  2. git push origin main');
    console.log('  3. Check deployment logs on Vercel\n');
    process.exit(0);
}
