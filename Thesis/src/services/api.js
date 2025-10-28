import axios from 'axios';

const API_KEY = '9bb25de7001443d096ea366e1e990de1';
const BASE_URL = 'https://api.rawg.io/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const gamesAPI = {
  // Get list of games with optional filters
  getGames: async (params = {}) => {
    try {
      const response = await apiClient.get('/games', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  // Get a single game by ID
  getGameById: async (id) => {
    try {
      const response = await apiClient.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game ${id}:`, error);
      throw error;
    }
  },

  // Get game screenshots
  getGameScreenshots: async (id) => {
    try {
      const response = await apiClient.get(`/games/${id}/screenshots`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching screenshots for game ${id}:`, error);
      throw error;
    }
  },

  // Search games
  searchGames: async (query, params = {}) => {
    try {
      const response = await apiClient.get('/games', {
        params: { search: query, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching games:', error);
      throw error;
    }
  },

  // Get genres
  getGenres: async () => {
    try {
      const response = await apiClient.get('/genres');
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // Get platforms
  getPlatforms: async () => {
    try {
      const response = await apiClient.get('/platforms');
      return response.data;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      throw error;
    }
  },
};

export default apiClient;

