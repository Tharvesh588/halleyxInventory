import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ AUTH APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// ✅ PRODUCTS APIs
export const productsAPI = {
  getAll: () => api.get('/products'),                         // GET /products
  getById: (id) => api.get(`/products/${id}`),                // GET /products/:id
  create: (productData) => api.post('/products', productData),// POST /products
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// ✅ USERS APIs (Admin Role)
export const usersAPI = {
  getAll: () => api.get('/users'),                            // GET /users
  update: (id, data) => api.put(`/users/${id}`, data),        // PUT /users/:id
  delete: (id) => api.delete(`/users/${id}`),                 // DELETE /users/:id
};

// ✅ ORDERS APIs
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),      // POST /orders
  getAll: () => api.get('/orders'),                           // GET /orders
  getById: (id) => api.get(`/orders/${id}`),                  // GET /orders/:id
};
export const cartAPI = {
  get: () => api.get('/cart'),
  update: (data) => api.post('/cart', data),  // FIXED ✅
  clear: () => api.delete('/cart'),
};



export default api;
