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
      
      // Set auth directly (for OAuth2)
      setAuth: (user, token) => {
        localStorage.setItem('jwt_token', token);
        set({ 
          user: user, 
          isAuthenticated: true,
          token: token
        });
        // Fetch library
        get().fetchLibrary();
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
          // Backend returns GameLibrary objects with gameId, gameTitle, gameImageUrl, pricePaid
          set({ 
            library: library.map(item => ({
              id: item.gameId,
              gameId: item.gameId,
              name: item.gameTitle,
              title: item.gameTitle,
              background_image: item.gameImageUrl,
              imageUrl: item.gameImageUrl,
              pricePaid: item.pricePaid,
              purchasedAt: item.purchasedAt
            }))
          });
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

