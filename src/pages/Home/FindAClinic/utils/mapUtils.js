/**
 * Map utility functions for the FindAClinic component
 * 
 * Features:
 * - PWA-aware navigation
 * - Platform-specific map app integration
 * - Fallback handling for different environments
 * - URL encoding for safe navigation
 */

/**
 * Detect if the app is running as a PWA
 * @returns {boolean} True if running as PWA
 */
export const isPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Detect the user's platform
 * @returns {Object} Platform detection results
 */
export const detectPlatform = () => {
  const ua = window.navigator.userAgent;
  
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
    isMacOS: /Macintosh|MacIntel|MacPPC|Mac68K/.test(ua),
    isWindows: /Win32|Win64|Windows|WinCE/.test(ua),
    isMobile: /Mobi|Android/i.test(ua),
  };
};

/**
 * Generate appropriate maps URL based on platform and PWA status
 * @param {Object} params - Navigation parameters
 * @param {number} params.latitude - Destination latitude
 * @param {number} params.longitude - Destination longitude
 * @param {string} params.name - Location name
 * @returns {string} Maps URL
 */
export const generateMapsURL = ({ latitude, longitude, name }) => {
  const platform = detectPlatform();
  const isStandalone = isPWA();
  const encodedName = encodeURIComponent(name || 'Dental Clinic');
  
  // PWA installed - use native map apps
  if (isStandalone) {
    if (platform.isIOS) {
      // Apple Maps for iOS PWA
      return `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodedName}`;
    } else if (platform.isAndroid) {
      // Google Maps intent for Android PWA
      return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedName})`;
    }
  }
  
  // Browser fallback - always use Google Maps web
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};

/**
 * Open directions to a location
 * @param {Object} params - Navigation parameters
 * @param {number} params.latitude - Destination latitude
 * @param {number} params.longitude - Destination longitude
 * @param {string} params.name - Location name
 */
export const openDirections = ({ latitude, longitude, name }) => {
  if (!latitude || !longitude) {
    console.warn('Invalid coordinates provided for directions');
    return;
  }
  
  try {
    const url = generateMapsURL({ latitude, longitude, name });
    
    // Open in new tab/window
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    // Fallback if popup was blocked
    if (!newWindow) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Error opening directions:', error);
    
    // Ultimate fallback - copy coordinates to clipboard
    if (navigator.clipboard) {
      const coords = `${latitude}, ${longitude}`;
      navigator.clipboard.writeText(coords).then(() => {
        alert(`Could not open maps. Coordinates copied to clipboard: ${coords}`);
      }).catch(() => {
        alert(`Could not open maps. Coordinates: ${latitude}, ${longitude}`);
      });
    } else {
      alert(`Could not open maps. Coordinates: ${latitude}, ${longitude}`);
    }
  }
};

/**
 * Calculate the center point of multiple locations
 * @param {Array} locations - Array of location objects with lat/lng
 * @returns {Object|null} Center point or null if no valid locations
 */
export const calculateCenter = (locations) => {
  const validLocations = locations.filter(
    loc => loc.latitude && loc.longitude
  );
  
  if (validLocations.length === 0) {
    return null;
  }
  
  if (validLocations.length === 1) {
    return {
      lat: validLocations[0].latitude,
      lng: validLocations[0].longitude,
    };
  }
  
  const sum = validLocations.reduce(
    (acc, loc) => ({
      lat: acc.lat + loc.latitude,
      lng: acc.lng + loc.longitude,
    }),
    { lat: 0, lng: 0 }
  );
  
  return {
    lat: sum.lat / validLocations.length,
    lng: sum.lng / validLocations.length,
  };
};

/**
 * Calculate appropriate zoom level based on locations spread
 * @param {Array} locations - Array of location objects with lat/lng
 * @returns {number} Appropriate zoom level
 */
export const calculateZoom = (locations) => {
  const validLocations = locations.filter(
    loc => loc.latitude && loc.longitude
  );
  
  if (validLocations.length === 0) {
    return 11; // Default zoom
  }
  
  if (validLocations.length === 1) {
    return 15; // Close zoom for single location
  }
  
  // Calculate the span of coordinates
  const lats = validLocations.map(loc => loc.latitude);
  const lngs = validLocations.map(loc => loc.longitude);
  
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);
  const maxSpan = Math.max(latSpan, lngSpan);
  
  // Determine zoom based on coordinate span
  if (maxSpan > 10) return 6;   // Very wide area
  if (maxSpan > 5) return 7;    // Wide area
  if (maxSpan > 2) return 8;    // Large area
  if (maxSpan > 1) return 9;    // Medium area
  if (maxSpan > 0.5) return 10; // Small area
  if (maxSpan > 0.1) return 12; // Very small area
  return 14; // Tight cluster
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude value
 * @param {number} longitude - Longitude value
 * @returns {boolean} True if coordinates are valid
 */
export const validateCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
};

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude value
 * @param {number} longitude - Longitude value
 * @param {number} precision - Decimal places (default: 6)
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (latitude, longitude, precision = 6) => {
  if (!validateCoordinates(latitude, longitude)) {
    return 'Invalid coordinates';
  }
  
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
};
