# 🚀 VPS Deployment Guide - Ubuntu Server

This guide covers deploying the Zyfar Pulse backend to your Hostinger Ubuntu VPS.

## 📋 Prerequisites

- Ubuntu VPS (IP: 31.97.203.109)
- SSH access with sudo privileges
- Domain name (optional, but recommended)

---

## 🔧 Step 1: Connect to VPS

```bash
ssh username@31.97.203.109
```

---

## 📦 Step 2: Install Node.js and Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

---

## 📁 Step 3: Setup Application Directory

```bash
# Create application directory
sudo mkdir -p /var/www/zyfar-pulse
sudo chown -R $USER:$USER /var/www/zyfar-pulse

# Create data directory
sudo mkdir -p /var/zyfar_pulse/data
sudo chown -R $USER:$USER /var/zyfar_pulse

# Create log directory
sudo mkdir -p /var/log
sudo touch /var/log/zyfar-pulse-error.log
sudo touch /var/log/zyfar-pulse-out.log
sudo chown -R $USER:$USER /var/log/zyfar-pulse-*.log
```

---

## 📤 Step 4: Upload Backend Files

### Option A: Using Git (Recommended)

```bash
cd /var/www/zyfar-pulse

# If you have a Git repository
git clone https://github.com/your-username/zyfar-pulse.git .

# Or initialize and add remote
git init
git remote add origin https://github.com/your-username/zyfar-pulse.git
git pull origin main
```

### Option B: Using SCP from Local Machine

From your **local machine** (Windows PowerShell):

```powershell
# Navigate to your project
cd D:\Survey

# Upload backend folder
scp -r backend username@31.97.203.109:/var/www/zyfar-pulse/
```

### Option C: Using SFTP

Use FileZilla or WinSCP to upload the `backend` folder to `/var/www/zyfar-pulse/`

---

## ⚙️ Step 5: Configure Backend

```bash
cd /var/www/zyfar-pulse/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
```

Add the following to `.env`:

```env
NODE_ENV=production
PORT=4000
DATA_DIR=/var/zyfar_pulse/data
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Save and exit (Ctrl+X, Y, Enter)

---

## 🔄 Step 6: Update PM2 Ecosystem Config

```bash
nano ecosystem.config.cjs
```

Update the CORS_ORIGIN with your Vercel URL:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 4000,
  DATA_DIR: '/var/zyfar_pulse/data',
  CORS_ORIGIN: 'https://your-vercel-app.vercel.app'
}
```

---

## 🚀 Step 7: Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.cjs

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Copy and run the command PM2 outputs
# It will look something like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username
```

---

## 🌐 Step 8: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/zyfar-pulse
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name 31.97.203.109;  # Replace with your domain if you have one

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js backend
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization' always;
        
        # Handle preflight
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:4000/health;
        access_log off;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/zyfar-pulse /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

---

## 🔒 Step 9: Setup Firewall

```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS (for future SSL)
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🔐 Step 10: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ Step 11: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs zyfar-pulse

# Test health endpoint
curl http://localhost:4000/health

# Test from external
curl http://31.97.203.109/health
```

---

## 📊 Useful PM2 Commands

```bash
# View logs
pm2 logs zyfar-pulse

# Restart application
pm2 restart zyfar-pulse

# Stop application
pm2 stop zyfar-pulse

# Monitor resources
pm2 monit

# View details
pm2 show zyfar-pulse

# Delete from PM2
pm2 delete zyfar-pulse
```

---

## 🔄 Updating the Application

```bash
cd /var/www/zyfar-pulse/backend

# Pull latest changes (if using Git)
git pull origin main

# Install dependencies
npm install --production

# Restart with PM2
pm2 restart zyfar-pulse

# Or reload with zero downtime
pm2 reload zyfar-pulse
```

---

## 📁 Data Backup

```bash
# Backup surveys data
sudo cp /var/zyfar_pulse/data/surveys.json /var/zyfar_pulse/data/surveys_backup_$(date +%Y%m%d).json

# Create automated daily backup (add to crontab)
crontab -e

# Add this line:
0 2 * * * cp /var/zyfar_pulse/data/surveys.json /var/zyfar_pulse/data/surveys_backup_$(date +\%Y\%m\%d).json
```

---

## 🐛 Troubleshooting

### Application not starting

```bash
# Check logs
pm2 logs zyfar-pulse --lines 100

# Check if port 4000 is in use
sudo lsof -i :4000

# Restart PM2
pm2 restart zyfar-pulse
```

### Nginx errors

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Permission issues

```bash
# Fix data directory permissions
sudo chown -R $USER:$USER /var/zyfar_pulse/data
sudo chmod -R 755 /var/zyfar_pulse/data
```

### Check disk space

```bash
df -h
```

---

## 🌍 Your Backend URL

Once deployed, your backend API will be accessible at:

- **HTTP**: `http://31.97.203.109/api`
- **HTTPS**: `https://yourdomain.com/api` (after SSL setup)

Use this URL in your Vercel frontend environment variables.

---

## 📝 Notes

1. **Update CORS_ORIGIN**: After deploying frontend to Vercel, update the CORS_ORIGIN in ecosystem.config.cjs and restart PM2
2. **Monitor logs**: Regularly check PM2 logs for errors
3. **Backup data**: Setup automated backups of surveys.json
4. **Security**: Keep packages updated with `npm audit fix`
5. **Domain**: Consider using a domain name for better security and SSL support

---

## ✨ Success!

Your backend should now be running on your VPS! 

Test it: `http://31.97.203.109/health`
