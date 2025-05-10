import axios from 'axios';
import config from '../config';


// Set the base URL based on environment
const baseURL = config.api.baseUrl;

// Create an instance of axios with custom configuration
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle different error statuses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401 && !originalRequest._retry) {
        // Remove token and redirect to login if authentication fails
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
const apiService = {
  // Auth endpoints
  auth: {
    login: (email, password) => api.post('/api/auth/login', { email, password }),
    signup: (userData) => api.post('/api/auth/signup', userData),
    logout: () => api.post('/api/auth/logout'),
    me: () => api.get('/api/auth/me'),
  },
  
  // Add other API endpoints here as needed
  // Example:
  // users: {
  //   getAll: () => api.get('/api/users'),
  //   getById: (id) => api.get(`/api/users/${id}`),
  // },
};

export default apiService; 