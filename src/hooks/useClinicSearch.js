import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import api from '../services';

/**
 * Custom hook for online/offline status detection using useSyncExternalStore
 * Provides more reliable network status detection than navigator.onLine
 */
const useOnlineStatus = () => {
  const subscribe = useCallback((callback) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }, []);

  const getSnapshot = () => navigator.onLine;
  const getServerSnapshot = () => true; // Assume online during SSR

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
export const useClinicSearch = () => {
  // State management
  const [searchKeywords, setSearchKeywords] = useState('');
  const [debouncedSearchKeywords, setDebouncedSearchKeywords] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Network status detection
  const isOnline = useOnlineStatus();

  /**
   * Perform clinic search API call
   * @param {string} keywords - Search keywords
   */
  const performSearch = useCallback(async (keywords) => {
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
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyPress = useCallback((event) => {
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
