import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // Keep for setting default headers
import api from '../api';
import config from '../config';


// Set the base URL based on environment
const baseURL = config.api.baseUrl;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check auth status on initial load

  // Function to handle login (Email/Password)
  const login = async (email, password) => {
    try {
      console.log(`Attempting login for ${email}`);
      const response = await api.auth.login(email, password);
      const user = response.data.user;
      const token = response.data.token;
      
      localStorage.setItem('authToken', token); // Store token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set auth header for future requests
      setCurrentUser(user);
      console.log('Login successful');
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is now in the API service interceptor
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  // Function to handle signup (Email/Password)
  const loginWithTokenAndData = (token, userData) => {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentUser(userData);
    console.log('Logged in with verified token:', userData.email);
  };

  const signup = async (email, password, firstName, lastName, role = 'patient', clinicName = null, existingClinicId = null) => {
    try {
      console.log(`Attempting signup for ${email}`);
      
      const signupData = { 
        email, 
        password, 
        firstName,
        lastName,
        role
      };
      
      // Add clinic data if provided
      if (clinicName) signupData.clinicName = clinicName;
      if (existingClinicId) signupData.existingClinicId = existingClinicId;
      
      const response = await api.auth.signup(signupData);
      const user = response.data.user;
      const token = response.data.token;

      // For patient role, we no longer auto-login here. Verification is required.
      if (role === 'patient') {
        console.log('Patient signup successful, email verification required.');
        // Return user details, but don't set token or current user yet.
        // The actual user object might come from the API response or be constructed.
        // For now, we assume the API returns some user info even if not fully authenticated.
        return { ...user, emailVerificationPending: true }; 
      } else if (token) { // For other roles that might auto-login or have different flows
        localStorage.setItem('authToken', token); 
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
        setCurrentUser(user);
        console.log('Signup and login successful for non-patient role or auto-approved role');
      } else {
        // For roles that need approval and don't return a token immediately
        console.log('Signup successful, waiting for approval (non-patient)');
      }
      
      return user; // Return user details, including status
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      console.log('Logging out');
      // Call backend logout endpoint if token exists
      if (localStorage.getItem('authToken')) {
        await api.auth.logout();
      }
      localStorage.removeItem('authToken'); // Remove token
      delete axios.defaults.headers.common['Authorization']; // Remove auth header
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server logout fails
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  };

  // Function to handle OAuth login (placeholder)
  const oauthLogin = (provider) => {
    console.log(`Initiating OAuth login with ${provider}`);
    // Redirect to backend OAuth endpoint
    window.location.href = `${baseURL}/api/auth/oauth/${provider.toLowerCase()}`;
    // Backend will handle the OAuth flow and redirect back with a token/session
  };

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          console.log('Token found, verifying session...');
          const response = await api.auth.me();
          setCurrentUser(response.data.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Session verified');
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
          setCurrentUser(null);
        }
      } else {
        console.log('No token found.');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    signup,
    logout,
    oauthLogin,
    loginWithTokenAndData,
    // Add a function to update user details if needed, e.g., after approval
    // updateUser: (userData) => setCurrentUser(prev => ({...prev, ...userData }))
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after initial auth check */}
    </AuthContext.Provider>
  );
};