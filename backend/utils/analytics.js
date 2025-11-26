import dataStore from '../utils/dataStore.js';

// Calculate aggregated statistics for live insights
export const calculateLiveStats = (category) => {
  const surveys = category 
    ? dataStore.getSurveysByCategory(category)
    : dataStore.getAllSurveys();

  if (surveys.length === 0) {
    return {
      totalResponses: 0,
      aggregated: {},
      topDestinations: [],
      trends: []
    };
  }

  // Aggregate answers by question
  const aggregated = {};
  
  surveys.forEach(survey => {
    if (survey.answers && Array.isArray(survey.answers)) {
      survey.answers.forEach((answer, index) => {
        const questionId = survey.questions?.[index] || `q${index}`;
        
        if (!aggregated[questionId]) {
          aggregated[questionId] = {};
        }

        if (!aggregated[questionId][answer]) {
          aggregated[questionId][answer] = 0;
        }

        aggregated[questionId][answer]++;
      });
    }
  });

  // Calculate percentages
  const aggregatedWithPercentages = {};
  Object.keys(aggregated).forEach(questionId => {
    const answers = aggregated[questionId];
    const total = Object.values(answers).reduce((sum, count) => sum + count, 0);
    
    aggregatedWithPercentages[questionId] = Object.entries(answers).map(([answer, count]) => ({
      answer,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  });

  // Extract top destinations (from travel intention category)
  const topDestinations = extractTopDestinations(surveys);

  // Generate trend data (last 30 days)
  const trends = generateTrends(surveys);

  return {
    totalResponses: surveys.length,
    aggregated: aggregatedWithPercentages,
    topDestinations,
    trends
  };
};

// Calculate city-level overview statistics
export const calculateCityOverview = (city) => {
  const citySurveys = city 
    ? dataStore.getSurveysByCity(city)
    : dataStore.getAllSurveys();

  if (citySurveys.length === 0) {
    return {
      city: city || 'All India',
      totalResponses: 0,
      trendingDestinations: [],
      safetyIndex: 0,
      budgetAverage: 'N/A',
      happinessScore: 0,
      painPointIndex: 'N/A'
    };
  }

  // Calculate trending destinations
  const trendingDestinations = extractTopDestinations(citySurveys).slice(0, 5);

  // Calculate safety index (from safety category)
  const safetyIndex = calculateSafetyIndex(citySurveys);

  // Calculate budget average (from price sensitivity category)
  const budgetAverage = calculateBudgetAverage(citySurveys);

  // Calculate happiness score (from post trip feedback)
  const happinessScore = calculateHappinessScore(citySurveys);

  // Calculate pain point index (from local problems)
  const painPointIndex = calculatePainPointIndex(citySurveys);

  return {
    city: city || 'All India',
    totalResponses: citySurveys.length,
    trendingDestinations,
    safetyIndex,
    budgetAverage,
    happinessScore,
    painPointIndex
  };
};

// Helper: Extract top destinations from surveys
const extractTopDestinations = (surveys) => {
  const destinations = {};
  
  surveys.forEach(survey => {
    if (survey.category === 'travel_intention' && survey.answers) {
      // Question 2 is about destination
      const destination = survey.answers[1];
      if (destination) {
        destinations[destination] = (destinations[destination] || 0) + 1;
      }
    }
  });

  return Object.entries(destinations)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

// Helper: Generate trend data for the last 30 days
const generateTrends = (surveys) => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const dailyCounts = {};
  
  surveys.forEach(survey => {
    const surveyDate = new Date(survey.timestamp);
    if (surveyDate >= last30Days) {
      const dateKey = surveyDate.toISOString().split('T')[0];
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    }
  });

  return Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Helper: Calculate safety index (0-100)
const calculateSafetyIndex = (surveys) => {
  const safetySurveys = surveys.filter(s => s.category === 'safety');
  
  if (safetySurveys.length === 0) return 0;

  const safetyScores = {
    'Very safe': 100,
    'Safe': 75,
    'Somewhat unsafe': 40,
    'Very unsafe': 10,
    'No concerns': 100,
    'Minor concerns': 60,
    'Major concerns': 20
  };

  let totalScore = 0;
  let count = 0;

  safetySurveys.forEach(survey => {
    if (survey.answers) {
      survey.answers.forEach(answer => {
        if (safetyScores[answer] !== undefined) {
          totalScore += safetyScores[answer];
          count++;
        }
      });
    }
  });

  return count > 0 ? Math.round(totalScore / count) : 0;
};

// Helper: Calculate budget average
const calculateBudgetAverage = (surveys) => {
  const budgetSurveys = surveys.filter(s => s.category === 'price_sensitivity');
  
  if (budgetSurveys.length === 0) return 'N/A';

  const budgetRanges = {
    'Under ₹10,000': 7500,
    '₹10,000 - ₹25,000': 17500,
    '₹25,000 - ₹50,000': 37500,
    'Above ₹50,000': 75000
  };

  let totalBudget = 0;
  let count = 0;

  budgetSurveys.forEach(survey => {
    if (survey.answers && survey.answers[0]) {
      const budget = budgetRanges[survey.answers[0]];
      if (budget) {
        totalBudget += budget;
        count++;
      }
    }
  });

  if (count === 0) return 'N/A';

  const average = Math.round(totalBudget / count);
  return `₹${average.toLocaleString('en-IN')}`;
};

// Helper: Calculate happiness score (0-100)
const calculateHappinessScore = (surveys) => {
  const feedbackSurveys = surveys.filter(s => s.category === 'post_trip_feedback');
  
  if (feedbackSurveys.length === 0) return 0;

  const happinessScores = {
    'Extremely satisfied': 100,
    'Satisfied': 75,
    'Neutral': 50,
    'Dissatisfied': 25,
    'Excellent': 100,
    'Good': 75,
    'Average': 50,
    'Poor': 25
  };

  let totalScore = 0;
  let count = 0;

  feedbackSurveys.forEach(survey => {
    if (survey.answers) {
      survey.answers.forEach(answer => {
        if (happinessScores[answer] !== undefined) {
          totalScore += happinessScores[answer];
          count++;
        }
      });
    }
  });

  return count > 0 ? Math.round(totalScore / count) : 0;
};

// Helper: Calculate pain point index
const calculatePainPointIndex = (surveys) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return 'N/A';

  const problems = {};
  
  problemSurveys.forEach(survey => {
    if (survey.answers && survey.answers[0] && survey.answers[0] !== 'No issues') {
      const problem = survey.answers[0];
      problems[problem] = (problems[problem] || 0) + 1;
    }
  });

  if (Object.keys(problems).length === 0) return 'No major issues';

  const topProblem = Object.entries(problems)
    .sort((a, b) => b[1] - a[1])[0];

  return topProblem ? topProblem[0] : 'N/A';
};
