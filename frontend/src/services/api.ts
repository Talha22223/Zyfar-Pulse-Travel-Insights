const API_BASE_URL = '/api';

// Helper function for error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Submit survey
  submitSurvey: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  },

  // Get live stats
  getLiveStats: async (category?: string) => {
    try {
      const url = category 
        ? `${API_BASE_URL}/stats/live?category=${category}`
        : `${API_BASE_URL}/stats/live`;
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching live stats:', error);
      throw error;
    }
  },

  // Get city overview
  getCityOverview: async (city?: string) => {
    try {
      const url = city 
        ? `${API_BASE_URL}/stats/city-overview?city=${city}`
        : `${API_BASE_URL}/stats/city-overview`;
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching city overview:', error);
      throw error;
    }
  },

  // Get survey categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/sample-questions`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get questions for a category
  getCategoryQuestions: async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/sample-questions?category=${category}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching category questions:', error);
      throw error;
    }
  },

  // Get recent surveys
  getRecentSurveys: async (limit: number = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/recent?limit=${limit}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching recent surveys:', error);
      throw error;
    }
  },
};
