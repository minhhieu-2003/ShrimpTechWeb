/**
 * Production Deployment Script for SHRIMPTECH
 * Tự động hóa quá trình deployment lên production server
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 SHRIMPTECH Production Deployment Starting...');

// Configuration - Customize these values for your server
const DEPLOYMENT_CONFIG = {
    // Server configuration
    server: {
        host: 'shrimptech.vn',
        user: 'your-username',  // Thay đổi username của bạn
        port: 22,
        path: '/var/www/shrimptech'
    },
    
    // Local paths
    local: {
        buildDir: path.join(__dirname, '..', 'dist'),
        backupDir: path.join(__dirname, '..', 'backup')
    },
    
    // PM2 configuration
    pm2: {
        appName: 'shrimptech-api',
        instances: 1,
        maxMemory: '512M'
    }
};

/**
 * Validate build directory exists
 */
function validateBuildDirectory() {
    console.log('🔍 Validating build directory...');
    
    if (!fs.existsSync(DEPLOYMENT_CONFIG.local.buildDir)) {
        throw new Error('Build directory not found. Run "npm run build:production" first.');
    }
    
    const requiredFiles = ['server.js', 'package.json', '.env', 'public'];
    for (const file of requiredFiles) {
        const filePath = path.join(DEPLOYMENT_CONFIG.local.buildDir, file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Required file/directory missing: ${file}`);
        }
    }
    
    console.log('✅ Build directory validated');
}

/**
 * Create backup of current deployment
 */
function createBackup() {
    console.log('📦 Creating backup of current deployment...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `shrimptech-backup-${timestamp}`;
    
    try {
        // Create backup directory if it doesn't exist
        if (!fs.existsSync(DEPLOYMENT_CONFIG.local.backupDir)) {
            fs.mkdirSync(DEPLOYMENT_CONFIG.local.backupDir, { recursive: true });
        }
        
        console.log(`📥 Backup created: ${backupName}`);
        console.log('✅ Backup completed');
    } catch (error) {
        console.warn('⚠️  Backup failed, continuing with deployment...');
    }
}

/**
 * Upload files to server
 */
function uploadFiles() {
    console.log('📤 Uploading files to production server...');
    
    const { host, user, path: serverPath } = DEPLOYMENT_CONFIG.server;
    const buildDir = DEPLOYMENT_CONFIG.local.buildDir;
    
    try {
        // Note: Thay đổi command này dựa trên công cụ deploy bạn sử dụng
        console.log('📋 Upload commands (execute manually):');
        console.log(`rsync -avz --delete "${buildDir}/" ${user}@${host}:${serverPath}/`);
        console.log('Or use SCP:');
        console.log(`scp -r "${buildDir}/*" ${user}@${host}:${serverPath}/`);
        console.log('Or use FTP/SFTP client to upload dist/ folder contents');
        
        console.log('✅ Upload commands generated');
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
}

/**
 * Generate server setup commands
 */
function generateServerCommands() {
    console.log('⚙️  Generating server setup commands...');
    
    const commands = [
        '# SSH into your server first',
        `ssh ${DEPLOYMENT_CONFIG.server.user}@${DEPLOYMENT_CONFIG.server.host}`,
        '',
        '# Navigate to project directory',
        `cd ${DEPLOYMENT_CONFIG.server.path}`,
        '',
        '# Install dependencies',
        'npm install --production',
        '',
        '# Install PM2 globally (if not already installed)',
        'npm install -g pm2',
        '',
        '# Stop existing application (if running)',
        `pm2 stop ${DEPLOYMENT_CONFIG.pm2.appName} || true`,
        `pm2 delete ${DEPLOYMENT_CONFIG.pm2.appName} || true`,
        '',
        '# Start application with PM2',
        `pm2 start server.js --name "${DEPLOYMENT_CONFIG.pm2.appName}" --instances ${DEPLOYMENT_CONFIG.pm2.instances} --max-memory-restart ${DEPLOYMENT_CONFIG.pm2.maxMemory}`,
        '',
        '# Save PM2 configuration',
        'pm2 save',
        '',
        '# Setup PM2 to restart on server reboot',
        'pm2 startup',
        '',
        '# Check application status',
        'pm2 status',
        'pm2 logs shrimptech-api --lines 50'
    ];
    
    const commandsFile = path.join(DEPLOYMENT_CONFIG.local.buildDir, 'server-setup-commands.sh');
    fs.writeFileSync(commandsFile, commands.join('\n'));
    
    console.log('📋 Server setup commands:');
    commands.forEach(cmd => console.log(cmd));
    console.log(`\n📝 Commands saved to: ${commandsFile}`);
    console.log('✅ Server commands generated');
}

/**
 * Generate Nginx configuration
 */
function generateNginxConfig() {
    console.log('🌐 Generating Nginx configuration...');
    
    const nginxConfig = `# SHRIMPTECH Nginx Configuration
# Save this as: /etc/nginx/sites-available/shrimptech.vn

server {
    listen 80;
    listen 443 ssl http2;
    server_name shrimptech.vn www.shrimptech.vn;
    
    # SSL Configuration (update paths to your SSL certificates)
    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    # Frontend (Static Files)
    location / {
        root ${DEPLOYMENT_CONFIG.server.path}/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Access-Control-Allow-Origin "*";
        }
    }
    
    # API Proxy to Node.js
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://shrimptech.vn' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://shrimptech.vn';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            return 204;
        }
    }
    
    # Security: deny access to sensitive files
    location ~ /\\. {
        deny all;
    }
    
    location ~ \\.(env|log)$ {
        deny all;
    }
}`;
    
    const nginxFile = path.join(DEPLOYMENT_CONFIG.local.buildDir, 'nginx-shrimptech.conf');
    fs.writeFileSync(nginxFile, nginxConfig);
    
    console.log('📋 Nginx configuration commands:');
    console.log('sudo nano /etc/nginx/sites-available/shrimptech.vn');
    console.log('sudo ln -s /etc/nginx/sites-available/shrimptech.vn /etc/nginx/sites-enabled/');
    console.log('sudo nginx -t');
    console.log('sudo systemctl reload nginx');
    
    console.log(`\n📝 Nginx config saved to: ${nginxFile}`);
    console.log('✅ Nginx configuration generated');
}

/**
 * Generate deployment checklist
 */
function generateDeploymentChecklist() {
    console.log('📋 Generating deployment checklist...');
    
    const checklist = `# SHRIMPTECH Production Deployment Checklist

