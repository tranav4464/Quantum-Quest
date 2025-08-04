// Predictions API Service
import axios from 'axios';
import { getPlatformApiUrl } from '../lib/platform-utils';

// Get the platform-specific API URL
const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_BASE_URL = getPlatformApiUrl(DEFAULT_API_URL);

// Create axios instance with auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Predictions API endpoints
export const predictionsAPI = {
  // Get financial health forecast
  getFinancialHealthForecast: async () => {
    try {
      const response = await apiClient.get('/analytics/financial-health-forecast/');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial health forecast:', error);
      throw error;
    }
  },

  // Get spending forecast
  getSpendingForecast: async () => {
    try {
      const response = await apiClient.get('/analytics/spending-forecast/');
      return response.data;
    } catch (error) {
      console.error('Error fetching spending forecast:', error);
      throw error;
    }
  },

  // Get investment outlook
  getInvestmentOutlook: async () => {
    try {
      const response = await apiClient.get('/analytics/investment-outlook/');
      return response.data;
    } catch (error) {
      console.error('Error fetching investment outlook:', error);
      throw error;
    }
  },

  // Get market insights
  getMarketInsights: async () => {
    try {
      const response = await apiClient.get('/analytics/market-insights/');
      return response.data;
    } catch (error) {
      console.error('Error fetching market insights:', error);
      throw error;
    }
  },

  // Generate comprehensive forecast
  generateForecast: async (type = 'comprehensive') => {
    try {
      const response = await apiClient.post('/analytics/generate-forecast/', {
        type: type
      });
      return response.data;
    } catch (error) {
      console.error('Error generating forecast:', error);
      throw error;
    }
  }
};

export default predictionsAPI;
