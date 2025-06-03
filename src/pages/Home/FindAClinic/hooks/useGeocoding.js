import { useState, useEffect, useRef, useCallback } from 'react';
import { geocodeAddress } from '../../../../utils/geocode';
import config from '../../../../config';

/**
 * Custom hook for geocoding clinic addresses
 *
 * Features:
 * - Automatic geocoding of clinic addresses
 * - Caching to prevent duplicate API calls
 * - Loading state management
 * - Error handling for failed geocoding
 * - Memory cleanup on unmount
 */
export const useGeocoding = (clinics) => {

  const [clinicsWithCoords, setClinicsWithCoords] = useState([]);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);

  // Track if we've processed the current clinics array
  const processedClinicsRef = useRef(null);

  // Immediate fallback: if clinics change and we don't have coords yet, set the original clinics
  useEffect(() => {
    console.log('🗺️ useGeocoding fallback check:', {
      clinicsLength: clinics?.length || 0,
      clinicsWithCoordsLength: clinicsWithCoords.length,
      geocoding,
      shouldSetFallback: clinics && clinics.length > 0 && clinicsWithCoords.length === 0 && !geocoding
    });

    // Only set fallback if we haven't processed these clinics yet and we're not geocoding
    if (clinics && clinics.length > 0 && clinicsWithCoords.length === 0 && !geocoding && processedClinicsRef.current !== clinics) {
      console.log('🗺️ Setting fallback clinics without geocoding');
      setClinicsWithCoords(clinics);
      processedClinicsRef.current = clinics;
    }
  }, [clinics, clinicsWithCoords.length, geocoding]);

  // Cache for geocoded addresses to prevent duplicate API calls
  const geocodeCache = useRef({});

  // Track component mount status for cleanup
  const isMountedRef = useRef(true);

  /**
   * Generate cache key for clinic address
   * @param {Object} clinic - Clinic object
   * @returns {string} Cache key
   */
  const generateCacheKey = (clinic) => {
    const addressParts = [
      clinic.address,
      clinic.city,
      clinic.state,
      clinic.zipCode,
      clinic.country
    ].filter(Boolean);
    
    return addressParts.join(',').toLowerCase().trim();
  };

  /**
   * Geocode a single clinic
   * @param {Object} clinic - Clinic object
   * @returns {Object} Clinic with coordinates
   */
  const geocodeClinic = useCallback(async (clinic) => {

    // Return clinic as-is if it already has coordinates
    if (clinic.latitude && clinic.longitude) {
      return clinic;
    }

    // Generate cache key
    const cacheKey = generateCacheKey(clinic);

    // Return cached result if available
    if (geocodeCache.current[cacheKey]) {
      return {
        ...clinic,
        ...geocodeCache.current[cacheKey]
      };
    }

    try {
      // Attempt to geocode the address
      const coords = await geocodeAddress({
        address: clinic.address,
        city: clinic.city,
        state: clinic.state,
        zipCode: clinic.zipCode,
        country: clinic.country,
      });


      if (coords) {
        // Cache the successful result
        geocodeCache.current[cacheKey] = coords;

        return {
          ...clinic,
          ...coords
        };
      }
    } catch (error) {
      console.warn(`🗺️ geocodeClinic: Geocoding failed for clinic ${clinic.name}:`, error);
    }

    // Return original clinic if geocoding fails
    return clinic;
  }, []);

  /**
   * Geocode all clinics in the array
   */
  const geocodeClinics = useCallback(async () => {
    console.log('🗺️ geocodeClinics called with:', {
      clinicsLength: clinics?.length || 0,
      hasApiKey: !!config.api.google.mapsApiKey
    });

    if (!clinics || !clinics.length) {
      console.log('🗺️ No clinics to geocode, clearing coords');
      setClinicsWithCoords([]);
      return;
    }

    setGeocoding(true);
    setGeocodingError(null);

    try {
      // For testing: if no Google Maps API key, just return clinics as-is
      const hasApiKey = !!config.api.google.mapsApiKey;

      if (!hasApiKey) {
        console.log('🗺️ No API key, using clinics without geocoding');
        if (isMountedRef.current) {
          setClinicsWithCoords(clinics);
          processedClinicsRef.current = clinics; // Mark these clinics as processed
        }
        return;
      }

      console.log('🗺️ Starting geocoding for', clinics.length, 'clinics');

      // Process clinics in parallel with Promise.all
      const results = await Promise.all(
        clinics.map(clinic => geocodeClinic(clinic))
      );

      console.log('🗺️ Geocoding completed, results:', results.map(r => ({
        name: r.name,
        hasCoords: !!(r.latitude && r.longitude)
      })));

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setClinicsWithCoords(results);
        processedClinicsRef.current = clinics; // Mark these clinics as processed
      }
    } catch (error) {
      console.error('🗺️ geocodeClinics: Geocoding error:', error);

      if (isMountedRef.current) {
        setGeocodingError('Failed to get location data for some clinics.');
        // Still set the clinics even if some geocoding failed
        setClinicsWithCoords(clinics);
        processedClinicsRef.current = clinics; // Mark these clinics as processed
      }
    } finally {
      if (isMountedRef.current) {
        setGeocoding(false);
      }
    }
  }, [clinics, geocodeClinic]);

  // Geocode clinics when the clinics array changes
  useEffect(() => {
    // Only geocode if we have new clinics and we're not already geocoding
    if (clinics && clinics.length > 0 && processedClinicsRef.current !== clinics && !geocoding) {
      geocodeClinics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics]); // Only depend on clinics, not geocodeClinics to prevent infinite loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Clear geocoding cache
   */
  const clearCache = () => {
    geocodeCache.current = {};
  };

  /**
   * Get cache statistics
   */
  const getCacheStats = () => {
    const cacheKeys = Object.keys(geocodeCache.current);
    return {
      size: cacheKeys.length,
      keys: cacheKeys,
    };
  };

  /**
   * Filter clinics with valid coordinates
   */
  const getClinicsWithValidCoords = () => {
    return clinicsWithCoords.filter(
      clinic => clinic.latitude && clinic.longitude
    );
  };

  /**
   * Filter clinics without coordinates
   */
  const getClinicsWithoutCoords = () => {
    return clinicsWithCoords.filter(
      clinic => !clinic.latitude || !clinic.longitude
    );
  };

  return {
    // State
    clinicsWithCoords,
    geocoding,
    geocodingError,
    
    // Actions
    clearCache,
    
    // Utilities
    getCacheStats,
    getClinicsWithValidCoords,
    getClinicsWithoutCoords,
    
    // Computed values
    hasValidCoords: getClinicsWithValidCoords().length > 0,
    geocodingProgress: clinics.length > 0 ? 
      (clinicsWithCoords.length / clinics.length) * 100 : 0,
  };
};
