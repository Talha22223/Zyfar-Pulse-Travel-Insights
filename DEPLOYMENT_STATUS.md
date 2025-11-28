# 🔍 DEPLOYMENT STATUS & VERIFICATION

**Date**: November 27, 2025  
**Backend VPS**: `31.97.203.109:4000`  
**Frontend URL**: `https://zyfar-pulse-travel-insights-fronten.vercel.app/`

---

## ✅ DEPLOYMENT CHECKLIST

### Backend VPS (31.97.203.109) Status

**Test these endpoints:**

```bash
# 1. Health Check
curl http://31.97.203.109:4000/health

# 2. Get Categories
curl http://31.97.203.109:4000/api/surveys/sample-questions

# 3. Get Live Stats
curl http://31.97.203.109:4000/api/stats/live

# 4. Test CORS (should work from your frontend)
curl -H "Origin: https://zyfar-pulse-travel-insights-fronten.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://31.97.203.109:4000/api/surveys/submit
```

### Frontend Vercel Status

**Manual Testing:**
1. ✅ Visit: https://zyfar-pulse-travel-insights-fronten.vercel.app/
2. ✅ Categories load correctly
3. ✅ Select a category (e.g., "Food & Dining")
4. ✅ Answer survey questions
5. ✅ Submit survey successfully
6. ✅ View recent surveys section
7. ✅ Check live insights update
8. ✅ Open browser console - no errors

---

## 🔧 CONFIGURATION UPDATES MADE

### 1. Backend CORS Fixed
Updated `backend/server.js` to include your Vercel URL:
```javascript
const allowedOrigins = [
  'http://localhost:3003', 
  'http://localhost:5173', 
  'https://zyfar-pulse-travel-insights-fronten.vercel.app'  // ✅ Added
];
```

### 2. PM2 Configuration Updated
Updated `backend/ecosystem.config.cjs`:
```javascript
CORS_ORIGIN: 'https://zyfar-pulse-travel-insights-fronten.vercel.app'  // ✅ Updated
```

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### If Backend Needs Redeployment:

```bash
# SSH to your VPS
ssh your-username@31.97.203.109

# Navigate to app directory
cd /var/www/zyfar-pulse/backend

# Update the files (if you made changes)
# Option 1: Upload new files via SCP
# Option 2: Git pull (if using Git)

# Update PM2 configuration
nano ecosystem.config.cjs
# Verify CORS_ORIGIN is set to: https://zyfar-pulse-travel-insights-fronten.vercel.app

# Restart the application
pm2 restart zyfar-pulse

# Verify status
pm2 status
pm2 logs zyfar-pulse --lines 20
```

### Test Backend After Restart:

```bash
# Health check
curl http://localhost:4000/health

# Should return:
# {"status":"OK","timestamp":"...","dataStore":"active"}
```

---

## 🌐 FRONTEND-BACKEND CONNECTION

Your frontend uses this API proxy configuration in `frontend/api/[...path].ts`:

```typescript
const BACKEND_URL = 'http://31.97.203.109:4000';  // ✅ Correct
```

This routes:
- `https://your-vercel-app.vercel.app/api/*` 
- → `http://31.97.203.109:4000/*`

---

## 📊 MONITORING COMMANDS

### On VPS (SSH to 31.97.203.109):

```bash
# Application status
pm2 status
pm2 monit

# View logs
pm2 logs zyfar-pulse
pm2 logs zyfar-pulse --lines 100

# System resources
htop
df -h
free -h

# Check if port 4000 is listening
netstat -tlnp | grep 4000
# or
ss -tlnp | grep 4000

# Test internal connection
curl http://localhost:4000/health

# View recent survey data
cat /var/zyfar_pulse/data/surveys.json | tail -50
```

### Nginx (if configured):

```bash
# Check nginx status
sudo systemctl status nginx

# Test nginx config
sudo nginx -t

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: CORS Errors in Browser Console

**Symptoms:**
```
Access to fetch at 'http://31.97.203.109:4000/api/surveys/submit' 
from origin 'https://zyfar-pulse-travel-insights-fronten.vercel.app' 
has been blocked by CORS policy
```

**Fix:**
```bash
# SSH to VPS
ssh your-username@31.97.203.109
cd /var/www/zyfar-pulse/backend

