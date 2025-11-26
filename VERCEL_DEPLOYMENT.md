# 🚀 Vercel Deployment Guide - Frontend

This guide covers deploying the Zyfar Pulse frontend to Vercel.

## 📋 Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub account (recommended for automatic deployments)
- Backend deployed and running on VPS

---

## 🔧 Step 1: Prepare Frontend for Deployment

### Update API Configuration

The frontend is already configured to use environment variables for the API URL.

1. **Check `.env.production` file** (already created):
   ```env
   VITE_API_URL=http://31.97.203.109/api
   ```

2. **After backend deployment, update with your actual backend URL**:
   - If using IP: `http://31.97.203.109/api`
   - If using domain: `https://api.yourdomain.com/api`

---

## 📦 Step 2: Push to GitHub (Recommended)

```bash
# Navigate to project root
cd D:\Survey

# Initialize git if not already done
git init

# Create .gitignore if needed
echo "node_modules
dist
.env
.env.local
*.log" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/your-username/zyfar-pulse.git

# Push
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `http://31.97.203.109/api`

7. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd D:\Survey\frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? zyfar-pulse (or your choice)
# - Directory? ./ (current directory)
# - Build command? npm run build
# - Output directory? dist
# - Development command? npm run dev
```

---

## ⚙️ Step 4: Configure Environment Variables

After deployment, you need to add environment variables:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `http://31.97.203.109/api` | Production |

4. **Redeploy** after adding variables (Vercel will prompt you)

---

## 🔄 Step 5: Update Backend CORS

Once your Vercel deployment is complete, you'll get a URL like:
`https://zyfar-pulse-xyz123.vercel.app`

**Update backend CORS configuration**:

1. SSH into your VPS:
   ```bash
   ssh username@31.97.203.109
   ```

2. Edit ecosystem config:
   ```bash
   cd /var/www/zyfar-pulse/backend
   nano ecosystem.config.cjs
   ```

3. Update CORS_ORIGIN:
   ```javascript
   env: {
     NODE_ENV: 'production',
     PORT: 4000,
     DATA_DIR: '/var/zyfar_pulse/data',
     CORS_ORIGIN: 'https://zyfar-pulse-xyz123.vercel.app'
   }
   ```

4. Restart backend:
   ```bash
   pm2 restart zyfar-pulse
   ```

---

## ✅ Step 6: Verify Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Test functionality**:
   - Categories should load
   - Surveys should submit
   - Recent surveys should display
   - Live stats should update

3. **Check browser console** for any errors
4. **Test on mobile** for responsive design

---

## 🔐 Step 7: Setup Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `www.yourdomain.com`
4. Follow DNS configuration instructions
5. Vercel will automatically provision SSL certificate

**Update DNS records** (at your domain registrar):
- Add CNAME: `www` → `cname.vercel-dns.com`
- Add A record: `@` → Vercel IP (provided in dashboard)

---

## 🚀 Automatic Deployments

With GitHub integration:
- **Push to main branch** → Automatic production deployment
- **Push to other branches** → Preview deployments
- **Pull requests** → Preview deployments with unique URLs

---

## 📊 Monitoring and Analytics

Vercel provides built-in analytics:

1. Go to **Analytics** tab
2. View:
   - Page views
   - Top pages
   - Top referrers
   - Device breakdown

---

## 🔄 Updating the Frontend

### Via Git (Automatic)

```bash
cd D:\Survey\frontend

# Make changes to your code

# Commit and push
git add .
git commit -m "Update frontend"
git push origin main

# Vercel automatically deploys!
```

### Via Vercel CLI (Manual)

```powershell
cd D:\Survey\frontend
vercel --prod
```

---

## 🐛 Troubleshooting

### API calls failing

1. **Check environment variables**:
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure `VITE_API_URL` is set correctly

2. **Check CORS**:
   - Verify backend CORS_ORIGIN includes your Vercel URL
   - Check browser console for CORS errors

3. **Redeploy** after environment variable changes

### Build failures

1. **Check build logs** in Vercel dashboard
2. **Common issues**:
   - Missing dependencies: Run `npm install` locally first
   - Type errors: Check TypeScript compilation
   - Environment variables: Ensure all required vars are set

### 404 errors

- Vercel should handle SPA routing automatically with Vite
- If issues persist, check `vercel.json` configuration

---

## 📝 Important Configuration Files

### `vercel.json`
- API proxy configuration
- Security headers
- Cache control

### `.env.production`
- Production environment variables
- API URL configuration

### `package.json`
- Build scripts
- Dependencies

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use environment variables** for all API URLs
3. **Enable HTTPS** (automatic with Vercel)
4. **Set security headers** (already configured in vercel.json)
5. **Review Vercel security headers** in dashboard

---

## 💰 Vercel Pricing

- **Hobby Plan** (Free):
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Perfect for this project!

- **Pro Plan** ($20/month):
  - More bandwidth
  - Advanced analytics
  - Team collaboration

---

## 🌍 Your Deployment URLs

After deployment:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `http://31.97.203.109/api`
- **Custom Domain**: `https://www.yourdomain.com` (optional)

---

## ✨ Next Steps

1. ✅ Deploy backend to VPS (follow VPS_DEPLOYMENT.md)
2. ✅ Deploy frontend to Vercel (this guide)
3. ✅ Update CORS in backend with Vercel URL
4. ✅ Test complete flow
5. ✅ Setup custom domain (optional)
6. ✅ Monitor analytics and errors

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev

---

## Success! 🎉

Your frontend should now be live on Vercel with automatic deployments from GitHub!
