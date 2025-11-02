/**
 * Production Build Script for SHRIMPTECH
 * Chuẩn bị các file static cho production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  SHRIMPTECH Production Build Starting...');

// Configuration
const BUILD_CONFIG = {
    sourceDir: path.join(__dirname, '..', 'public'),
    buildDir: path.join(__dirname, '..', 'dist'),
    serverFile: path.join(__dirname, '..', 'server.js'),
    configDir: path.join(__dirname, '..', 'config'),
    envFile: path.join(__dirname, '..', '.env')
};

/**
 * Create build directory
 */
function createBuildDirectory() {
    console.log('📁 Creating build directory...');
    
    if (fs.existsSync(BUILD_CONFIG.buildDir)) {
        fs.rmSync(BUILD_CONFIG.buildDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(BUILD_CONFIG.buildDir, { recursive: true });
    console.log('✅ Build directory created');
}

/**
 * Copy static files
 */
function copyStaticFiles() {
    console.log('📋 Copying static files...');
    
    // Copy public directory
    execSync(`xcopy "${BUILD_CONFIG.sourceDir}" "${BUILD_CONFIG.buildDir}\\public\\" /E /I /Y`, { stdio: 'inherit' });
    
    // Copy server files
    fs.copyFileSync(BUILD_CONFIG.serverFile, path.join(BUILD_CONFIG.buildDir, 'server.js'));
    
    // Copy config directory
    if (fs.existsSync(BUILD_CONFIG.configDir)) {
        execSync(`xcopy "${BUILD_CONFIG.configDir}" "${BUILD_CONFIG.buildDir}\\config\\" /E /I /Y`, { stdio: 'inherit' });
    }
    
    // Copy package.json
    fs.copyFileSync(path.join(__dirname, '..', 'package.json'), path.join(BUILD_CONFIG.buildDir, 'package.json'));
    
    console.log('✅ Static files copied');
}

/**
 * Create production environment file
 */
function createProductionEnv() {
    console.log('⚙️  Creating production environment file...');
    
    const productionEnv = `# SHRIMPTECH Production Environment
NODE_ENV=production
PORT=3001

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password-here

# Gmail Configuration
GMAIL_USER=your-email@example.com
GMAIL_APP_PASSWORD=your-app-password-here

# Production Domain
PRODUCTION_DOMAIN=shrimptech.vn
PRODUCTION_PROTOCOL=https
API_BASE_URL=/api

# Contact Email
CONTACT_EMAIL=your-email@example.com
FROM_EMAIL=your-email@example.com

# CORS Origins
CORS_ORIGIN=https://shrimptech.vn,https://www.shrimptech.vn,https://shrimptech-c6e93.web.app
`;
    
    fs.writeFileSync(path.join(BUILD_CONFIG.buildDir, '.env'), productionEnv);
    console.log('✅ Production environment file created');
}

/**
 * Optimize static assets
 */
function optimizeAssets() {
    console.log('🚀 Optimizing static assets...');
    
    // Remove localhost references from JavaScript files
    const jsFiles = [
        'public/js/email-service.js',
        'public/js/form-handler.js', 
        'public/js/backend-handler.js',
        'public/js/auto-email-storage.js'
    ];
    
    jsFiles.forEach(file => {
        const filePath = path.join(BUILD_CONFIG.buildDir, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace localhost references
            content = content.replace(/localhost:3001/g, 'shrimptech.vn');
            content = content.replace(/http:\/\/localhost:3001/g, 'https://shrimptech.vn');
            content = content.replace(/127\.0\.0\.1:3001/g, 'shrimptech.vn');
            content = content.replace(/http:\/\/127\.0\.0\.1:3001/g, 'https://shrimptech.vn');
            
            // Force production mode
            content = content.replace(/isProduction\s*=\s*false/g, 'isProduction = true');
            content = content.replace(/\.isProduction\s*=\s*false/g, '.isProduction = true');
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ Optimized: ${file}`);
        }
    });
    
    // Add cache headers to HTML files
    const htmlFiles = [
        'public/index.html',
        'public/pages/contact.html',
        'public/pages/team.html',
        'public/pages/solutions.html',
        'public/pages/products.html',
        'public/pages/partners.html'
    ];
    
    htmlFiles.forEach(file => {
        const fullPath = path.join(BUILD_CONFIG.buildDir, file);
        if (fs.existsSync(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Add meta tags for caching
            const metaTags = `    <meta http-equiv="Cache-Control" content="public, max-age=3600">
    <meta http-equiv="Expires" content="3600">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">`;
            
            content = content.replace('<meta name="viewport"', metaTags + '\n    <meta name="viewport"');
            fs.writeFileSync(fullPath, content);
        }
    });
    
    console.log('✅ Assets optimized');
}

/**
 * Create deployment info
 */
function createDeploymentInfo() {
    console.log('📝 Creating deployment info...');
    
    const deploymentInfo = {
        buildTime: new Date().toISOString(),
        version: require('../package.json').version,
        nodeVersion: process.version,
        environment: 'production',
        domain: 'shrimptech.vn',
        apiEndpoints: [
            '/api/contact',
            '/api/newsletter',
            '/api/status',
            '/api/health'
        ]
    };
    
    fs.writeFileSync(
        path.join(BUILD_CONFIG.buildDir, 'deployment-info.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('✅ Deployment info created');
}

/**
 * Main build function
 */
function main() {
    try {
        console.log('🚀 Starting SHRIMPTECH production build...\n');
        
        createBuildDirectory();
        copyStaticFiles();
        createProductionEnv();
        optimizeAssets();
        createDeploymentInfo();
        
        console.log('\n🎉 Production build completed successfully!');
        console.log(`📦 Build output: ${BUILD_CONFIG.buildDir}`);
        console.log('\nNext steps:');
        console.log('1. Upload dist/ folder to your server');
        console.log('2. Run: npm install --production');
        console.log('3. Run: npm start');
        console.log('4. Configure reverse proxy (Nginx/Apache)');
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };