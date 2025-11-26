# 🚀 Deployment Guide - Zyfar Pulse Survey System

This guide provides step-by-step instructions for deploying the Zyfar Pulse Survey System on an Ubuntu VPS (Hostinger or similar).

## Prerequisites

- Ubuntu 20.04+ VPS with root/sudo access
- Domain name pointed to your VPS IP
- SSH access to the server

## 📦 Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js (v18+)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x or higher
npm --version
```

### 3. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### 4. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5. Install Certbot (for SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## 📂 Deploy Backend

### 1. Create Application Directory

```bash
sudo mkdir -p /var/www/zyfar-pulse
cd /var/www/zyfar-pulse
```

### 2. Upload Backend Code

Upload the `backend/` folder to `/var/www/zyfar-pulse/backend/`

```bash
# Using SCP from your local machine:
scp -r backend/ user@your-vps-ip:/var/www/zyfar-pulse/
```

### 3. Install Dependencies

```bash
cd /var/www/zyfar-pulse/backend
npm install --production
```

### 4. Create Data Directory

```bash
sudo mkdir -p /var/zyfar_pulse/data
sudo chown -R $USER:$USER /var/zyfar_pulse
```

### 5. Set Environment Variables

```bash
cd /var/www/zyfar-pulse/backend
cp .env.example .env
nano .env
```

Update the `.env` file:
```env
PORT=4000
NODE_ENV=production
DATA_DIR=/var/zyfar_pulse/data
CORS_ORIGIN=https://yourdomain.com
```

### 6. Start Backend with PM2

```bash
cd /var/www/zyfar-pulse/backend
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Verify backend is running:
```bash
pm2 status
curl http://localhost:4000/health
```

## 🌐 Deploy Frontend

### 1. Build Frontend Locally

On your local machine:

```bash
cd frontend
npm install
npm run build
```

### 2. Upload Build to Server

```bash
# From your local machine:
scp -r dist/ user@your-vps-ip:/var/www/zyfar-pulse/frontend/
```

### 3. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/zyfar-pulse
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/zyfar-pulse/frontend/dist;
    index index.html;
    
    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
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
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
```

### 4. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/zyfar-pulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Setup SSL (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically:
- Obtain SSL certificate
- Configure Nginx for HTTPS
- Set up auto-renewal

Test SSL renewal:
```bash
sudo certbot renew --dry-run
```

## 🔍 Verify Deployment

1. **Check Backend:**
```bash
curl https://yourdomain.com/api/health
```

2. **Check Frontend:**
Open browser: `https://yourdomain.com`

3. **Check PM2:**
```bash
pm2 status
pm2 logs zyfar-pulse
```

## 📊 Monitoring & Maintenance

### View Logs

```bash
# PM2 logs
pm2 logs zyfar-pulse

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart backend
pm2 restart zyfar-pulse

# Restart Nginx
sudo systemctl restart nginx
```

### Update Application

```bash
# Backend update
cd /var/www/zyfar-pulse/backend
git pull  # or upload new files
npm install
pm2 restart zyfar-pulse

# Frontend update
# Build locally, then upload dist folder
sudo rm -rf /var/www/zyfar-pulse/frontend/dist
# Upload new dist folder
sudo systemctl reload nginx
```

### Backup Data

```bash
# Create backup
sudo tar -czf zyfar-backup-$(date +%Y%m%d).tar.gz /var/zyfar_pulse/data/

# Restore backup
sudo tar -xzf zyfar-backup-YYYYMMDD.tar.gz -C /
```

## 🛡️ Security Recommendations

1. **Firewall Setup:**
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

2. **Limit API Rate:**
Already configured in backend with express-rate-limit

3. **Regular Updates:**
```bash
sudo apt update && sudo apt upgrade -y
```

4. **Monitor Disk Space:**
```bash
df -h
du -sh /var/zyfar_pulse/data/
```

## 🆘 Troubleshooting

### Backend not starting:
```bash
pm2 logs zyfar-pulse --lines 100
```

### Nginx errors:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Data file issues:
```bash
ls -la /var/zyfar_pulse/data/
cat /var/zyfar_pulse/data/surveys.json
```

### Port already in use:
```bash
sudo lsof -i :4000
sudo kill -9 <PID>
pm2 restart zyfar-pulse
```

## ✅ Post-Deployment Checklist

- [ ] Backend health endpoint accessible
- [ ] Frontend loads correctly
- [ ] Survey submission works
- [ ] Data saves to `/var/zyfar_pulse/data/surveys.json`
- [ ] SSL certificate active
- [ ] PM2 process running
- [ ] Nginx serving both frontend and backend
- [ ] Rate limiting working
- [ ] Logs accessible

## 📞 Support

For issues, check:
1. PM2 logs: `pm2 logs zyfar-pulse`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Data directory permissions: `ls -la /var/zyfar_pulse/data/`
