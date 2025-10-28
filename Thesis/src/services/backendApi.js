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

  addToCart: async (gameId) => {
    const response = await backendAPI.post(`/cart/add/${gameId}`);
    return response.data;
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

