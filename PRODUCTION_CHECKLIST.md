# 🚀 Production Deployment Checklist

Complete checklist for deploying Zyfar Pulse to production.

---

## ✅ Pre-Deployment Checklist

### Backend (VPS) Preparation

- [ ] VPS is accessible via SSH (31.97.203.109)
- [ ] VPS has Ubuntu installed
- [ ] You have sudo access
- [ ] Node.js 18+ will be installed
- [ ] PM2 will be installed for process management
- [ ] Nginx will be installed for reverse proxy

### Frontend (Vercel) Preparation

- [ ] Vercel account created
- [ ] GitHub account ready (for auto-deployment)
- [ ] Code pushed to GitHub repository
- [ ] Environment variables documented

### General

- [ ] All code is committed to Git
- [ ] .env files are NOT committed (in .gitignore)
- [ ] Dependencies are up to date
- [ ] Local testing complete
- [ ] No console errors in development

---

## 📦 Step 1: Backend Deployment (VPS)

Follow `VPS_DEPLOYMENT.md` for detailed instructions.

### 1.1 Connect to VPS
```bash
ssh username@31.97.203.109
```
- [ ] Successfully connected to VPS

### 1.2 Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```
- [ ] Node.js installed (verify: `node --version`)
- [ ] npm installed (verify: `npm --version`)
- [ ] PM2 installed (verify: `pm2 --version`)
- [ ] Nginx installed (verify: `nginx -v`)

### 1.3 Create Directories
```bash
# Application directory
sudo mkdir -p /var/www/zyfar-pulse
sudo chown -R $USER:$USER /var/www/zyfar-pulse

# Data directory
sudo mkdir -p /var/zyfar_pulse/data
sudo chown -R $USER:$USER /var/zyfar_pulse

# Log files
sudo mkdir -p /var/log
sudo touch /var/log/zyfar-pulse-error.log
sudo touch /var/log/zyfar-pulse-out.log
sudo chown -R $USER:$USER /var/log/zyfar-pulse-*.log
```
- [ ] Directories created
- [ ] Permissions set correctly

### 1.4 Upload Backend Files

**Option A: SCP from Windows**
```powershell
cd D:\Survey
scp -r backend username@31.97.203.109:/var/www/zyfar-pulse/
```

**Option B: Git**
```bash
cd /var/www/zyfar-pulse
git clone https://github.com/your-username/zyfar-pulse.git .
```

- [ ] Backend files uploaded
- [ ] Files are in `/var/www/zyfar-pulse/backend/`

### 1.5 Install Dependencies
```bash
cd /var/www/zyfar-pulse/backend
npm install --production
```
- [ ] Dependencies installed (check node_modules folder)

### 1.6 Configure Environment
```bash
cd /var/www/zyfar-pulse/backend
nano .env
```

Add:
```env
NODE_ENV=production
PORT=4000
DATA_DIR=/var/zyfar_pulse/data
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

- [ ] .env file created
- [ ] Environment variables set
- [ ] CORS_ORIGIN will be updated after Vercel deployment

### 1.7 Update PM2 Configuration

Edit `ecosystem.config.cjs` if needed:
```bash
nano ecosystem.config.cjs
```

- [ ] PM2 config reviewed
- [ ] CORS_ORIGIN ready to be updated

### 1.8 Start Application
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# Run the command PM2 outputs
```
- [ ] Application started
- [ ] PM2 process running (check: `pm2 status`)
- [ ] PM2 auto-start on boot configured

### 1.9 Test Backend
```bash
# Local test
curl http://localhost:4000/health

# Expected output:
# {"status":"OK","timestamp":"...","dataStore":"active"}
```
- [ ] Health check returns OK
- [ ] No errors in logs (`pm2 logs zyfar-pulse`)

### 1.10 Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/zyfar-pulse
```

Paste the configuration from VPS_DEPLOYMENT.md

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/zyfar-pulse /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```
- [ ] Nginx config created
- [ ] Nginx test passed
- [ ] Nginx restarted successfully

### 1.11 Configure Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```
- [ ] Firewall configured
- [ ] Ports opened (SSH, HTTP, HTTPS)

### 1.12 Test Public Access
```bash
curl http://31.97.203.109/health
```

