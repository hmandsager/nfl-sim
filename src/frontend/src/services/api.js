import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// API functions for working with players
export const playerApi = {
  // Get all players, optionally filtered by position
  getPlayers: async (position = null) => {
    try {
      const url = position ? `/players?position=${position}` : '/players';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },
  
  // Get available positions
  getPositions: async () => {
    try {
      const response = await api.get('/positions');
      return response.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }
};

// API functions for working with draft settings
export const draftApi = {
  // Save draft settings
  saveDraftSettings: async (settings) => {
    try {
      const response = await api.post('/draft-settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error saving draft settings:', error);
      throw error;
    }
  }
};

export default api;
