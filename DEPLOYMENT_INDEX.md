# 📚 Deployment Documentation Index

Complete guide to deploying Zyfar Pulse to production.

---

## 🎯 Choose Your Path

### 🚀 Quick Start (30 minutes)
**[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Fast track deployment guide
- Minimal configuration
- Step-by-step commands
- Perfect for first deployment

### 📋 Complete Checklist
**[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Comprehensive checklist
- Every step documented
- Verification points
- Troubleshooting included

---

## 📖 Detailed Guides

### Backend Deployment
**[VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)** - Ubuntu VPS deployment
- Complete server setup
- PM2 process management
- Nginx configuration
- SSL setup (optional)
- Firewall configuration

### Frontend Deployment
**[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Vercel deployment
- GitHub integration
- Environment variables
- Custom domains
- Automatic deployments

---

## 📁 Important Files

### Configuration Files

#### Backend
- `backend/.env.example` - Environment variables template
- `backend/ecosystem.config.cjs` - PM2 configuration
- `backend/server.js` - Express server
- `backend/deploy.sh` - Deployment automation script
- `backend/backup.sh` - Data backup script

#### Frontend
- `frontend/.env.production` - Production environment
- `frontend/.env.development` - Development environment
- `frontend/.env.example` - Environment template
- `frontend/vercel.json` - Vercel configuration

---

## 🔧 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUCTION                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (Vercel)                                          │
│  ├─ https://your-app.vercel.app                            │
│  ├─ React + TypeScript + Vite                              │
│  ├─ Auto-deploy from GitHub                                │
│  └─ Environment: VITE_API_URL                              │
│                          │                                  │
│                          │ HTTPS/HTTP                       │
│                          ▼                                  │
│  Backend (VPS - Ubuntu)                                     │
│  ├─ http://31.97.203.109/api                               │
│  ├─ Node.js + Express                                       │
│  ├─ PM2 Process Manager                                     │
│  ├─ Nginx Reverse Proxy                                     │
│  └─ Data: /var/zyfar_pulse/data/surveys.json              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Process

### 1️⃣ Prepare Code
```bash
cd D:\Survey
git init
git add .
git commit -m "Production deployment"
git push origin main
```

### 2️⃣ Deploy Backend (VPS)
```bash
# Connect to VPS
ssh username@31.97.203.109

# Follow VPS_DEPLOYMENT.md
# Or use QUICK_DEPLOY.md for fast setup
```

### 3️⃣ Deploy Frontend (Vercel)
```
1. Visit vercel.com
2. Import GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy!
```

### 4️⃣ Connect & Test
```bash
# Update backend CORS with Vercel URL
# Test all endpoints
# Verify data persistence
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code is in GitHub repository
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] No sensitive data in code

### Backend VPS
- [ ] Node.js 18+ installed
- [ ] PM2 installed
- [ ] Nginx configured
- [ ] Firewall configured
- [ ] Data directory created
- [ ] Backend running on port 4000
- [ ] Health check responding

### Frontend Vercel
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] No build errors

### Integration
- [ ] CORS configured correctly
- [ ] API calls working
- [ ] Data persisting
- [ ] All features functional

---

## 🔐 Security Considerations

### Backend (VPS)
- ✅ Firewall enabled (ufw)
- ✅ Rate limiting configured
- ✅ Helmet.js for security headers
- ✅ CORS properly configured
- ✅ Environment variables protected
- ✅ Logs monitored
- 🔄 SSL certificate (optional but recommended)

### Frontend (Vercel)
- ✅ HTTPS automatic
- ✅ Security headers in vercel.json
- ✅ Environment variables encrypted
- ✅ API URL not hardcoded
- ✅ No sensitive data exposed

---

## 📊 Monitoring & Maintenance

### Backend Monitoring
```bash
# PM2 status
pm2 status

# View logs
pm2 logs zyfar-pulse

# Resource monitoring
pm2 monit

# System resources
htop
df -h
```

### Frontend Monitoring
- Vercel Analytics Dashboard
- Build logs in Vercel
- Runtime logs in Vercel
- Error tracking

### Data Backup
```bash
# Manual backup
cp /var/zyfar_pulse/data/surveys.json /backup/surveys_$(date +%Y%m%d).json

# Automated backup (use backup.sh)
chmod +x /var/www/zyfar-pulse/backend/backup.sh
crontab -e
# Add: 0 2 * * * /var/www/zyfar-pulse/backend/backup.sh
```

---

## 🔄 Update Process

### Backend Updates
```bash
# SSH to VPS
ssh username@31.97.203.109

# Run deployment script
cd /var/www/zyfar-pulse/backend
./deploy.sh

# Or manually:
git pull origin main
npm install --production
pm2 restart zyfar-pulse
```

### Frontend Updates
```bash
# Just push to GitHub
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys!
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
pm2 logs zyfar-pulse
# Check for errors
# Verify .env file
# Check port availability
```

#### CORS Errors
```bash
# Verify CORS_ORIGIN in ecosystem.config.cjs
# Must match exact Vercel URL
pm2 restart zyfar-pulse
```

#### Data Not Persisting
```bash
# Check permissions
ls -la /var/zyfar_pulse/data/
# Verify DATA_DIR in .env
# Check disk space
df -h
```

#### 502 Bad Gateway
```bash
# Backend not running
pm2 status
pm2 restart zyfar-pulse

# Nginx not running
sudo systemctl status nginx
sudo systemctl restart nginx
```

---

## 📞 Support Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [Vite Docs](https://vitejs.dev/)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Vercel Docs](https://vercel.com/docs)

### Deployment Guides
- VPS_DEPLOYMENT.md - Detailed VPS setup
- VERCEL_DEPLOYMENT.md - Vercel deployment
- QUICK_DEPLOY.md - Quick start guide
- PRODUCTION_CHECKLIST.md - Complete checklist

---

## 🎯 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
DATA_DIR=/var/zyfar_pulse/data
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=http://31.97.203.109/api
```

---

## 📈 Performance Optimization

### Backend
- ✅ PM2 cluster mode (optional)
- ✅ Nginx caching
- ✅ Rate limiting
- ✅ Compression middleware
- ✅ Keep-alive connections

### Frontend
- ✅ Vite code splitting
- ✅ Asset optimization
- ✅ Tree shaking
- ✅ Lazy loading
- ✅ CDN via Vercel

---

## 🎊 Success Metrics

Your deployment is successful when:

✅ Frontend loads at your Vercel URL  
✅ Backend health check returns OK  
✅ Users can complete surveys  
✅ Data persists in surveys.json  
✅ Recent surveys display correctly  
✅ Live stats update in real-time  
✅ No console errors  
✅ Mobile responsive  
✅ PM2 shows status: online  
✅ Nginx returns 200 responses  

---

## 📝 Quick Reference

### VPS IP
```
31.97.203.109
```

### Important Paths
```bash
Application:  /var/www/zyfar-pulse/backend
Data:         /var/zyfar_pulse/data
Logs:         /var/log/zyfar-pulse-*.log
Nginx Config: /etc/nginx/sites-available/zyfar-pulse
```

### Key Commands
```bash
# PM2
pm2 status
pm2 logs zyfar-pulse
pm2 restart zyfar-pulse

# Nginx
sudo nginx -t
sudo systemctl restart nginx

# Data
cat /var/zyfar_pulse/data/surveys.json | jq
```

---

## 🎉 You're Ready!

Follow the guides step by step, and your application will be live in production!

**Start here:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

Good luck! 🚀