From your browser:
- Visit: `http://31.97.203.109/health`
- Expected: `{"status":"OK",...}`

- [ ] Backend accessible from internet
- [ ] Health endpoint works
- [ ] No CORS errors (will test after frontend deployment)

---

## 🌐 Step 2: Frontend Deployment (Vercel)

Follow `VERCEL_DEPLOYMENT.md` for detailed instructions.

### 2.1 Prepare Frontend
```powershell
cd D:\Survey\frontend

# Check environment files
cat .env.production
cat vercel.json
```
- [ ] `.env.production` has correct API URL
- [ ] `vercel.json` exists with proxy configuration

### 2.2 Push to GitHub
```powershell
cd D:\Survey

# Initialize if needed
git init

# Add files
git add .
git commit -m "Production deployment"

# Push to GitHub
git remote add origin https://github.com/your-username/zyfar-pulse.git
git push -u origin main
```
- [ ] Code pushed to GitHub
- [ ] Repository is accessible

### 2.3 Deploy to Vercel

#### Via Dashboard:
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

- [ ] Project imported
- [ ] Build settings configured

### 2.4 Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `http://31.97.203.109/api` |

- [ ] Environment variable added
- [ ] Deployment triggered

### 2.5 Wait for Deployment
- [ ] Deployment completed successfully
- [ ] Build logs show no errors
- [ ] Deployment URL received (e.g., `https://zyfar-pulse-xyz.vercel.app`)

### 2.6 Test Frontend
Visit your Vercel URL and test:
- [ ] Page loads without errors
- [ ] Categories display correctly
- [ ] Can select a survey
- [ ] ⚠️ Survey submission might fail (CORS not updated yet)

---

## 🔄 Step 3: Connect Frontend & Backend

### 3.1 Update Backend CORS

SSH back into VPS:
```bash
ssh username@31.97.203.109
cd /var/www/zyfar-pulse/backend
nano ecosystem.config.cjs
```

Update CORS_ORIGIN with your Vercel URL:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 4000,
  DATA_DIR: '/var/zyfar_pulse/data',
  CORS_ORIGIN: 'https://zyfar-pulse-xyz.vercel.app'  // YOUR ACTUAL URL
}
```

Restart:
```bash
pm2 restart zyfar-pulse
pm2 logs zyfar-pulse
```

- [ ] CORS_ORIGIN updated with Vercel URL
- [ ] Backend restarted
- [ ] Logs show no errors

### 3.2 Test Full Integration

Visit your Vercel frontend and test complete flow:

1. **Homepage loads**
   - [ ] No console errors
   - [ ] Categories display
   - [ ] Recent surveys load

2. **Take a survey**
   - [ ] Select a category
   - [ ] Questions display
   - [ ] Can select answers
   - [ ] Auto-scroll works
   - [ ] Survey submits successfully
   - [ ] Success message appears

3. **Check data persistence**
   - [ ] Refresh page
   - [ ] Recent surveys show your submission
   - [ ] Live stats update
   - [ ] City overview shows data

4. **Check backend**
   ```bash
   ssh username@31.97.203.109
   cat /var/zyfar_pulse/data/surveys.json
   ```
   - [ ] Your survey is stored in JSON file

---

## 🔐 Step 4: Optional - Setup SSL

### 4.1 Get a Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured to point to VPS

### 4.2 Install SSL Certificate
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Auto-renewal configured

### 4.3 Update API URL

If using HTTPS:
1. Update Vercel environment variable:
   - `VITE_API_URL` = `https://yourdomain.com/api`

2. Redeploy frontend in Vercel

- [ ] Frontend uses HTTPS API URL
- [ ] No mixed content warnings

---

## 🎯 Step 5: Final Verification

### Backend Verification
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs zyfar-pulse --lines 50

# Check Nginx status
sudo systemctl status nginx

# Check disk space
df -h

# Verify data file
ls -lah /var/zyfar_pulse/data/surveys.json
```

- [ ] PM2 running (status: online)
- [ ] No errors in logs
- [ ] Nginx running
- [ ] Enough disk space
- [ ] surveys.json exists and growing

### Frontend Verification
- [ ] No console errors
- [ ] All features working
- [ ] Mobile responsive
- [ ] Fast loading times
- [ ] Analytics enabled

### API Tests
Test all endpoints:

```bash
# Health check
curl http://31.97.203.109/health

