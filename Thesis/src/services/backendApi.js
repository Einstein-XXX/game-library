import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080/api';

const backendAPI = axios.create({
  baseURL: BACKEND_URL,
});

// Add JWT token to all requests
backendAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors globally
backendAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 - token expired or invalid
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('jwt_token');
        // Clear Zustand stores
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: async (username, email, password) => {
    const response = await backendAPI.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await backendAPI.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await backendAPI.post('/auth/logout');
    return response.data;
  },
};

// Library endpoints
export const libraryAPI = {
  getMyGames: async () => {
    const response = await backendAPI.get('/library/my-games');
    return response.data;
  },

  addToLibrary: async (gameId) => {
    const response = await backendAPI.post(`/library/add/${gameId}`);
    return response.data;
  },

  isInLibrary: async (gameId) => {
    const response = await backendAPI.get(`/library/check/${gameId}`);
    return response.data;
  },
};

// Cart endpoints
export const cartAPI = {
  getCart: async () => {
    const response = await backendAPI.get('/cart');
    return response.data;
  },

  addToCart: async (gameId, gameData) => {
    try {
      // Map RAWG API game data to backend Game model format
      const gamePayload = gameData ? {
        gameId: gameData.id || gameId,
        title: gameData.name || gameData.title,
        imageUrl: gameData.background_image || gameData.imageUrl,
        description: gameData.description || gameData.description_raw,
        price: 59.99, // Default price
        rating: gameData.rating ? parseFloat(gameData.rating) : null,
        genre: gameData.genres && gameData.genres.length > 0 ? gameData.genres[0].name : null,
        developer: gameData.developers && gameData.developers.length > 0 ? gameData.developers[0].name : null,
        platform: gameData.platforms && gameData.platforms.length > 0 ? gameData.platforms[0].platform.name : null,
        releaseDate: gameData.released || null
      } : null;
      
      const response = await backendAPI.post(`/cart/add/${gameId}`, gamePayload);
      return response.data;
    } catch (error) {
      console.error('Add to cart API error:', error);
      throw error;
    }
  },

  removeFromCart: async (gameId) => {
    const response = await backendAPI.delete(`/cart/remove/${gameId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await backendAPI.delete('/cart/clear');
    return response.data;
  },
};

// Order endpoints
export const orderAPI = {
  checkout: async () => {
    const response = await backendAPI.post('/orders/checkout');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await backendAPI.get('/orders/my-orders');
    return response.data;
  },
};

// Wishlist endpoints
export const wishlistAPI = {
  getWishlist: async () => {
    const response = await backendAPI.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (gameId, gameData) => {
    const gamePayload = gameData ? {
      gameId: gameData.id || gameId,
      title: gameData.name || gameData.title,
      imageUrl: gameData.background_image || gameData.imageUrl,
      description: gameData.description || gameData.description_raw,
      price: 59.99,
      rating: gameData.rating ? parseFloat(gameData.rating) : null,
      genre: gameData.genres && gameData.genres.length > 0 ? gameData.genres[0].name : null,
      developer: gameData.developers && gameData.developers.length > 0 ? gameData.developers[0].name : null,
      platform: gameData.platforms && gameData.platforms.length > 0 ? gameData.platforms[0].platform.name : null,
      releaseDate: gameData.released || null
    } : null;
    
    const response = await backendAPI.post(`/wishlist/add/${gameId}`, gamePayload);
    return response.data;
  },

  removeFromWishlist: async (gameId) => {
    const response = await backendAPI.delete(`/wishlist/remove/${gameId}`);
    return response.data;
  },

  isInWishlist: async (gameId) => {
    const response = await backendAPI.get(`/wishlist/check/${gameId}`);
    return response.data;
  },
};

// Review endpoints
export const reviewAPI = {
  getGameReviews: async (gameId) => {
    const response = await backendAPI.get(`/reviews/game/${gameId}`);
    return response.data;
  },

  getGameReviewStats: async (gameId) => {
    const response = await backendAPI.get(`/reviews/game/${gameId}/stats`);
    return response.data;
  },

  addReview: async (gameId, rating, comment) => {
    const response = await backendAPI.post(`/reviews/game/${gameId}`, {
      rating,
      comment
    });
    return response.data;
  },

  deleteReview: async (gameId) => {
    const response = await backendAPI.delete(`/reviews/game/${gameId}`);
    return response.data;
  },
};

// Recommendation endpoints
export const recommendationAPI = {
  getRecommendations: async () => {
    const response = await backendAPI.get('/recommendations');
    return response.data;
  },
};

// Statistics endpoints
export const statsAPI = {
  getUserStats: async () => {
    const response = await backendAPI.get('/stats/user');
    return response.data;
  },
};

// Achievement endpoints
export const achievementAPI = {
  getMyAchievements: async () => {
    const response = await backendAPI.get('/achievements');
    return response.data;
  },
  
  checkAchievements: async () => {
    const response = await backendAPI.post('/achievements/check');
    return response.data;
  },
};

// Admin endpoints
export const adminAPI = {
  getAllUsers: async () => {
    const response = await backendAPI.get('/admin/users');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await backendAPI.get('/admin/orders');
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await backendAPI.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await backendAPI.get('/admin/stats');
    return response.data;
  },
};

export default backendAPI;

