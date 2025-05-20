import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api';

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
      }
      
      console.log('Token stored, fetching user details...');
      const userData = await api.auth.me(); // Fetch user details using the new token
      if (userData && userData.user) {
        setCurrentUser(userData.user);
        // console.log('User details fetched and context updated:', userData.user);
        return userData.user;
      } else if (userData) {
        setCurrentUser(userData);
        // console.log('User details fetched and context updated (direct user object):', userData);
        return userData;
      }
      else {
        throw new Error('User data not found after token processing.');
      }
    } catch (error) {
      console.error('Failed to process auth token or fetch user:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
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
        // processAuthToken will be called with the token, and it will fetch the user
        await processAuthToken(authData.accessToken, authData.tokenType || 'Bearer');
        // The user object is returned for immediate use if needed, though context will update
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
      
      const responseMessage = await api.auth.signup(signupData); 
      
      console.log('Signup successful:', responseMessage);
      return { ...signupData, emailVerificationPending: true, message: responseMessage };
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      console.log('Logging out');
      await api.auth.logout(); 
    } catch (error) {
      console.error('Backend logout error (will proceed with client-side logout):', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
      if (api.axiosInstance && api.axiosInstance.defaults && api.axiosInstance.defaults.headers && api.axiosInstance.defaults.headers.common) {
        delete api.axiosInstance.defaults.headers.common['Authorization'];
      } else {
        console.warn("Could not delete Authorization header during logout: api.axiosInstance or its defaults/headers are not defined.");
      }
      setCurrentUser(null);
      console.log('Client-side logout complete.');
    }
  }, []);

  // ---- GOOGLE OAUTH (ID-TOKEN POPUP FLOW) ----
  // This helper receives the `credential` (ID token) generated by the
  // Google Identity Services popup. It forwards the token to the backend,
  // then stores & processes the internal JWT returned by our API.

  const googleIdLogin = useCallback(async (idToken) => {
    try {
      if (!idToken) throw new Error('Missing Google ID token');

      console.log('Received Google ID token, sending to backend for verification…');

      const backendTokenData = await api.auth.loginWithGoogleIdToken(idToken);

      if (backendTokenData && backendTokenData.accessToken) {
        await processAuthToken(backendTokenData.accessToken, backendTokenData.tokenType || 'Bearer');
        console.log('Google login successful – internal session established.');
        return backendTokenData.user || null;
      }
      throw new Error('Invalid response from backend after Google ID token exchange.');
    } catch (error) {
      console.error('Google ID-token login failed:', error);
      throw error;
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
          if (api.axiosInstance && api.axiosInstance.defaults && api.axiosInstance.defaults.headers) {
            api.axiosInstance.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
          } else {
            console.warn("Could not set Authorization header during initial auth check: api.axiosInstance or its defaults/headers are not defined.");
          }
          const userData = await api.auth.me();
          if (userData && userData.user) {
            setCurrentUser(userData.user);
            // console.log('Session verified, user set:', userData.user);
          } else if (userData) { 
             setCurrentUser(userData);
            //  console.log('Session verified, user set (direct object):', userData);
          } else {
             throw new Error("User data not found during initial auth check");
          }
        } catch (error) {
          console.error('Token verification failed during initial load:', error);
          await logout(); 
        }
      } else {
        console.log('No token found during initial load.');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [logout, processAuthToken]); // Added processAuthToken to ensure it's stable if defined inside AuthProvider

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    signup,
    logout,
    googleIdLogin,
    processAuthToken 
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only after initial auth check, or always show children and let them adapt */}
      {children}
    </AuthContext.Provider>
  );
};