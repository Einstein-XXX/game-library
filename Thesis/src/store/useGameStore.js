import { create } from 'zustand';
import { gamesAPI } from '../services/api';

const useGameStore = create((set, get) => ({
  // State
  games: [],
  selectedGame: null,
  genres: [],
  platforms: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    genre: null,
    platform: null,
    ordering: '-added', // Default to recently added
  },

  // Actions
  setGames: (games) => set({ games }),
  
  setSelectedGame: (game) => set({ selectedGame: game }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  // Fetch games with filters
  fetchGames: async (page = 1, pageSize = 20) => {
    set({ loading: true, error: null });
    try {
      const { filters, searchQuery } = get();
      const params = {
        page,
        page_size: pageSize,
        ordering: filters.ordering,
      };

      if (searchQuery) params.search = searchQuery;
      if (filters.genre) params.genres = filters.genre;
      if (filters.platform) params.platforms = filters.platform;

      const data = await gamesAPI.getGames(params);
      set({ games: data.results, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch a single game by ID
  fetchGameById: async (id) => {
    set({ loading: true, error: null });
    try {
      const game = await gamesAPI.getGameById(id);
      set({ selectedGame: game, loading: false });
      return game;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch genres
  fetchGenres: async () => {
    try {
      const data = await gamesAPI.getGenres();
      set({ genres: data.results });
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  },

  // Fetch platforms
  fetchPlatforms: async () => {
    try {
      const data = await gamesAPI.getPlatforms();
      set({ platforms: data.results });
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  },

  // Search games
  searchGames: async (query) => {
    set({ searchQuery: query, loading: true, error: null });
    try {
      const data = await gamesAPI.searchGames(query);
      set({ games: data.results, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Reset filters
  resetFilters: () => set({
    filters: { genre: null, platform: null, ordering: '-added' },
    searchQuery: '',
  }),
}));

export default useGameStore;

