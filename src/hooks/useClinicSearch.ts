import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import api from '../services';
import type { ClinicSearchResult } from '../types/api';

interface UseClinicSearchReturn {
  searchKeywords: string;
  clinics: ClinicSearchResult[];
  loading: boolean;
  isOnline: boolean;
  setSearchKeywords: (keywords: string) => void;
  handleSearch: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  clearResults: () => void;
  resetSearch: () => void;
  hasResults: boolean;
  isEmpty: boolean;
}

/**
 * Custom hook for online/offline status detection using useSyncExternalStore
 * Provides more reliable network status detection than navigator.onLine
 */
const useOnlineStatus = (): boolean => {
  const subscribe = useCallback((callback: () => void): (() => void) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }, []);

  const getSnapshot = (): boolean => navigator.onLine;
  const getServerSnapshot = (): boolean => true; // Assume online during SSR

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

/**
 * Custom hook for clinic search functionality
 *
 * Features:
 * - Debounced search with 800ms delay
 * - Automatic search on keyword changes
 * - Manual search trigger
 * - Loading state management
 * - Online/offline status awareness
 * - Keyboard event handling
 * - Global error handling integration
 */
export const useClinicSearch = (): UseClinicSearchReturn => {
  // State management
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [debouncedSearchKeywords, setDebouncedSearchKeywords] = useState<string>('');
  const [clinics, setClinics] = useState<ClinicSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Network status detection
  const isOnline = useOnlineStatus();

  /**
   * Perform clinic search API call
   */
  const performSearch = useCallback(async (keywords: string): Promise<void> => {
    if (!keywords.trim()) {
      setLoading(false);
      setClinics([]);
      return;
    }

    setLoading(true);

    try {
      const response = await api.clinic.searchClinics(keywords);

      // Handle response - it should be an array after response interceptor processing
      if (Array.isArray(response)) {
        setClinics(response);
      } else if (response === null || response === undefined) {
        setClinics([]);
      } else {
        setClinics([]);
      }
    } catch (err) {
      setClinics([]);
      // Let the error bubble up to global error handling
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search keywords
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeywords(searchKeywords);
    }, 800); // 800ms delay for optimal UX

    return () => clearTimeout(timer);
  }, [searchKeywords]);

  // Auto-search when debounced keywords change
  useEffect(() => {
    if (debouncedSearchKeywords.trim()) {
      performSearch(debouncedSearchKeywords);
    } else if (debouncedSearchKeywords === '') {
      // Clear results when search is empty
      setClinics([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchKeywords]); // Remove performSearch from dependencies to prevent infinite loop

  /**
   * Handle manual search button click
   */
  const handleSearch = useCallback(() => {
    if (!searchKeywords.trim()) {
      return;
    }

    // Trigger immediate search
    performSearch(searchKeywords);
  }, [searchKeywords, performSearch]);

  /**
   * Handle keyboard events for search input
   */
  const handleKeyPress = useCallback((event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  /**
   * Clear search results and reset state
   */
  const clearResults = useCallback(() => {
    setClinics([]);
    setDebouncedSearchKeywords('');
  }, []);

  /**
   * Reset all search state
   */
  const resetSearch = useCallback(() => {
    setSearchKeywords('');
    setDebouncedSearchKeywords('');
    setClinics([]);
    setLoading(false);
  }, []);

  return {
    // State
    searchKeywords,
    clinics,
    loading,
    isOnline,

    // Actions
    setSearchKeywords,
    handleSearch,
    handleKeyPress,
    clearResults,
    resetSearch,

    // Computed values
    hasResults: clinics.length > 0,
    isEmpty: !loading && clinics.length === 0 && searchKeywords.trim() !== '',
  };
};
