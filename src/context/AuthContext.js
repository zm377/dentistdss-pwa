import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api';
import config from '../config';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check auth status on initial load

  // Function to process a received token (from OAuth or direct login)
  const processAuthToken = useCallback(async (token, tokenType = 'Bearer') => {
    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('tokenType', tokenType);
      // Assuming 'api.axiosInstance' is the actual Axios instance
      if (api.axiosInstance && api.axiosInstance.defaults && api.axiosInstance.defaults.headers) {
        api.axiosInstance.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
      } else {
        console.warn("Could not set Authorization header: api.axiosInstance or its defaults/headers are not defined.");
        // Fallback or throw error if this structure is critical and unexpected
        // For now, we proceed assuming it might be an optional setup or handled elsewhere if this path is not valid
      }
      
      console.log('Token stored, fetching user details...');
      const userData = await api.auth.me(); // Fetch user details using the new token
      if (userData && userData.user) { // Assuming api.auth.me() returns { success: true, dataObject: { user: {...} } }
        setCurrentUser(userData.user);
        console.log('User details fetched and context updated:', userData.user);
        return userData.user;
      } else if (userData) { // If userData is directly the user object
        setCurrentUser(userData);
        console.log('User details fetched and context updated (direct user object):', userData);
        return userData;
      }
      else {
        throw new Error('User data not found after token processing.');
      }
    } catch (error) {
      console.error('Failed to process auth token or fetch user:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
      // Assuming 'api.axiosInstance' is the actual Axios instance
      if (api.axiosInstance && api.axiosInstance.defaults && api.axiosInstance.defaults.headers && api.axiosInstance.defaults.headers.common) {
        delete api.axiosInstance.defaults.headers.common['Authorization'];
      } else {
        console.warn("Could not delete Authorization header: api.axiosInstance or its defaults/headers are not defined.");
      }
      setCurrentUser(null);
      throw error;
    }
  }, []);

  // Function to handle login (Email/Password)
  const login = async (email, password) => {
    try {
      console.log(`Attempting login for ${email}`);
      const authData = await api.auth.login(email, password);

      if (authData && authData.accessToken && authData.user) {
        // The authData now directly contains accessToken and user from the successful response
        await processAuthToken(authData.accessToken, authData.tokenType);
        return authData.user;
      } else {
        const errorMessage = 'Login failed: Invalid data structure from API.';
        console.error(errorMessage, authData);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Login failed (AuthContext catch block):', error.message || error);
      throw error;
    }
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
      localStorage.setItem('signupData', JSON.stringify(signupData));

      if (clinicName) signupData.clinicName = clinicName;
      if (existingClinicId) signupData.existingClinicId = existingClinicId;
      
      // Assuming api.auth.signup returns a message like { success: true, dataObject: "User registered..." }
      // It does not log the user in directly.
      const responseMessage = await api.auth.signup(signupData); 
      
      console.log('Signup successful:', responseMessage);
      // For patient role, verification is required.
      // The UI will navigate to a pending verification page.
      return { ...signupData, emailVerificationPending: true, message: responseMessage };
    } catch (error) {
      console.error('Signup failed:', error);
      // Error should already be formatted by the API interceptor
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      console.log('Logging out');
      await api.auth.logout(); // Inform backend
    } catch (error) {
      console.error('Backend logout error (will proceed with client-side logout):', error);
    } finally {
      // Always clear client-side session
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
      // Assuming 'api.axiosInstance' is the actual Axios instance
      if (api.axiosInstance && api.axiosInstance.defaults && api.axiosInstance.defaults.headers && api.axiosInstance.defaults.headers.common) {
        delete api.axiosInstance.defaults.headers.common['Authorization'];
      } else {
        console.warn("Could not delete Authorization header during logout: api.axiosInstance or its defaults/headers are not defined.");
      }
      setCurrentUser(null);
      console.log('Client-side logout complete.');
    }
  }, []);

  // Function to initiate OAuth login flow
  const oauthLogin = (provider) => {
    console.log(`Initiating OAuth login with ${provider}`);
    // Redirect to the backend's Spring Security standard authorization endpoint via API Gateway.
    // The API gateway will route this to the oauth-service.
    // Ensure REACT_APP_API_BASE_URL is configured in your .env file
    const baseUrl = config.api.baseUrl; // Default to localhost:443 (api-gateway)
    window.location.href = `${baseUrl}/oauth2/authorization/${provider.toLowerCase()}`;
  };

  // Function to handle the OAuth redirect, called from a dedicated redirect page/component
  const handleOauthRedirect = useCallback(async () => {
    console.log("Handling OAuth redirect...");
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const error = queryParams.get('error');

    if (error) {
      console.error("OAuth Error:", error);
      setLoading(false);
      return;
    }

    if (token) {
      console.log("Token received from OAuth redirect:", token);
      try {
        await processAuthToken(token);
      } catch (err) {
        console.error("Error processing OAuth token:", err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No token found in OAuth redirect, navigating to login.");
      setLoading(false);
    }
  }, [processAuthToken]);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      if (token) {
        try {
          console.log('Token found, verifying session...');
          // No need to call processAuthToken here, just set header and fetch user
          // Assuming 'api.axiosInstance' is the actual Axios instance
          if (api.axiosInstance && api.axiosInstance.defaults && api.axiosInstance.defaults.headers) {
            api.axiosInstance.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
          } else {
            console.warn("Could not set Authorization header during initial auth check: api.axiosInstance or its defaults/headers are not defined.");
          }
          const userData = await api.auth.me();
          if (userData && userData.user) {
            setCurrentUser(userData.user);
            console.log('Session verified, user set:', userData.user);
          } else if (userData) { // if userData is the user object directly
             setCurrentUser(userData);
             console.log('Session verified, user set (direct object):', userData);
          } else {
             throw new Error("User data not found during initial auth check");
          }
        } catch (error) {
          console.error('Token verification failed during initial load:', error);
          // If 'me' endpoint fails (e.g. token expired), logout
          await logout(); // Use the new logout which clears state
        }
      } else {
        console.log('No token found during initial load.');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [logout]); // Added logout to dependency array

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    signup,
    logout,
    oauthLogin,
    handleOauthRedirect, // Expose this function
    processAuthToken // Expose this if needed elsewhere, e.g. for email verification link auto-login
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only after initial auth check, or always show children and let them adapt */}
      {children}
    </AuthContext.Provider>
  );
};