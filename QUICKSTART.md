# 🎯 Quick Start Guide - Zyfar Pulse Survey System

Get the Zyfar Pulse Survey System up and running in minutes!

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Code editor** (VS Code recommended)
- ✅ **PowerShell** or **Terminal**

---

## 🚀 Local Development Setup

### Method 1: Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
cd d:\Survey
.\setup.ps1
```

Select option **3** (Setup Both) and follow the prompts.

---

### Method 2: Manual Setup

**Step 1: Install Backend Dependencies**
```bash
cd backend
npm install
```

**Step 2: Configure Backend**
```bash
# Copy environment file
cp .env.example .env

# Edit .env if needed (optional for local development)
```

**Step 3: Start Backend**
```bash
npm run dev
```

Backend will run on `http://localhost:4000`

**Step 4: Install Frontend Dependencies** (in a new terminal)
```bash
cd frontend
npm install
```

**Step 5: Configure Frontend**
```bash
# Copy environment file
cp .env.example .env

# For local dev, .env should contain:
# VITE_API_URL=/api
```

**Step 6: Start Frontend**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

**Step 7: Test the Application**

Open your browser to `http://localhost:3000`

---

## ✅ Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-26T...",
  "dataStore": "active"
}
```

### 2. Check Frontend

Open browser: `http://localhost:3000`

You should see:
- ✅ Header with "Zyfar Pulse – What's on every traveller's mind?"
- ✅ Pulse animation
- ✅ "Start Survey Now" button
- ✅ No console errors

### 3. Test Survey Submission

1. Click "Start Survey Now"
2. Select "Travel Intention" category
3. Answer all 3 questions
4. Enter your city
5. Click "Submit"
6. Verify you see:
   - ✅ Personalized insight message
   - ✅ Pie chart with data
   - ✅ City pulse overview

### 4. Verify Data Saved

```bash
# Check if data file was created
cat backend/data/surveys.json
```

You should see your survey submission in JSON format.

---

## 🏗️ Project Structure Overview

```
d:\Survey\
│
├── backend/                    # Node.js + Express server
│   ├── config/
│   │   └── surveyConfig.js    # 10 survey categories
│   ├── utils/
│   │   ├── dataStore.js       # JSON storage management
│   │   └── analytics.js       # Statistics calculation
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/        # All React components
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   ├── styles/            # Global styles
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── DEPLOY.md                  # VPS deployment guide
├── API_DOC.md                 # API documentation
├── TESTING.md                 # Testing procedures
├── README.md                  # Project overview
└── setup.ps1                  # Automated setup script
```

---

## 🎨 Features You Can Test

### 1. Survey Categories (10 Total)

1. **Travel Intention** ✈️
2. **Destination Experience** 🏖️
3. **Event & Festival** 🎉
4. **Local Problems** ⚠️
5. **Price Sensitivity** 💰
6. **Preference** 💙
7. **Safety** 🛡️
8. **Post Trip Feedback** 📝
9. **Micro Trend** 📊
10. **Partner Feedback** 🤝

### 2. Data Visualization

- **Pie Charts** - Response distribution
- **Trend Lines** - 30-day submission trends
- **City Cards** - Trending destinations
- **Live Insights** - Personalized messages

### 3. City Pulse Overview

- **Safety Index** (0-100)
- **Budget Average** (₹ amount)
- **Happiness Score** (0-100)
- **Pain Point Index** (Top issue)

### 4. Interactive Elements

- **Pulse Animations** - Header section
- **Card Hover Effects** - Category selector
- **Progress Dots** - Survey navigation
- **Smooth Scrolling** - Auto-scroll to sections
- **WhatsApp Share** - Social sharing

---

## 🔧 Development Commands

### Backend Commands

```bash
cd backend

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Start with PM2 (production)
npm run pm2:start

# View PM2 logs
npm run pm2:logs

# Restart PM2 process
npm run pm2:restart

# Stop PM2 process
npm run pm2:stop
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

---

## 📊 API Testing

### Using cURL

**1. Get all categories:**
```bash
curl http://localhost:4000/api/surveys/sample-questions
```

**2. Get specific category:**
```bash
curl http://localhost:4000/api/surveys/sample-questions?category=travel_intention
```

**3. Submit survey:**
```bash
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "travel_intention",
    "answers": ["Yes, definitely", "Manali", "Solo adventure"],
    "city": "Delhi"
  }'
