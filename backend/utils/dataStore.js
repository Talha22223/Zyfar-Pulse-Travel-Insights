import fs from 'fs';
import path from 'path';

class DataStore {
  constructor() {
    // Use environment variable or fallback to local data directory
    this.dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
    this.surveysFile = path.join(this.dataDir, 'surveys.json');
    this.initialize();
  }

  initialize() {
    try {
      // Create data directory if it doesn't exist
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
        console.log(`✅ Created data directory: ${this.dataDir}`);
      }

      // Create surveys.json if it doesn't exist
      if (!fs.existsSync(this.surveysFile)) {
        fs.writeFileSync(this.surveysFile, JSON.stringify([], null, 2));
        console.log(`✅ Created surveys file: ${this.surveysFile}`);
      }

      console.log(`✅ DataStore initialized at: ${this.dataDir}`);
    } catch (error) {
      console.error('❌ Failed to initialize data store:', error);
      throw error;
    }
  }

  readSurveys() {
    try {
      const data = fs.readFileSync(this.surveysFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading surveys:', error);
      return [];
    }
  }

  writeSurveys(surveys) {
    try {
      fs.writeFileSync(this.surveysFile, JSON.stringify(surveys, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing surveys:', error);
      return false;
    }
  }

  addSurvey(surveyData) {
    try {
      const surveys = this.readSurveys();
      
      // Add timestamp if not provided
      const survey = {
        ...surveyData,
        timestamp: surveyData.timestamp || new Date().toISOString(),
        id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      surveys.push(survey);
      this.writeSurveys(surveys);
      
      console.log(`✅ Survey added: ${survey.id}`);
      return { success: true, id: survey.id };
    } catch (error) {
      console.error('Error adding survey:', error);
      return { success: false, error: error.message };
    }
  }

  getSurveysByCategory(category) {
    const surveys = this.readSurveys();
    return category 
      ? surveys.filter(s => s.category === category)
      : surveys;
  }

  getSurveysByCity(city) {
    const surveys = this.readSurveys();
    return city 
      ? surveys.filter(s => s.city && s.city.toLowerCase() === city.toLowerCase())
      : surveys;
  }

  getAllSurveys() {
    return this.readSurveys();
  }

  getRecentSurveys(limit = 10) {
    const surveys = this.readSurveys();
    return surveys.slice(-limit).reverse();
  }

  getStats() {
    const surveys = this.readSurveys();
    return {
      total: surveys.length,
      categories: this.getCategoryBreakdown(surveys),
      cities: this.getCityBreakdown(surveys),
      recentSubmissions: surveys.slice(-10).reverse()
    };
  }

  getCategoryBreakdown(surveys) {
    const breakdown = {};
    surveys.forEach(survey => {
      breakdown[survey.category] = (breakdown[survey.category] || 0) + 1;
    });
    return breakdown;
  }

  getCityBreakdown(surveys) {
    const breakdown = {};
    surveys.forEach(survey => {
      if (survey.city) {
        breakdown[survey.city] = (breakdown[survey.city] || 0) + 1;
      }
    });
    return breakdown;
  }
}

export default new DataStore();
