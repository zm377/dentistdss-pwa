import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for user geolocation
 * 
 * Features:
 * - Automatic location detection
 * - Permission handling
 * - Error state management
 * - Location caching
 * - Privacy-conscious implementation
 */
export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  /**
   * Get user's current position
   */
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 300000, // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        setUserLocation(location);
        setLocationLoading(false);
        setPermissionStatus('granted');
        
        // Cache location in sessionStorage for this session
        try {
          sessionStorage.setItem('userLocation', JSON.stringify(location));
        } catch (error) {
          console.warn('Could not cache user location:', error);
        }
      },
      (error) => {
        setLocationLoading(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied by user.');
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while retrieving location.');
            break;
        }
        
        console.error('Geolocation error:', error);
      },
      options
    );
  };

  /**
   * Check if cached location is still valid
   */
  const loadCachedLocation = () => {
    try {
      const cached = sessionStorage.getItem('userLocation');
      if (cached) {
        const location = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - location.timestamp;
        
        // Use cached location if less than 5 minutes old
        if (cacheAge < 300000) {
          setUserLocation(location);
          return true;
        }
      }
    } catch (error) {
      console.warn('Could not load cached location:', error);
    }
    return false;
  };

  /**
   * Request location permission and get position
   */
  const requestLocation = useCallback(() => {
    // First try to load from cache
    if (!loadCachedLocation()) {
      // If no valid cache, request new location
      getCurrentPosition();
    }
  }, []);

  /**
   * Clear location data
   */
  const clearLocation = () => {
    setUserLocation(null);
    setLocationError(null);
    setPermissionStatus('prompt');
    
    try {
      sessionStorage.removeItem('userLocation');
    } catch (error) {
      console.warn('Could not clear cached location:', error);
    }
  };

  // Auto-request location on mount (if not already denied)
  useEffect(() => {
    // Check if we have permission API support
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);

        if (result.state === 'granted') {
          requestLocation();
        }

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
          if (result.state === 'denied') {
            clearLocation();
          }
        });
      }).catch(() => {
        // Fallback if permissions API is not supported
        requestLocation();
      });
    } else {
      // Fallback for browsers without permissions API
      requestLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // requestLocation is intentionally excluded to prevent re-runs

  /**
   * Calculate distance between two points in kilometers
   * @param {Object} point1 - First point with lat/lng
   * @param {Object} point2 - Second point with lat/lng
   * @returns {number} Distance in kilometers
   */
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return null;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    // State
    userLocation,
    locationError,
    locationLoading,
    permissionStatus,
    
    // Actions
    requestLocation,
    clearLocation,
    getCurrentPosition,
    
    // Utilities
    calculateDistance,
    
    // Computed values
    hasLocation: !!userLocation,
    isLocationAvailable: !!navigator.geolocation,
  };
};