```

**4. Get live stats:**
```bash
curl http://localhost:4000/api/stats/live?category=travel_intention
```

**5. Get city overview:**
```bash
curl http://localhost:4000/api/stats/city-overview?city=Delhi
```

### Using Browser

Open browser developer console (F12) and run:

```javascript
// Submit survey
fetch('http://localhost:4000/api/surveys/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'travel_intention',
    answers: ['Yes, definitely', 'Manali', 'Solo adventure'],
    city: 'Delhi'
  })
})
.then(r => r.json())
.then(console.log);

// Get stats
fetch('http://localhost:4000/api/stats/live')
  .then(r => r.json())
  .then(console.log);
```

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** "Port 4000 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=4001
```

---

### Frontend can't connect to backend

**Problem:** Network errors in browser console

**Check:**
```bash
# 1. Is backend running?
curl http://localhost:4000/health

# 2. Check frontend proxy config
cat frontend/vite.config.ts
```

**Solution:**
- Ensure backend is running on port 4000
- Restart frontend dev server
- Clear browser cache

---

### Dependencies installation fails

**Problem:** `npm install` errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### TypeScript errors in frontend

**Problem:** Red squiggly lines everywhere

**Solution:**
- These are expected before running `npm install`
- Run `npm install` in frontend directory
- Restart VS Code
- Run `npm run dev` to verify build works

---

### Data not saving

**Problem:** Surveys submit but don't appear in stats

**Check:**
```bash
# 1. Does data directory exist?
ls -la backend/data/

# 2. Is file created?
cat backend/data/surveys.json

# 3. Check logs
# Look at terminal where backend is running
```

**Solution:**
- Ensure backend/data/ directory exists (created automatically)
- Check file permissions
- Restart backend server

---

## 📱 Mobile Testing

### Test on different screen sizes:

**Chrome DevTools:**
1. Open `http://localhost:3000`
2. Press `F12`
3. Click device toolbar icon (Ctrl+Shift+M)
4. Test on:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)

**Verify:**
- ✅ All text is readable
- ✅ Buttons are tappable
- ✅ No horizontal scrolling (except category cards)
- ✅ Charts resize properly
- ✅ Forms work correctly

---

## 🚀 Next Steps

### For Local Development

1. **Customize Survey Questions**
   - Edit `backend/config/surveyConfig.js`
   - Add/modify questions (maintain structure)
   - Restart backend

2. **Modify Styling**
   - Edit component `.module.scss` files
   - Changes auto-reload in dev mode
   - Use CSS variables in `frontend/src/styles/global.css`

3. **Add Features**
   - Create new components in `frontend/src/components/`
   - Add new API endpoints in `backend/server.js`
   - Update types in `frontend/src/types/index.ts`

### For Production Deployment

1. **Read Deployment Guide**
   - See `DEPLOY.md` for complete VPS setup
   - Includes Nginx, PM2, SSL configuration

2. **Prepare for Deployment**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   # This creates dist/ folder
   ```

3. **Setup VPS**
   - Follow step-by-step in DEPLOY.md
   - Configure domain and SSL
   - Deploy backend and frontend

---

## 📚 Documentation

- **README.md** - Project overview and quick reference
- **DEPLOY.md** - Complete VPS deployment guide
- **API_DOC.md** - Full API documentation
- **TESTING.md** - Testing procedures and checklists

---

## ✅ Development Checklist

Before starting development:

- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Health check passes
- [ ] Can submit a survey
- [ ] Data saves to surveys.json
- [ ] Charts render correctly
- [ ] No console errors

---

## 💡 Tips for Success

1. **Always start backend first**, then frontend
2. **Check terminal logs** for errors
3. **Use browser DevTools** to debug frontend issues
4. **Test API endpoints** with cURL before integrating
5. **Commit frequently** if using Git
6. **Read error messages** carefully
7. **Restart servers** after configuration changes

---

## 🎉 You're Ready!

Start building amazing survey experiences with Zyfar Pulse!

Need help? Check the documentation files or review the troubleshooting section above.

**Happy Coding! 🚀**
