# 🌟 Zyfar Pulse Survey System

A professional React-based survey platform with a minimal Node.js backend, designed to capture and visualize travel insights across India. All data is stored locally on your Ubuntu VPS using JSON files—no external databases required.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Production Ready](https://img.shields.io/badge/production-ready-brightgreen)

## 📋 Overview

**Zyfar Pulse** helps travelers share their experiences and see real-time insights about:
- Travel intentions and destinations
- Safety perceptions
- Budget preferences
- Local problems and recommendations
- Event and festival travel
- Post-trip feedback

### ✨ Key Features

- ✅ **10 Survey Categories** with 38 questions - Comprehensive travel insights
- 📊 **Live Data Visualization** - Pie charts, trend lines, and city cards
- 🌍 **City-Level Analytics** - Safety index, happiness score, budget averages
- 🎨 **Beautiful UI** - Glassmorphism, gradients, particles, smooth animations
- 💾 **Local JSON Storage** - No MongoDB, no external databases
- 🚀 **Production Ready** - VPS + Vercel deployment configured
- 🔒 **Secure** - Rate limiting, input validation, CORS protection
- 📱 **Mobile Responsive** - Works on all devices
- ⚡ **Auto-scroll** - Smooth tracking between questions

---

## 🚀 Quick Start

### Development Setup (5 minutes)

```powershell
# Clone repository
git clone https://github.com/your-username/zyfar-pulse.git
cd zyfar-pulse

# Install dependencies
npm install

# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

Visit `http://localhost:3003`

### Production Deployment (30 minutes)

**See: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** for fast deployment

Or follow detailed guides:
- **Backend (VPS)**: [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)
- **Frontend (Vercel)**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Checklist**: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **SCSS/CSS Modules** - Styling
- **Deployed on**: Vercel

### Backend
- **Node.js** with Express
- **Local JSON Storage** - Data persistence
- **Express Rate Limit** - API protection
- **Helmet** - Security headers
- **PM2** - Process management
- **Nginx** - Reverse proxy
- **Deployed on**: Ubuntu VPS
- **PM2** - Backend process manager

---

## 📁 Project Structure

```
Survey/
├── backend/
│   ├── config/
│   │   └── surveyConfig.js          # 10 survey categories + questions
│   ├── utils/
│   │   ├── dataStore.js             # JSON file management
│   │   └── analytics.js             # Stats calculation
│   ├── server.js                    # Express app
│   ├── ecosystem.config.cjs         # PM2 configuration
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/              # Hero section
│   │   │   ├── CategorySelector/    # Survey category cards
│   │   │   ├── SurveySection/       # Question flow
│   │   │   ├── LiveInsights/        # Charts and stats
│   │   │   ├── CityPulseOverview/   # City-level data
│   │   │   └── CommunityShare/      # Social sharing
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── styles/
│   │   │   └── global.css           # Global styles
│   │   ├── App.tsx                  # Main component
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── DEPLOY.md                        # Deployment guide
├── API_DOC.md                       # API documentation
├── TESTING.md                       # Testing procedures
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Ubuntu VPS** (for production)
- **Domain name** (optional, for HTTPS)

### Local Development

1. **Clone the repository:**
```bash
cd d:\Survey
```

2. **Setup Backend:**
```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`

3. **Setup Frontend:**
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

4. **Test the application:**
- Open `http://localhost:3000`
- Complete a survey
- View live insights

---

## 📊 Survey Categories

The system includes exactly **10 survey categories**:

1. **Travel Intention** ✈️ - Where are you planning to go next?
2. **Destination Experience** 🏖️ - How was your last trip?
3. **Event & Festival** 🎉 - Would you travel for events?
4. **Local Problems** ⚠️ - What challenges did you face?
5. **Price Sensitivity** 💰 - What's your travel budget?
6. **Preference** 💙 - What kind of traveler are you?
7. **Safety** 🛡️ - How safe did you feel?
8. **Post Trip Feedback** 📝 - Share your travel story
9. **Micro Trend** 📊 - What's trending in travel?
10. **Partner Feedback** 🤝 - Help us improve partnerships

Each category contains 1-4 carefully designed questions.

---

## 🌐 Production Deployment

### Quick Deployment Steps

1. **Prepare VPS:**
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

2. **Deploy Backend:**
```bash
sudo mkdir -p /var/www/zyfar-pulse
cd /var/www/zyfar-pulse
# Upload backend folder
cd backend
npm install --production
sudo mkdir -p /var/zyfar_pulse/data
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

3. **Deploy Frontend:**
```bash
# Build locally
cd frontend
npm run build

# Upload dist/ to server
# /var/www/zyfar-pulse/frontend/dist
```

4. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/zyfar-pulse
# Add configuration (see DEPLOY.md)
sudo ln -s /etc/nginx/sites-available/zyfar-pulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Setup SSL:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

For detailed instructions, see **[DEPLOY.md](DEPLOY.md)**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/surveys/submit` | Submit survey response |
| GET | `/api/stats/live?category=X` | Get live statistics |
| GET | `/api/stats/city-overview?city=X` | Get city-level insights |
| GET | `/api/surveys/sample-questions` | Get all categories |
| GET | `/api/surveys/sample-questions?category=X` | Get category questions |

For complete API documentation, see **[API_DOC.md](API_DOC.md)**

---

## 💾 Data Storage

All survey data is stored in:
```
/var/zyfar_pulse/data/surveys.json
```

**Format:**
```json
[
  {
    "id": "survey_1732617000000_abc123",
    "category": "travel_intention",
    "questions": ["ti_q1", "ti_q2", "ti_q3"],
    "answers": ["Yes, definitely", "Manali", "Solo adventure"],
    "city": "Delhi",
    "timestamp": "2025-11-26T10:30:00.000Z"
  }
]
```

**Features:**
- ✅ Automatic file creation
- ✅ Automatic directory creation
- ✅ No schema migrations
- ✅ Easy backup (`cp surveys.json surveys.backup.json`)
- ✅ Human-readable format

---

## 🧪 Testing

Run comprehensive tests to ensure everything works:

```bash
# Backend health check
curl http://localhost:4000/health

# Submit test survey
curl -X POST http://localhost:4000/api/surveys/submit \
  -H "Content-Type: application/json" \
  -d '{
    "category": "travel_intention",
    "answers": ["Yes, definitely", "Manali", "Solo adventure"],
    "city": "Delhi"
  }'

# Get statistics
curl http://localhost:4000/api/stats/live
```

For complete testing procedures, see **[TESTING.md](TESTING.md)**

---

## 🎨 Design Highlights

- **Gradient Backgrounds** - Turquoise to white
- **Pulse Animations** - Smooth dot animations in header
- **Rounded Charts** - Pastel colors using Recharts
- **Card-Based Layout** - Clean, modern card designs
- **Responsive Design** - Mobile, tablet, desktop
- **Smooth Scrolling** - Auto-scroll to sections
- **Hover Effects** - Interactive card and button states

---

## 🔐 Security Features

- ✅ **Rate Limiting** - 5 submissions per minute, 100 requests per 15 min
- ✅ **Input Validation** - Category and answer validation
- ✅ **Helmet.js** - Security headers
- ✅ **CORS Configuration** - Controlled cross-origin access
- ✅ **HTTPS** - SSL certificate via Certbot
- ✅ **No Database Injection** - JSON storage is immune to SQL injection

---

## 📈 Analytics & Insights

### Live Insights
- **Pie Charts** - Response distribution
- **Trending Destinations** - Top 10 destinations
- **Trend Lines** - 30-day submission trends
- **Personalized Messages** - "You're part of 42% who chose..."

### City Pulse Overview
- **Safety Index** (0-100)
- **Budget Average** (₹)
- **Happiness Score** (0-100)
- **Pain Point Index** (Most common problem)
- **Trending Destinations** (City-specific)

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:
```env
PORT=4000
NODE_ENV=production
DATA_DIR=/var/zyfar_pulse/data
CORS_ORIGIN=https://yourdomain.com
```

### Frontend Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:4000/api
```

For production, the API URL will be `/api` (proxied by Nginx).

---

## 📦 Dependencies

### Backend
- express - Web framework
- cors - CORS middleware
- helmet - Security headers
- express-rate-limit - Rate limiting
- pm2 - Process manager

### Frontend
- react - UI library
- recharts - Data visualization
- lucide-react - Icons
- sass - CSS preprocessor
- vite - Build tool

---

## 🐛 Troubleshooting

### Backend not starting
```bash
pm2 logs zyfar-pulse
# Check for errors
```

### Data not saving
```bash
ls -la /var/zyfar_pulse/data/
# Verify directory exists and has correct permissions
```

### Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:4000/health

# Check Nginx proxy configuration
sudo nginx -t
```

### Charts not rendering
- Check browser console for errors
- Verify recharts is installed
- Ensure data format is correct

---

## 📝 License

MIT License - Feel free to use this project for your own purposes.

---

## 👥 Support

For issues or questions:
1. Check **[DEPLOY.md](DEPLOY.md)** for deployment issues
2. Check **[API_DOC.md](API_DOC.md)** for API questions
3. Check **[TESTING.md](TESTING.md)** for testing procedures
4. Review server logs: `pm2 logs zyfar-pulse`

---

## 🎯 Project Goals

✅ **NO MongoDB** - Use local JSON storage  
✅ **NO External Databases** - Everything on VPS  
✅ **NO Cloud Services** - Self-contained deployment  
✅ **Professional UI** - Beautiful, responsive design  
✅ **Real-time Insights** - Live data visualization  
✅ **Easy Deployment** - Single VPS setup  
✅ **Maintainable** - Simple, clean codebase  

---

## 🚀 Future Enhancements (Optional)

- Export data as CSV
- Admin dashboard
- Email notifications
- Multi-language support
- Advanced filtering
- Data archiving

---

## ✅ Checklist for Deployment

- [ ] Backend code uploaded to VPS
- [ ] Frontend built and uploaded
- [ ] Node.js and PM2 installed
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] Data directory created
- [ ] Backend running with PM2
- [ ] Frontend served by Nginx
- [ ] API endpoints accessible
- [ ] Survey submission tested
- [ ] Data saving verified
- [ ] Charts rendering correctly

---

**Built with ❤️ for travelers across India**

© 2025 Zyfar Pulse. Making travel insights accessible to everyone.