# Edit ecosystem config
nano ecosystem.config.cjs
# Ensure CORS_ORIGIN exactly matches your Vercel URL

# Restart
pm2 restart zyfar-pulse
```

### Issue 2: Backend Not Responding

**Check:**
```bash
pm2 status
pm2 logs zyfar-pulse --lines 50
```

**Fix:**
```bash
pm2 restart zyfar-pulse
# or if completely broken:
pm2 delete zyfar-pulse
pm2 start ecosystem.config.cjs
```

### Issue 3: Data Not Persisting

**Check:**
```bash
ls -la /var/zyfar_pulse/data/
cat /var/zyfar_pulse/data/surveys.json
```

**Fix:**
```bash
# Create directory if missing
sudo mkdir -p /var/zyfar_pulse/data
sudo chown -R $USER:$USER /var/zyfar_pulse/data
chmod 755 /var/zyfar_pulse/data
```

### Issue 4: Port 4000 Already in Use

**Check:**
```bash
sudo lsof -i :4000
# or
sudo netstat -tlnp | grep 4000
```

**Fix:**
```bash
# Kill conflicting process
sudo kill -9 PID_NUMBER
# Then restart PM2
pm2 restart zyfar-pulse
```

---

## 📈 PERFORMANCE MONITORING

### Key Metrics to Watch:

1. **Response Times**: API calls should be < 500ms
2. **Memory Usage**: Backend should use < 200MB
3. **CPU Usage**: Should be < 50% under normal load
4. **Disk Space**: Keep < 80% full
5. **Survey Data**: Monitor file size growth

### Commands:
```bash
# Memory usage
pm2 monit

# Disk usage
df -h

# System load
htop
uptime

# Network connections
netstat -an | grep :4000
```

---

## 🎯 SUCCESS INDICATORS

Your deployment is working correctly if:

✅ **Backend Health Check**: `curl http://31.97.203.109:4000/health` returns `"status":"OK"`  
✅ **Frontend Loads**: Website opens without errors  
✅ **API Connectivity**: Categories and surveys load  
✅ **Data Persistence**: Submitted surveys appear in recent surveys  
✅ **Live Stats**: Insights update with new submissions  
✅ **No CORS Errors**: Browser console is clean  
✅ **PM2 Status**: Shows "online" status  
✅ **Response Times**: API calls complete in < 1 second  

---

## 🔄 REGULAR MAINTENANCE

### Daily:
- Check PM2 status: `pm2 status`
- Monitor error logs: `pm2 logs zyfar-pulse --lines 20`

### Weekly:
- Check disk space: `df -h`
- Review survey data growth: `ls -lh /var/zyfar_pulse/data/`
- Update dependencies: `npm audit fix`

### Monthly:
- Backup data: `cd /var/www/zyfar-pulse/backend && ./backup.sh`
- Check for security updates: `sudo apt update && sudo apt upgrade`
- Review and clean old log files

---

## 📞 QUICK REFERENCE

| Component | Location | Command |
|-----------|----------|---------|
| **Backend Status** | VPS | `pm2 status` |
| **Backend Logs** | VPS | `pm2 logs zyfar-pulse` |
| **Data File** | VPS | `cat /var/zyfar_pulse/data/surveys.json` |
| **Restart Backend** | VPS | `pm2 restart zyfar-pulse` |
| **Frontend** | Vercel | Auto-deploy from Git |
| **Health Check** | Browser | `http://31.97.203.109:4000/health` |

---

## 🎉 NEXT STEPS

1. **Test Everything**: Go through the manual testing checklist above
2. **Monitor First Week**: Check logs daily for any issues
3. **Setup Automated Backups**: Schedule backup.sh to run daily
4. **Consider SSL**: Add HTTPS to backend with Let's Encrypt
5. **Custom Domain**: Point a custom domain to your Vercel frontend
6. **Analytics**: Monitor Vercel analytics for usage patterns

---

Your Zyfar Pulse Survey System is now live and ready for users! 🚀

**Frontend**: https://zyfar-pulse-travel-insights-fronten.vercel.app/  
**Backend**: http://31.97.203.109:4000  

Test it out and let me know if you encounter any issues!