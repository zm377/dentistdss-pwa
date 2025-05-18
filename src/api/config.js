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
    const tokenType = localStorage.getItem('tokenType');
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Check if the response data and success field exist
    if (response.data && typeof response.data.success !== 'undefined') {
      if (response.data.success) {
        // If success is true, return the dataObject (which is response.data.message)
        return response.data.message;
      } else {
        // If success is false, extract the message and dispatch an event
        const errorMessage = response.data.message || 'An unknown error occurred.';
        
        // Dispatch a custom event to show the Snackbar
        const event = new CustomEvent('show-snackbar', {
          detail: {
            message: errorMessage,
            severity: 'error', // Or 'warning', 'info', 'success'
          },
        });
        window.dispatchEvent(event);
        
        // Reject the promise with the error message
        return Promise.reject(new Error(errorMessage));
      }
    }
    // If the response doesn't match the expected structure, return it as is or handle as an error
    // For now, returning the original response if not conforming to the expected structure
    return response;
  },
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

export default api; 