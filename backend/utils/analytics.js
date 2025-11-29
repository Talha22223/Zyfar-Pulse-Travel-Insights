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

// Calculate city-level overview statistics - FULLY DYNAMIC
export const calculateCityOverview = (city) => {
  const citySurveys = city 
    ? dataStore.getSurveysByCity(city)
    : dataStore.getAllSurveys();

  if (citySurveys.length === 0) {
    return {
      city: city || 'All India',
      totalResponses: 0,
      trendingDestinations: [],
      safetyIndex: null,
      budgetAverage: null,
      happinessScore: null,
      painPointIndex: null,
      categoryBreakdown: {},
      topAnswers: [],
      hasData: false
    };
  }

  // Calculate category breakdown dynamically
  const categoryBreakdown = {};
  citySurveys.forEach(survey => {
    const cat = survey.category || 'unknown';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  });

  // Calculate trending destinations (from any survey that mentions destinations)
  const trendingDestinations = extractTopDestinations(citySurveys).slice(0, 5);

  // Calculate safety index (from safety category) - returns null if no data
  const safetyIndex = calculateSafetyIndex(citySurveys);

  // Calculate budget average (from price sensitivity category) - returns null if no data
  const budgetAverage = calculateBudgetAverage(citySurveys);

  // Calculate happiness score (from post trip feedback + destination experience)
  const happinessScore = calculateHappinessScore(citySurveys);

  // Calculate pain point index (from local problems / city intelligence)
  const painPointIndex = calculatePainPointIndex(citySurveys);

  // Get top answers across all surveys
  const topAnswers = extractTopAnswers(citySurveys);

  return {
    city: city || 'All India',
    totalResponses: citySurveys.length,
    trendingDestinations,
    safetyIndex,
    budgetAverage,
    happinessScore,
    painPointIndex,
    categoryBreakdown,
    topAnswers,
    hasData: true
  };
};

