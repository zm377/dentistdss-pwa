import axios from 'axios';
import config from '../config';
import { getHttpErrorMessage } from '../utils/httpErrorMessages';

// Set the base URL based on environment
const baseURL = config.api.baseUrl;


// Create an instance of axios with custom configuration
const api = axios.create({
  baseURL,
  withCredentials: true,
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
    console.log(response);
    // Check if the response data and success field exist
    if (response.data && typeof response.data.success !== 'undefined') {
      if (response.data.success) {
        // If there's a success message, optionally show it
        if (response.data.message) {
          const event = new CustomEvent('show-snackbar', {
            detail: {
              message: response.data.message,
              severity: 'success',
            },
          });
          window.dispatchEvent(event);
        }
        
        // Return the data object if it exists, otherwise return the whole response data
        return response.data.dataObject !== undefined ? response.data.dataObject : response.data;
      } else {
        // If success is false, use the message field for error
        const errorMessage = response.data.message || response.data.dataObject || 'An unknown error occurred.';
        
        // Dispatch a custom event to show the Snackbar
        const event = new CustomEvent('show-snackbar', {
          detail: {
            message: errorMessage,
            severity: 'error',
          },
        });
        window.dispatchEvent(event);
        
        // Reject the promise with the error message
        return Promise.reject(new Error(errorMessage));
      }
    }
    // If the response doesn't match the expected structure, return it as is
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    let userMessage = 'An unexpected error occurred.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.status, error.response.data);
      userMessage = getHttpErrorMessage(error.response.status);
      
      // Handle authentication errors
      if (error.response.status === 401 && !originalRequest._retry) {
        // Remove token and redirect to login if authentication fails
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      userMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      userMessage = error.message || userMessage;
    }

    // Dispatch a custom event to show the Snackbar
    const event = new CustomEvent('show-snackbar', {
      detail: {
        message: userMessage,
        severity: 'error',
      },
    });
    window.dispatchEvent(event);

    return Promise.reject(error);
  }
);

// ---- Consolidated API helper objects ----
// Re-create the helper object that used to live in services/apiService.js but now reuses
// the single axios instance defined above.  This keeps all API wiring in one place.
// (Previously exported apiService has been merged into dedicated modules like auth.js)

export default api; 