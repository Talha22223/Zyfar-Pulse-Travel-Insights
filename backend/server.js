import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import dataStore from './utils/dataStore.js';
import { calculateLiveStats, calculateCityOverview } from './utils/analytics.js';
import { SURVEY_CATEGORIES } from './config/surveyConfig.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : [
      'http://localhost:3003', 
      'http://localhost:5173', 
      'https://zyfar-pulse-travel-insights-fronten.vercel.app',
      'https://31.97.203.109',
      'http://31.97.203.109'
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting - Environment aware
const isProduction = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: isProduction ? 15 * 60 * 1000 : 1 * 60 * 1000, // 15 min in prod, 1 min in dev
  max: isProduction ? 200 : 1000, // Stricter in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    });
  }
});

const submitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isProduction ? 10 : 50, // 10 submissions per minute in production
  message: 'Too many survey submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Submit rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many survey submissions, please slow down.'
    });
  }
});

app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'production') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    dataStore: 'active'
  });
});

// ==================== API ENDPOINTS ====================

// 1. POST /api/surveys/submit - Submit a survey
app.post('/api/surveys/submit', submitLimiter, (req, res) => {
  try {
    const { category, questions, answers, city, timestamp } = req.body;

    // Validation
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category is required' 
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Answers array is required and must not be empty' 
      });
    }

    // Validate category exists
    if (!SURVEY_CATEGORIES[category]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid category' 
      });
    }

    // Store survey
    const surveyData = {
      category,
      questions: questions || SURVEY_CATEGORIES[category].questions.map(q => q.id),
      answers,
      city: city || 'Unknown',
      timestamp: timestamp || new Date().toISOString()
    };

    const result = dataStore.addSurvey(surveyData);

    if (result.success) {
      // Get personalized insight for the user
      const stats = calculateLiveStats(category);
      const userAnswer = answers[0];
      const questionStats = Object.values(stats.aggregated)[0] || [];
      const userStat = questionStats.find(s => s.answer === userAnswer);
      
      const personalizedInsight = userStat 
        ? `You're part of ${userStat.percentage}% who chose "${userAnswer}"!`
        : 'Thanks for your response!';

      res.json({ 
        success: true,
        id: result.id,
        message: 'Survey submitted successfully',
        insight: personalizedInsight
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to save survey' 
      });
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// 2. GET /api/stats/live - Get live statistics
app.get('/api/stats/live', (req, res) => {
  try {
    const { category } = req.query;

    // Validate category if provided
    if (category && !SURVEY_CATEGORIES[category]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid category' 
      });
    }

    const stats = calculateLiveStats(category);

    res.json({
      success: true,
      category: category || 'all',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching live stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// 3. GET /api/stats/city-overview - Get city-level overview
app.get('/api/stats/city-overview', (req, res) => {
  try {
    const { city } = req.query;

    const overview = calculateCityOverview(city);

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching city overview:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// 4. GET /api/surveys/sample-questions - Get sample questions for a category
app.get('/api/surveys/sample-questions', (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      // Return all categories
      const allCategories = Object.values(SURVEY_CATEGORIES).map(cat => ({
        id: cat.id,
        title: cat.title,
        emoji: cat.emoji,
        tagline: cat.tagline,
        questionCount: cat.questions.length
      }));

      return res.json({
        success: true,
        categories: allCategories
      });
    }

    // Return specific category questions
    const categoryData = SURVEY_CATEGORIES[category];

    if (!categoryData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    res.json({
      success: true,
      category: categoryData
    });
  } catch (error) {
    console.error('Error fetching sample questions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get recent surveys
app.get('/api/surveys/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const surveys = dataStore.getRecentSurveys(limit);
    res.json({
      success: true,
      data: surveys
    });
  } catch (error) {
    console.error('Error fetching recent surveys:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get all surveys (for admin/debugging - optional)
app.get('/api/surveys/all', (req, res) => {
  try {
    const stats = dataStore.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching all surveys:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 Zyfar Pulse Backend Server Running   ║
╚════════════════════════════════════════════╝

📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
💾 Data Directory: ${dataStore.dataDir}
⏰ Started at: ${new Date().toLocaleString()}

API Endpoints:
  POST   /api/surveys/submit
  GET    /api/stats/live?category=X
  GET    /api/stats/city-overview?city=X
  GET    /api/surveys/sample-questions?category=X
  GET    /api/surveys/recent?limit=X
  GET    /health
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed');
    console.log('Shutdown complete. Exiting...');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