// Helper: Extract top answers from all surveys dynamically
const extractTopAnswers = (surveys) => {
  const allAnswers = {};
  
  surveys.forEach(survey => {
    if (survey.answers && Array.isArray(survey.answers)) {
      survey.answers.forEach(answer => {
        if (answer && typeof answer === 'string' && answer.length < 100) {
          // Skip very long text answers
          allAnswers[answer] = (allAnswers[answer] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(allAnswers)
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
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

// Helper: Calculate safety index (0-100) - returns null if no data
// Checks safety category first, then falls back to any survey with safety-related answers
const calculateSafetyIndex = (surveys) => {
  // First try safety category
  let safetySurveys = surveys.filter(s => s.category === 'safety');
  
  // If no safety surveys, check all surveys for safety-related answers
  if (safetySurveys.length === 0) {
    safetySurveys = surveys; // Check all surveys
  }

  const safetyScores = {
    // Safety category answers
    'Very safe': 100,
    'Safe': 75,
    'Somewhat unsafe': 40,
    'Very unsafe': 10,
    'No concerns': 100,
    'Minor concerns': 60,
    'Major concerns': 20,
    'Yes, absolutely': 100,
    'Yes, somewhat': 70,
    'Not really': 40,
    // City Intelligence severity scores (invert for safety)
    '1 – Very low': 95,
    '2 – Low': 80,
    '3 – Moderate': 60,
    '4 – Serious': 35,
    '5 – Very serious': 15
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

  return count > 0 ? Math.round(totalScore / count) : null;
};

// Helper: Calculate budget average - returns null if no data
// Checks price_sensitivity category first, then falls back to any budget-related answers
const calculateBudgetAverage = (surveys) => {
  // First try price_sensitivity category
  let budgetSurveys = surveys.filter(s => s.category === 'price_sensitivity');
  
  // If no budget surveys, check all surveys
  if (budgetSurveys.length === 0) {
    budgetSurveys = surveys;
  }

  const budgetRanges = {
    'Under ₹10,000': 7500,
    '₹10,000 - ₹25,000': 17500,
    '₹25,000 - ₹50,000': 37500,
    'Above ₹50,000': 75000,
    // Additional budget options that might appear in other surveys
    'Budget (Under ₹15,000)': 10000,
    'Mid-range (₹15,000 - ₹40,000)': 27500,
    'Premium (₹40,000+)': 55000,
    'Less than ₹5,000': 3500,
    '₹5,000 - ₹15,000': 10000,
    '₹15,000 - ₹30,000': 22500,
    '₹30,000+': 45000
  };

  let totalBudget = 0;
  let count = 0;

  budgetSurveys.forEach(survey => {
    if (survey.answers) {
      survey.answers.forEach(answer => {
        const budget = budgetRanges[answer];
        if (budget) {
          totalBudget += budget;
          count++;
        }
      });
    }
  });

  if (count === 0) return null;

  const average = Math.round(totalBudget / count);
  return `₹${average.toLocaleString('en-IN')}`; 
};// Helper: Calculate happiness score (0-100) - returns null if no data
// Checks feedback categories first, then falls back to any satisfaction-related answers
const calculateHappinessScore = (surveys) => {
  // Check multiple categories that indicate happiness/satisfaction
  let feedbackSurveys = surveys.filter(s => 
    s.category === 'post_trip_feedback' || 
    s.category === 'destination_experience'
  );
  
  // If no specific feedback surveys, check all surveys
  if (feedbackSurveys.length === 0) {
    feedbackSurveys = surveys;
  }

  const happinessScores = {
    // Satisfaction/happiness answers
    'Extremely satisfied': 100,
    'Satisfied': 75,
    'Neutral': 50,
    'Dissatisfied': 25,
    'Excellent': 100,
    'Good': 75,
    'Average': 50,
    'Poor': 25,
    'Exceeded expectations': 100,
    'Met expectations': 75,
    'Fell short': 40,
    'Very disappointing': 20,
    'Absolutely yes': 100,
    'Yes, with some tips': 80,
    'Not really': 40,
    'Definitely not': 20,
    'Yes, definitely': 100,
    'Maybe': 50,
    'Maybe, still deciding': 50,
    'No': 25,
    'Not this year': 25,
    'Very welcoming': 100,
    'Friendly': 80,
    'Unwelcoming': 30,
    // Travel intention positive answers
    'Relaxation & escape': 85,
    'Cultural exploration': 80,
    'Adventure & thrill': 90,
    'Family bonding': 85,
    // Trip type happiness
    'Solo adventure': 80,
    'Couple getaway': 85,
    'Family vacation': 80,
    'Friends trip': 90,
    'Business + leisure': 65
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

  return count > 0 ? Math.round(totalScore / count) : null;
};

// Helper: Calculate pain point index
const calculatePainPointIndex = (surveys) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return 'N/A';

  const problems = {};
  
  problemSurveys.forEach(survey => {
    if (survey.answers && survey.answers[0]) {
      // Q1 can now have multiple problems (comma-separated)
      const problemAnswer = survey.answers[0];
      const problemList = problemAnswer.includes(',') 
        ? problemAnswer.split(',').map(p => p.trim())
        : [problemAnswer];
      
      problemList.forEach(problem => {
        if (problem && problem !== 'No issues') {
          problems[problem] = (problems[problem] || 0) + 1;
        }
      });
    }
  });

  if (Object.keys(problems).length === 0) return 'No major issues';

  const topProblem = Object.entries(problems)
    .sort((a, b) => b[1] - a[1])[0];

  return topProblem ? topProblem[0] : 'N/A';
};

// Helper: Calculate severity score for City Intelligence Insight (0-100)
export const calculateSeverityScore = (surveys) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return 0;

  const severityScores = {
    '1 – Very low': 20,
    '2 – Low': 40,
    '3 – Moderate': 60,
    '4 – Serious': 80,
    '5 – Very serious': 100
  };

  let totalScore = 0;
  let count = 0;

  problemSurveys.forEach(survey => {
    // Q2 is severity rating
    if (survey.answers && survey.answers[1]) {
      const severity = survey.answers[1];
      if (severityScores[severity] !== undefined) {
        totalScore += severityScores[severity];
        count++;
      }
    }
  });

  return count > 0 ? Math.round(totalScore / count) : 0;
};

// Helper: Get area-wise problem distribution
export const getAreaWiseProblems = (surveys) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return [];

  const areas = {};
  
  problemSurveys.forEach(survey => {
    // Q3 is location
    if (survey.answers && survey.answers[2]) {
      const location = survey.answers[2];
      areas[location] = (areas[location] || 0) + 1;
    }
  });

  return Object.entries(areas)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);
};

// Helper: Get impact analysis
export const getImpactAnalysis = (surveys) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return [];

  const impacts = {};
  
  problemSurveys.forEach(survey => {
    // Q4 is impact (can be multiple, comma-separated)
    if (survey.answers && survey.answers[3]) {
      const impactAnswer = survey.answers[3];
      const impactList = impactAnswer.includes(',')
        ? impactAnswer.split(',').map(i => i.trim())
        : [impactAnswer];
      
      impactList.forEach(impact => {
        if (impact) {
          impacts[impact] = (impacts[impact] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(impacts)
    .map(([impact, count]) => ({ impact, count }))
    .sort((a, b) => b.count - a.count);
};

// Helper: Get top problems with counts
export const getTopProblems = (surveys, limit = 10) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return [];

  const problems = {};
  
  problemSurveys.forEach(survey => {
    if (survey.answers && survey.answers[0]) {
      const problemAnswer = survey.answers[0];
      const problemList = problemAnswer.includes(',')
        ? problemAnswer.split(',').map(p => p.trim())
        : [problemAnswer];
      
      problemList.forEach(problem => {
        if (problem) {
          problems[problem] = (problems[problem] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(problems)
    .map(([problem, count]) => ({ problem, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Helper: Get city ranking by problems
export const getCityProblemRanking = (surveys) => {
  const problemSurveys = surveys.filter(s => s.category === 'local_problems');
  
  if (problemSurveys.length === 0) return { mostProblematic: [], safest: [] };

  const cityProblems = {};
  const cityCounts = {};
  
  problemSurveys.forEach(survey => {
    const city = survey.city || 'Unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
    
    // Count severity
    if (survey.answers && survey.answers[1]) {
      const severityScores = {
        '1 – Very low': 1,
        '2 – Low': 2,
        '3 – Moderate': 3,
        '4 – Serious': 4,
        '5 – Very serious': 5
      };
      const severity = severityScores[survey.answers[1]] || 3;
      cityProblems[city] = (cityProblems[city] || 0) + severity;
    }
  });

  // Calculate average severity per city
  const cityRankings = Object.keys(cityCounts).map(city => ({
    city,
    count: cityCounts[city],
    avgSeverity: cityProblems[city] ? (cityProblems[city] / cityCounts[city]).toFixed(2) : 0
  }));

  const sorted = cityRankings.sort((a, b) => b.avgSeverity - a.avgSeverity);
  
  return {
    mostProblematic: sorted.slice(0, 5),
    safest: sorted.reverse().slice(0, 5)
  };
};
