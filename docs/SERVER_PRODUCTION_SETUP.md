# 🚀 HƯỚNG DẪN SETUP SERVER PRODUCTION CHO SHRIMPTECH.VN

## 🎯 Tổng quan

Hướng dẫn này giúp bạn deploy Node.js server lên production để hỗ trợ domain **shrimptech.vn** với các API endpoints.

---

## 📋 Yêu cầu hệ thống

### Hosting Provider:
- **VPS/Cloud Server** (DigitalOcean, AWS EC2, Google Cloud, Vultr)
- **RAM**: Tối thiểu 512MB (khuyến nghị 1GB+)
- **CPU**: 1 vCPU
- **Storage**: 10GB+
- **OS**: Ubuntu 20.04+ hoặc CentOS 8+

### Software:
- **Node.js**: v18.0.0+
- **NPM**: v8.0.0+
- **Nginx**: Reverse proxy
- **PM2**: Process manager
- **Certbot**: SSL certificates

---

## 🏗️ Các bước setup

### 1. **Chuẩn bị Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18+
npm --version   # Should be v8+

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. **Upload Source Code**

```bash
# Create application directory
sudo mkdir -p /var/www/shrimptech
sudo chown $USER:$USER /var/www/shrimptech

# Upload your project files to /var/www/shrimptech
# Files needed:
# - server.js
# - package.json
# - config/
# - public/ (optional, can use Firebase)
# - .env (với environment variables)
```

### 3. **Setup Environment Variables**

```bash
# Create .env file
cat > /var/www/shrimptech/.env << EOF
NODE_ENV=production
PORT=3001
HTTPS_PORT=3443

# Email configuration
EMAIL_USER=shrimptech.vhu.hutech@gmail.com
EMAIL_PASS=your_email_password_or_app_password

# Security
CORS_ORIGIN=https://shrimptech.vn,https://www.shrimptech.vn

# Optional: Database URLs, API keys, etc.
EOF

# Secure the .env file
chmod 600 /var/www/shrimptech/.env
```

### 4. **Install Dependencies**

```bash
cd /var/www/shrimptech

# Install production dependencies
npm install --production

# Or if you have package-lock.json
npm ci --production
```

### 5. **Configure Nginx Reverse Proxy**

```nginx
# Create Nginx config: /etc/nginx/sites-available/shrimptech.vn
sudo nano /etc/nginx/sites-available/shrimptech.vn
```

```nginx
server {
    listen 80;
    server_name shrimptech.vn www.shrimptech.vn;

    # Redirect HTTP to HTTPS (will be enabled after SSL setup)
    # return 301 https://$server_name$request_uri;

    # API proxy to Node.js server
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
        proxy_timeout 90s;
    }

    # Static files (optional - can use Firebase CDN)
    location / {
        # Option 1: Serve local static files
        root /var/www/shrimptech/public;
        try_files $uri $uri/ /index.html;
        
        # Option 2: Proxy to Firebase (uncomment if using Firebase for static)
        # proxy_pass https://shrimptech-c6e93.web.app;
        # proxy_set_header Host shrimptech-c6e93.web.app;
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/shrimptech.vn /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6. **Setup SSL Certificate**

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d shrimptech.vn -d www.shrimptech.vn

# Certbot will automatically:
# 1. Verify domain ownership
# 2. Issue SSL certificate
# 3. Update Nginx config for HTTPS
# 4. Setup auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

### 7. **Start Application with PM2**

```bash
cd /var/www/shrimptech

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'shrimptech-api',
    script: 'server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    log_file: '/var/log/shrimptech/combined.log',
    out_file: '/var/log/shrimptech/out.log',
    error_file: '/var/log/shrimptech/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    restart_delay: 1000,
    max_memory_restart: '500M'
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/shrimptech
sudo chown $USER:$USER /var/log/shrimptech

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions to setup startup script
```

### 8. **Firewall Configuration**

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'  # Allows ports 80 and 443
sudo ufw allow 3001          # Node.js port (optional, only if direct access needed)

# Check status
sudo ufw status
```

---

## 🧪 Testing Production Setup

### 1. **Test Server Health**

```bash
# Test local Node.js server
curl http://localhost:3001/api/status

# Test through Nginx
curl http://shrimptech.vn/api/status
curl https://shrimptech.vn/api/status
```

### 2. **Test API Endpoints**

```bash
# Test contact API
curl -X POST https://shrimptech.vn/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Production test"
  }'

# Test newsletter API
curl -X POST https://shrimptech.vn/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 3. **Monitor Application**

```bash
# PM2 monitoring
pm2 status
pm2 logs shrimptech-api
pm2 monit

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System resources
htop
df -h
free -h
```

---

## 📊 Monitoring và Maintenance

### Daily Commands:
```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate expiry
sudo certbot certificates

# Monitor logs
pm2 logs --lines 50
```

### Weekly Maintenance:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart services (if needed)
pm2 restart shrimptech-api
sudo systemctl reload nginx

# Check disk space
df -h
```

---

## 🆘 Troubleshooting

### Server không start:
```bash
# Check PM2 logs
pm2 logs shrimptech-api

# Check if port is in use
sudo netstat -tulpn | grep :3001

# Restart application
pm2 restart shrimptech-api
```

### Nginx errors:
```bash
# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL issues:
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check SSL configuration
openssl s_client -connect shrimptech.vn:443
```

---

## 🎯 Final Checklist

✅ **Server Setup**
- [ ] Node.js 18+ installed
- [ ] PM2 installed and configured
- [ ] Application dependencies installed
- [ ] Environment variables configured

✅ **Nginx Configuration**
- [ ] Reverse proxy configured
- [ ] Security headers added
- [ ] Gzip compression enabled (optional)

✅ **SSL/Security**
- [ ] SSL certificate obtained and configured
- [ ] HTTPS redirect enabled
- [ ] Firewall configured

✅ **Monitoring**
- [ ] PM2 startup script configured
- [ ] Log rotation configured
- [ ] Monitoring alerts setup (optional)

✅ **Testing**
- [ ] All API endpoints working
- [ ] SSL certificate valid
- [ ] Performance acceptable
- [ ] Error handling working

---

**🎉 Khi hoàn tất, website sẽ hoạt động hoàn toàn trên https://shrimptech.vn!**