# 🚀 Quick Start Deployment Guide

**Fast track to get your application deployed in 30 minutes!**

---

## 📦 What You Need

1. **VPS Details**
   - IP: `31.97.203.109`
   - Username: `[your-username]`
   - Password: `[your-password]`

2. **Accounts**
   - GitHub account
   - Vercel account (sign up with GitHub)

---

## ⚡ Quick Steps

### 1️⃣ Prepare Your Code (5 min)

```powershell
# On your Windows machine
cd D:\Survey

# Push to GitHub (create repo first on github.com)
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR-USERNAME/zyfar-pulse.git
git push -u origin main
```

---

### 2️⃣ Deploy Backend to VPS (15 min)

**Connect to VPS:**
```bash
ssh username@31.97.203.109
```

**Run deployment script:**
```bash
# Install Node.js, PM2, and Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs nginx
sudo npm install -g pm2

# Create directories
sudo mkdir -p /var/www/zyfar-pulse /var/zyfar_pulse/data
sudo chown -R $USER:$USER /var/www/zyfar-pulse /var/zyfar_pulse
```

**Upload your backend** (from your Windows machine):
```powershell
cd D:\Survey
scp -r backend username@31.97.203.109:/var/www/zyfar-pulse/
```

**Back on VPS:**
```bash
cd /var/www/zyfar-pulse/backend

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=4000
DATA_DIR=/var/zyfar_pulse/data
CORS_ORIGIN=https://your-app.vercel.app
EOF

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# Run the command PM2 outputs

# Configure Nginx
sudo tee /etc/nginx/sites-available/zyfar-pulse << EOF
server {
    listen 80;
    server_name 31.97.203.109;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        add_header Access-Control-Allow-Origin * always;
    }

    location /health {
        proxy_pass http://localhost:4000/health;
    }
}
EOF

# Enable and restart Nginx
sudo ln -s /etc/nginx/sites-available/zyfar-pulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

**Test:**
```bash
curl http://localhost:4000/health
# Should return: {"status":"OK",...}
```

---

### 3️⃣ Deploy Frontend to Vercel (5 min)

1. **Go to** https://vercel.com
2. **Sign in** with GitHub
3. **Click** "Add New Project"
4. **Import** your GitHub repository
5. **Configure:**
   - Framework: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**

6. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `http://31.97.203.109/api`

7. **Click Deploy**

---

### 4️⃣ Connect Everything (5 min)

**After Vercel deployment completes, you'll get a URL like:**
`https://zyfar-pulse-abc123.vercel.app`

**Update backend CORS:**
```bash
# SSH back to VPS
ssh username@31.97.203.109
cd /var/www/zyfar-pulse/backend

# Edit ecosystem config
nano ecosystem.config.cjs
# Change CORS_ORIGIN to your Vercel URL

# Or use sed
sed -i "s|CORS_ORIGIN: '.*'|CORS_ORIGIN: 'https://zyfar-pulse-abc123.vercel.app'|" ecosystem.config.cjs

# Restart
pm2 restart zyfar-pulse
```

---

## ✅ Verify Everything Works

### Test Backend:
```bash
curl http://31.97.203.109/health
# Should return: {"status":"OK",...}

curl http://31.97.203.109/api/surveys/sample-questions
# Should return JSON with categories
```

### Test Frontend:
1. Visit your Vercel URL
2. Open browser console (F12)
3. Select a survey category
4. Answer questions
5. Submit
6. Check "Recent Surveys" section

**✨ If everything works, you're done!**

---

## 🔧 Troubleshooting

### Backend not accessible
```bash
pm2 status
pm2 logs zyfar-pulse
sudo systemctl status nginx
```

### CORS errors
```bash
# Check CORS_ORIGIN matches your Vercel URL
cat /var/www/zyfar-pulse/backend/ecosystem.config.cjs

# Restart backend
pm2 restart zyfar-pulse
```

### Frontend not building
- Check Vercel build logs
- Verify environment variables
- Redeploy from Vercel dashboard

---

## 📱 Your Live URLs

- **Frontend**: https://your-app.vercel.app
- **Backend API**: http://31.97.203.109/api
- **Health Check**: http://31.97.203.109/health

---

## 🎯 Next Steps

1. ✅ Share your Vercel URL with users
2. ✅ Monitor PM2 logs: `pm2 logs zyfar-pulse`
3. ✅ Check Vercel analytics dashboard
4. ✅ Setup automated backups
5. ✅ Consider getting a custom domain

---

## 📚 Full Documentation

For detailed guides, see:
- `VPS_DEPLOYMENT.md` - Complete VPS setup
- `VERCEL_DEPLOYMENT.md` - Vercel deployment details
- `PRODUCTION_CHECKLIST.md` - Complete verification checklist

---

**🚀 Congratulations! Your app is live!**
