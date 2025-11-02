"use strict";

/**
 * Production Build Script for SHRIMPTECH
 * Chuẩn bị các file static cho production deployment
 */
var fs = require('fs');

var path = require('path');

var _require = require('child_process'),
    execSync = _require.execSync;

console.log('🏗️  SHRIMPTECH Production Build Starting...'); // Configuration

var BUILD_CONFIG = {
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
    fs.rmSync(BUILD_CONFIG.buildDir, {
      recursive: true,
      force: true
    });
  }

  fs.mkdirSync(BUILD_CONFIG.buildDir, {
    recursive: true
  });
  console.log('✅ Build directory created');
}
/**
 * Copy static files
 */


function copyStaticFiles() {
  console.log('📋 Copying static files...'); // Copy public directory

  execSync("xcopy \"".concat(BUILD_CONFIG.sourceDir, "\" \"").concat(BUILD_CONFIG.buildDir, "\\public\\\" /E /I /Y"), {
    stdio: 'inherit'
  }); // Copy server files

  fs.copyFileSync(BUILD_CONFIG.serverFile, path.join(BUILD_CONFIG.buildDir, 'server.js')); // Copy config directory

  if (fs.existsSync(BUILD_CONFIG.configDir)) {
    execSync("xcopy \"".concat(BUILD_CONFIG.configDir, "\" \"").concat(BUILD_CONFIG.buildDir, "\\config\\\" /E /I /Y"), {
      stdio: 'inherit'
    });
  } // Copy package.json


  fs.copyFileSync(path.join(__dirname, '..', 'package.json'), path.join(BUILD_CONFIG.buildDir, 'package.json'));
  console.log('✅ Static files copied');
}
/**
 * Create production environment file
 */


function createProductionEnv() {
  console.log('⚙️  Creating production environment file...');
  var productionEnv = "# SHRIMPTECH Production Environment\nNODE_ENV=production\nPORT=3001\n\n# SMTP Configuration\nSMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_SECURE=false\nSMTP_USER=your-email@example.com\nSMTP_PASS=your-app-password-here\n\n# Gmail Configuration\nGMAIL_USER=your-email@example.com\nGMAIL_APP_PASSWORD=your-app-password-here\n\n# Production Domain\nPRODUCTION_DOMAIN=shrimptech.vn\nPRODUCTION_PROTOCOL=https\nAPI_BASE_URL=/api\n\n# Contact Email\nCONTACT_EMAIL=your-email@example.com\nFROM_EMAIL=your-email@example.com\n\n# CORS Origins\nCORS_ORIGIN=https://shrimptech.vn,https://www.shrimptech.vn,https://shrimptech-c6e93.web.app\n";
  fs.writeFileSync(path.join(BUILD_CONFIG.buildDir, '.env'), productionEnv);
  console.log('✅ Production environment file created');
}
/**
 * Optimize static assets
 */


function optimizeAssets() {
  console.log('🚀 Optimizing static assets...'); // Remove localhost references from JavaScript files

  var jsFiles = ['public/js/email-service.js', 'public/js/form-handler.js', 'public/js/backend-handler.js', 'public/js/auto-email-storage.js'];
  jsFiles.forEach(function (file) {
    var filePath = path.join(BUILD_CONFIG.buildDir, file);

    if (fs.existsSync(filePath)) {
      var content = fs.readFileSync(filePath, 'utf8'); // Replace localhost references

      content = content.replace(/localhost:3001/g, 'shrimptech.vn');
      content = content.replace(/http:\/\/localhost:3001/g, 'https://shrimptech.vn');
      content = content.replace(/127\.0\.0\.1:3001/g, 'shrimptech.vn');
      content = content.replace(/http:\/\/127\.0\.0\.1:3001/g, 'https://shrimptech.vn'); // Force production mode

      content = content.replace(/isProduction\s*=\s*false/g, 'isProduction = true');
      content = content.replace(/\.isProduction\s*=\s*false/g, '.isProduction = true');
      fs.writeFileSync(filePath, content);
      console.log("\u2705 Optimized: ".concat(file));
    }
  }); // Add cache headers to HTML files

  var htmlFiles = ['public/index.html', 'public/pages/contact.html', 'public/pages/team.html', 'public/pages/solutions.html', 'public/pages/products.html', 'public/pages/partners.html'];
  htmlFiles.forEach(function (file) {
    var fullPath = path.join(BUILD_CONFIG.buildDir, file);

    if (fs.existsSync(fullPath)) {
      var content = fs.readFileSync(fullPath, 'utf8'); // Add meta tags for caching

      var metaTags = "    <meta http-equiv=\"Cache-Control\" content=\"public, max-age=3600\">\n    <meta http-equiv=\"Expires\" content=\"3600\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, shrink-to-fit=no\">";
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
  var deploymentInfo = {
    buildTime: new Date().toISOString(),
    version: require('../package.json').version,
    nodeVersion: process.version,
    environment: 'production',
    domain: 'shrimptech.vn',
    apiEndpoints: ['/api/contact', '/api/newsletter', '/api/status', '/api/health']
  };
  fs.writeFileSync(path.join(BUILD_CONFIG.buildDir, 'deployment-info.json'), JSON.stringify(deploymentInfo, null, 2));
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
    console.log("\uD83D\uDCE6 Build output: ".concat(BUILD_CONFIG.buildDir));
    console.log('\nNext steps:');
    console.log('1. Upload dist/ folder to your server');
    console.log('2. Run: npm install --production');
    console.log('3. Run: npm start');
    console.log('4. Configure reverse proxy (Nginx/Apache)');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} // Run if called directly


if (require.main === module) {
  main();
}

module.exports = {
  main: main
};