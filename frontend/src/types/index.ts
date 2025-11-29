export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text' | 'rating';
  options: string[];
}

export interface SurveyCategory {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  questions: SurveyQuestion[];
  questionCount?: number;
}

export interface SurveySubmission {
  category: string;
  questions: string[];
  answers: string[];
  city: string;
  timestamp?: string;
}

export interface LiveStats {
  totalResponses: number;
  aggregated: {
    [questionId: string]: {
      answer: string;
      count: number;
      percentage: number;
    }[];
  };
  topDestinations: {
    name: string;
    count: number;
  }[];
  trends: {
    date: string;
    count: number;
  }[];
}

export interface CityOverview {
  city: string;
  totalResponses: number;
  trendingDestinations: {
    name: string;
    count: number;
  }[];
  safetyIndex: number;
  budgetAverage: string;
  happinessScore: number;
  painPointIndex: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  insight?: string;
}
