import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, libraryAPI } from '../services/backendApi';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      library: [], // User's purchased games
      token: null,
      
      // Actions
      login: async (email, password) => {
        try {
          const response = await authAPI.login(email, password);
          localStorage.setItem('jwt_token', response.token);
          set({ 
            user: {
              userId: response.userId,
              username: response.username,
              email: response.email,
              role: response.role
            }, 
            isAuthenticated: true,
            token: response.token
          });
          
          // Fetch library
          get().fetchLibrary();
          return response;
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (username, email, password) => {
        try {
          const response = await authAPI.register(username, email, password);
          localStorage.setItem('jwt_token', response.token);
          set({ 
            user: {
              userId: response.userId,
              username: response.username,
              email: response.email,
              role: response.role
            }, 
            isAuthenticated: true,
            token: response.token
          });
          return response;
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        }
        localStorage.removeItem('jwt_token');
        set({ 
          user: null, 
          isAuthenticated: false,
          library: [],
          token: null
        });
      },
      
      updateProfile: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
      
      fetchLibrary: async () => {
        try {
          const library = await libraryAPI.getMyGames();
          set({ library: library.map(item => ({ ...item.game, purchasedAt: item.purchasedAt })) });
        } catch (error) {
          console.error('Failed to fetch library:', error);
        }
      },
      
      addToLibrary: (game) => {
        const { library } = get();
        if (!library.find(item => item.id === game.id)) {
          set({ library: [...library, { ...game, purchasedAt: new Date().toISOString() }] });
        }
      },
      
      isInLibrary: (gameId) => {
        return get().library.some(item => item.id === gameId || item.gameId === gameId);
      },
      
      getLibrary: () => get().library,
    }),
    {
      name: 'game-auth-storage', // localStorage key
    }
  )
);

export default useAuthStore;

