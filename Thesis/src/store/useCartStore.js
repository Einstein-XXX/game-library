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
          const cart = await cartAPI.getCart();
          set({ cartItems: cart.map(item => ({ ...item.game, addedAt: item.addedAt })) });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      },
      
      // Actions
      addToCart: async (game) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await cartAPI.addToCart(game.id);
            get().fetchCart();
          } catch (error) {
            console.error('Failed to add to cart:', error);
          }
        } else {
          // Fallback to localStorage if not authenticated
          const { cartItems } = get();
          const existingItem = cartItems.find(item => item.id === game.id);
          
          if (!existingItem) {
            set({ 
              cartItems: [...cartItems, { 
                ...game, 
                addedAt: new Date().toISOString() 
              }] 
            });
          }
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
        return get().cartItems.length * 59.99;
      },
      
      getCartCount: () => get().cartItems.length,
    }),
    {
      name: 'game-cart-storage', // localStorage key
    }
  )
);

export default useCartStore;