# Get categories
curl http://31.97.203.109/api/surveys/sample-questions

# Get recent surveys
curl http://31.97.203.109/api/surveys/recent?limit=5

# Get live stats
curl http://31.97.203.109/api/stats/live

# Submit survey (POST)
curl -X POST http://31.97.203.109/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{"category":"preference","answers":["Live Music"],"city":"Test City"}'
```

- [ ] All endpoints responding
- [ ] No 500 errors
- [ ] Data being stored

---

## 📊 Step 6: Monitoring & Maintenance

### Setup Monitoring
- [ ] PM2 monitoring: `pm2 monit`
- [ ] Check logs regularly: `pm2 logs`
- [ ] Monitor disk usage: `df -h`
- [ ] Vercel analytics enabled

### Backup Strategy
```bash
# Create daily backup script
crontab -e

# Add this line for daily 2 AM backup:
0 2 * * * cp /var/zyfar_pulse/data/surveys.json /var/zyfar_pulse/data/surveys_backup_$(date +\%Y\%m\%d).json
```
- [ ] Backup cron job created
- [ ] Test backup manually

### Security Checks
- [ ] Firewall enabled
- [ ] Only necessary ports open
- [ ] PM2 running with limited permissions
- [ ] Environment variables not exposed
- [ ] HTTPS configured (if using domain)

---

## 🎉 Success Criteria

### ✅ Backend
- [x] Backend running on VPS
- [x] Accessible at http://31.97.203.109/api
- [x] PM2 managing process
- [x] Nginx reverse proxy working
- [x] Data persisting to /var/zyfar_pulse/data/surveys.json
- [x] Auto-restart on crash
- [x] Auto-start on server reboot

### ✅ Frontend
- [x] Deployed to Vercel
- [x] Accessible at https://your-app.vercel.app
- [x] All UI features working
- [x] API calls succeeding
- [x] Mobile responsive
- [x] Auto-deploy on GitHub push

### ✅ Integration
- [x] Frontend can call backend APIs
- [x] CORS configured correctly
- [x] Surveys submitting successfully
- [x] Data displaying in real-time
- [x] No console errors
- [x] Rate limiting working

---

## 🐛 Common Issues & Solutions

### Issue: 502 Bad Gateway
- Check if backend is running: `pm2 status`
- Check backend logs: `pm2 logs zyfar-pulse`
- Restart: `pm2 restart zyfar-pulse`

### Issue: CORS Errors
- Verify CORS_ORIGIN in ecosystem.config.cjs
- Ensure it matches exact Vercel URL
- Restart backend: `pm2 restart zyfar-pulse`

### Issue: Build Fails on Vercel
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Check environment variables

### Issue: Data Not Persisting
- Check permissions: `ls -la /var/zyfar_pulse/data/`
- Verify DATA_DIR in .env
- Check disk space: `df -h`

---

## 📚 Important URLs & Commands

### URLs
- **Backend Health**: http://31.97.203.109/health
- **Backend API**: http://31.97.203.109/api
- **Frontend**: https://your-app.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard

### Common Commands
```bash
# SSH to VPS
ssh username@31.97.203.109

# Check backend status
pm2 status

# View logs
pm2 logs zyfar-pulse

# Restart backend
pm2 restart zyfar-pulse

# Update code (if using Git)
cd /var/www/zyfar-pulse/backend
git pull origin main
npm install --production
pm2 restart zyfar-pulse

# Check data
cat /var/zyfar_pulse/data/surveys.json | jq
```

---

## 🎊 Congratulations!

If all checkboxes are ticked, your application is successfully deployed to production!

- **Frontend**: Live on Vercel with auto-deployment
- **Backend**: Running on VPS with PM2 and Nginx
- **Data**: Persisting on Ubuntu VPS
- **Monitoring**: Setup and ready

### Next Steps
1. Share your Vercel URL with users
2. Monitor analytics in Vercel dashboard
3. Check PM2 logs occasionally
4. Setup regular backups
5. Consider custom domain + SSL
6. Monitor disk space on VPS

**🚀 Your app is now live!**
