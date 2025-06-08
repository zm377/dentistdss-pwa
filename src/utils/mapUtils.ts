/**
 * Map utility functions for the FindAClinic component
 *
 * Features:
 * - PWA-aware navigation
 * - Platform-specific map app integration
 * - Fallback handling for different environments
 * - URL encoding for safe navigation
 */

interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMacOS: boolean;
  isWindows: boolean;
  isMobile: boolean;
}

interface CenterPoint {
  lat: number;
  lng: number;
}

interface NavigationParams {
  latitude: number;
  longitude: number;
  name?: string;
}

/**
 * Detect if the app is running as a PWA
 */
export const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Detect the user's platform
 */
export const detectPlatform = (): PlatformInfo => {
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
 */
export const generateMapsURL = ({ latitude, longitude, name }: NavigationParams): string => {
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
 */
export const openDirections = ({ latitude, longitude, name }: NavigationParams): void => {
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
 */
export const calculateCenter = (locations: Location[]): CenterPoint | null => {
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
 */
export const calculateZoom = (locations: Location[]): number => {
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
 */
export const validateCoordinates = (latitude: number, longitude: number): boolean => {
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
 */
export const formatCoordinates = (latitude: number, longitude: number, precision: number = 6): string => {
  if (!validateCoordinates(latitude, longitude)) {
    return 'Invalid coordinates';
  }
  
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
};
