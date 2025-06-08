import { useState, useEffect, useRef, useCallback } from 'react';
import { geocodeAddress } from '../utils/geocode';
import config from '../config';
import type { ClinicSearchResult } from '../types/api';

interface ClinicWithCoords extends ClinicSearchResult {
  latitude?: number;
  longitude?: number;
}

interface GeocodingResult {
  clinicsWithCoords: ClinicWithCoords[];
  geocoding: boolean;
  geocodingError: string | null;
  clearCache: () => void;
  getCacheStats: () => { size: number; keys: string[] };
  getClinicsWithValidCoords: () => ClinicWithCoords[];
  getClinicsWithoutCoords: () => ClinicWithCoords[];
  hasValidCoords: boolean;
  geocodingProgress: number;
}

interface CacheEntry {
  latitude: number;
  longitude: number;
}

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
export const useGeocoding = (clinics: ClinicSearchResult[]): GeocodingResult => {

  const [clinicsWithCoords, setClinicsWithCoords] = useState<ClinicWithCoords[]>([]);
  const [geocoding, setGeocoding] = useState<boolean>(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  // Track if we've processed the current clinics array
  const processedClinicsRef = useRef<ClinicSearchResult[] | null>(null);

  // Add a timeout to reset geocoding state if it gets stuck
  const geocodingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cache for geocoded addresses to prevent duplicate API calls
  const geocodeCache = useRef<Record<string, CacheEntry>>({});

  // Track component mount status for cleanup
  const isMountedRef = useRef<boolean>(true);

  /**
   * Generate cache key for clinic address
   */
  const generateCacheKey = (clinic: ClinicSearchResult): string => {
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
   */
  const geocodeClinic = useCallback(async (clinic: ClinicSearchResult): Promise<ClinicWithCoords> => {
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
      console.warn(`Geocoding failed for clinic ${clinic.name}:`, error);
    }

    // Return original clinic if geocoding fails
    return clinic;
  }, []);

  /**
   * Geocode all clinics in the array
   */
  const geocodeClinics = useCallback(async (clinicsToGeocode: ClinicSearchResult[]): Promise<void> => {
    if (!clinicsToGeocode || !clinicsToGeocode.length) {
      setClinicsWithCoords([]);
      return;
    }

    setGeocoding(true);
    setGeocodingError(null);

    // Set a timeout to reset geocoding state if it gets stuck (30 seconds)
    geocodingTimeoutRef.current = setTimeout(() => {
      setGeocoding(false);
    }, 30000);

    try {
      // For testing: if no Google Maps API key, just return clinics as-is
      const hasApiKey = !!config.api.google.mapsApiKey;

      if (!hasApiKey) {
        setClinicsWithCoords(clinicsToGeocode);
        processedClinicsRef.current = clinicsToGeocode;
        return;
      }

      // Process clinics in parallel with Promise.all
      const results = await Promise.all(
        clinicsToGeocode.map(clinic => geocodeClinic(clinic))
      );

      // Update state with geocoded results
      setClinicsWithCoords(results);
      processedClinicsRef.current = clinicsToGeocode;
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodingError('Failed to get location data for some clinics.');
      // Still set the clinics even if some geocoding failed
      setClinicsWithCoords(clinicsToGeocode);
      processedClinicsRef.current = clinicsToGeocode;
    } finally {
      // Clear the timeout
      if (geocodingTimeoutRef.current) {
        clearTimeout(geocodingTimeoutRef.current);
        geocodingTimeoutRef.current = null;
      }

      setGeocoding(false);
    }
  }, [geocodeClinic]);

  // Geocode clinics when the clinics array changes
  useEffect(() => {
    // If we have new clinics and geocoding is stuck, reset it
    if (clinics && clinics.length > 0 && processedClinicsRef.current !== clinics && geocoding) {
      setGeocoding(false);
      // Clear any existing timeout
      if (geocodingTimeoutRef.current) {
        clearTimeout(geocodingTimeoutRef.current);
        geocodingTimeoutRef.current = null;
      }
      return; // Let the next effect run handle the geocoding
    }

    // Only geocode if we have new clinics and we're not already geocoding
    if (clinics && clinics.length > 0 && processedClinicsRef.current !== clinics && !geocoding) {
      geocodeClinics(clinics);
    } else if (clinics && clinics.length === 0) {
      setClinicsWithCoords([]);
      processedClinicsRef.current = clinics;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics]); // Only depend on clinics to prevent infinite loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Clear geocoding cache
   */
  const clearCache = (): void => {
    geocodeCache.current = {};
  };

  /**
   * Get cache statistics
   */
  const getCacheStats = (): { size: number; keys: string[] } => {
    const cacheKeys = Object.keys(geocodeCache.current);
    return {
      size: cacheKeys.length,
      keys: cacheKeys,
    };
  };

  /**
   * Filter clinics with valid coordinates
   */
  const getClinicsWithValidCoords = (): ClinicWithCoords[] => {
    return clinicsWithCoords.filter(
      clinic => clinic.latitude && clinic.longitude
    );
  };

  /**
   * Filter clinics without coordinates
   */
  const getClinicsWithoutCoords = (): ClinicWithCoords[] => {
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