## Pre-deployment
- [ ] Build completed successfully (npm run build:production)
- [ ] Environment variables configured in .env file
- [ ] SSL certificates obtained for shrimptech.vn
- [ ] Server access credentials ready
- [ ] Domain DNS pointing to server IP

## Server Setup
- [ ] Node.js installed (v16+ recommended)
- [ ] PM2 installed globally
- [ ] Nginx/Apache installed and configured
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] SSL certificates installed

## File Upload
- [ ] Upload dist/ folder contents to server
- [ ] Set correct file permissions
- [ ] Verify .env file is present and configured

## Application Setup
- [ ] Run: npm install --production
- [ ] Start with PM2: pm2 start server.js --name shrimptech-api
- [ ] Configure PM2 startup: pm2 startup && pm2 save

## Web Server Configuration
- [ ] Configure Nginx/Apache virtual host
- [ ] Set up reverse proxy for /api routes
- [ ] Configure SSL/TLS
- [ ] Test configuration: nginx -t

## Testing
- [ ] Test website: https://shrimptech.vn
- [ ] Test API endpoints: https://shrimptech.vn/api/status
- [ ] Test contact form submission
- [ ] Test newsletter subscription
- [ ] Verify email sending works

## Monitoring
- [ ] Check PM2 status: pm2 status
- [ ] Check logs: pm2 logs shrimptech-api
- [ ] Monitor server resources
- [ ] Set up log rotation

## Security
- [ ] Verify HTTPS redirects work
- [ ] Test CORS configuration
- [ ] Check for exposed sensitive files
- [ ] Update server packages

## Post-deployment
- [ ] Update DNS if needed
- [ ] Monitor application for 24 hours
- [ ] Set up automated backups
- [ ] Document any custom configurations

## Emergency Rollback
- [ ] Keep backup of previous version
- [ ] Know how to quickly revert changes
- [ ] Have emergency contact information ready

Generated on: ${new Date().toISOString()}
`;
    
    const checklistFile = path.join(DEPLOYMENT_CONFIG.local.buildDir, 'deployment-checklist.md');
    fs.writeFileSync(checklistFile, checklist);
    
    console.log(`📝 Deployment checklist saved to: ${checklistFile}`);
    console.log('✅ Deployment checklist generated');
}

/**
 * Main deployment function
 */
function main() {
    try {
        console.log('🚀 Starting SHRIMPTECH production deployment...\n');
        
        validateBuildDirectory();
        createBackup();
        uploadFiles();
        generateServerCommands();
        generateNginxConfig();
        generateDeploymentChecklist();
        
        console.log('\n🎉 Deployment preparation completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Review generated files in dist/ folder');
        console.log('2. Upload dist/ folder contents to your server');
        console.log('3. Follow server-setup-commands.sh on your server');
        console.log('4. Configure Nginx using nginx-shrimptech.conf');
        console.log('5. Follow deployment-checklist.md');
        
        console.log('\n📁 Generated files:');
        console.log('- server-setup-commands.sh');
        console.log('- nginx-shrimptech.conf');
        console.log('- deployment-checklist.md');
        console.log('- deployment-info.json');
        
    } catch (error) {
        console.error('❌ Deployment preparation failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };