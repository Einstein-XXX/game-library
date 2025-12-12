import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '../services/backendApi';
import useAuthStore from './useAuthStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cartItems: [],
      
      // Fetch cart from backend
      fetchCart: async () => {
        try {
          const { isAuthenticated } = useAuthStore.getState();
          if (!isAuthenticated) return;
          
          const cart = await cartAPI.getCart();
          // Backend returns ShoppingCart objects with gameId, gameTitle, gameImageUrl, price
          set({ 
            cartItems: cart.map(item => ({
              id: item.gameId,
              gameId: item.gameId,
              name: item.gameTitle,
              title: item.gameTitle,
              background_image: item.gameImageUrl,
              imageUrl: item.gameImageUrl,
              price: item.price,
              addedAt: item.addedAt
            }))
          });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      },
      
      // Actions
      addToCart: async (game) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
          alert('Please login to add games to cart');
          return;
        }
        
        if (!game || !game.id) {
          alert('Invalid game data');
          return;
        }
        
        try {
          console.log('Adding to cart:', game.id, game.name || game.title);
          await cartAPI.addToCart(game.id, game);
          await get().fetchCart();
          // Success - cart will be updated automatically
        } catch (error) {
          console.error('Failed to add to cart:', error);
          
          // Handle authentication errors
          if (error.response?.status === 401 || error.response?.status === 403) {
            alert('Your session has expired. Please login again.');
            // Optionally redirect to login
            return;
          }
          
          // Handle "already in cart" errors gracefully
          const errorMessage = error.response?.data?.message || error.message || 'Failed to add game to cart';
          if (errorMessage.toLowerCase().includes('already in cart')) {
            // Don't show error, just refresh cart to update state
            await get().fetchCart();
            return;
          }
          
          alert(errorMessage);
          throw error; // Re-throw so caller knows it failed
        }
      },
      
      removeFromCart: async (gameId) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await cartAPI.removeFromCart(gameId);
            get().fetchCart();
          } catch (error) {
            console.error('Failed to remove from cart:', error);
          }
        } else {
          set({ 
            cartItems: get().cartItems.filter(item => item.id !== gameId) 
          });
        }
      },
      
      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await cartAPI.clearCart();
          } catch (error) {
            console.error('Failed to clear cart:', error);
          }
        }
        set({ cartItems: [] });
      },
      
      isInCart: (gameId) => {
        return get().cartItems.some(item => item.id === gameId || item.gameId === gameId);
      },
      
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => {
          const price = item.price || 59.99;
          return total + (typeof price === 'number' ? price : parseFloat(price));
        }, 0);
      },
      
      getCartCount: () => get().cartItems.length,
    }),
    {
      name: 'game-cart-storage', // localStorage key
    }
  )
);

export default useCartStore;

