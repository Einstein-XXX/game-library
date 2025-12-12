import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistAPI } from '../services/backendApi';
import useAuthStore from './useAuthStore';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      wishlistItems: [],
      
      // Fetch wishlist from backend
      fetchWishlist: async () => {
        try {
          const { isAuthenticated } = useAuthStore.getState();
          if (!isAuthenticated) return;
          
          const wishlist = await wishlistAPI.getWishlist();
          set({ 
            wishlistItems: wishlist.map(item => ({
              id: item.gameId,
              gameId: item.gameId,
              name: item.gameTitle,
              title: item.gameTitle,
              background_image: item.gameImageUrl,
              imageUrl: item.gameImageUrl,
              addedAt: item.addedAt
            }))
          });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      },
      
      // Actions
      addToWishlist: async (game) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await wishlistAPI.addToWishlist(game.id, game);
            await get().fetchWishlist();
          } catch (error) {
            console.error('Failed to add to wishlist:', error);
            alert(error.response?.data?.message || 'Failed to add game to wishlist');
          }
        } else {
          const { wishlistItems } = get();
          const existingItem = wishlistItems.find(item => item.id === game.id);
          
          if (!existingItem) {
            set({ 
              wishlistItems: [...wishlistItems, { 
                ...game, 
                addedAt: new Date().toISOString() 
              }] 
            });
          }
        }
      },
      
      removeFromWishlist: async (gameId) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await wishlistAPI.removeFromWishlist(gameId);
            await get().fetchWishlist();
          } catch (error) {
            console.error('Failed to remove from wishlist:', error);
          }
        } else {
          set({ 
            wishlistItems: get().wishlistItems.filter(item => item.id !== gameId) 
          });
        }
      },
      
      isInWishlist: (gameId) => {
        return get().wishlistItems.some(item => item.id === gameId || item.gameId === gameId);
      },
      
      getWishlistCount: () => get().wishlistItems.length,
    }),
    {
      name: 'game-wishlist-storage',
    }
  )
);

export default useWishlistStore;

