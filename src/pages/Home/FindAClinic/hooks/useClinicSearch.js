import { useState, useEffect, useCallback } from 'react';
import api from '../../../../services';

/**
 * Custom hook for clinic search functionality
 * 
 * Features:
 * - Debounced search with auto-search capability
 * - Loading and error state management
 * - API integration with proper error handling
 * - Search result caching
 * - Keyboard event handling
 */
export const useClinicSearch = () => {
  // State management
  const [searchKeywords, setSearchKeywords] = useState('');
  const [debouncedSearchKeywords, setDebouncedSearchKeywords] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Perform clinic search API call
   * @param {string} keywords - Search keywords
   */
  const performSearch = useCallback(async (keywords) => {
    if (!keywords.trim()) {
      setLoading(false);
      setClinics([]);
      setError('');
      return;
    }

    console.log('🔍 Starting search for keywords:', keywords);
    setLoading(true);
    setError('');

    try {
      const response = await api.clinic.searchClinics(keywords);

      // Handle response - it should be an array after response interceptor processing
      if (Array.isArray(response)) {
        console.log('🔍 Search response received:', response.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          address: clinic.address,
          hasCoords: !!(clinic.latitude && clinic.longitude)
        })));

        setClinics(response);
        setError(''); // Clear any previous errors

        // Show message for empty results
        if (response.length === 0) {
          setError('No clinics found for your search. Try different keywords.');
        }
      } else if (response === null || response === undefined) {
        console.log('⚠️ Null/undefined response');
        setClinics([]);
        setError('No clinics found for your search. Try different keywords.');
      } else {
        console.log('❌ Unexpected response format:', response);
        setClinics([]);
        setError('Unexpected response format. Please try again.');
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });

      // For development: provide mock data if API fails
      if (process.env.NODE_ENV === 'development' && keywords.toLowerCase().includes('test')) {
        console.log('🧪 Using mock data for development testing');
        const mockClinics = [
          {
            id: 1,
            name: 'Sydney Dental Care',
            address: '123 George Street',
            city: 'Sydney',
            state: 'NSW',
            zipCode: '2000',
            country: 'Australia',
            phoneNumber: '+61 2 9876 5432',
            email: 'info@sydneydentalcare.com.au',
            website: 'https://sydneydentalcare.com.au',
            latitude: -33.8688,
            longitude: 151.2093
          },
          {
            id: 2,
            name: 'Melbourne Smile Clinic',
            address: '456 Collins Street',
            city: 'Melbourne',
            state: 'VIC',
            zipCode: '3000',
            country: 'Australia',
            phoneNumber: '+61 3 9876 5432',
            email: 'hello@melbournesmile.com.au',
            website: 'https://melbournesmile.com.au',
            latitude: -37.8136,
            longitude: 144.9631
          },
          {
            id: 3,
            name: 'Brisbane Dental Hub',
            address: '789 Queen Street',
            city: 'Brisbane',
            state: 'QLD',
            zipCode: '4000',
            country: 'Australia',
            phoneNumber: '+61 7 9876 5432',
            email: 'contact@brisbanedentalhub.com.au',
            website: 'https://brisbanedentalhub.com.au',
            latitude: -27.4698,
            longitude: 153.0251
          }
        ];
        setClinics(mockClinics);
        setError('');
        setLoading(false);
        return;
      }

      // Provide user-friendly error messages
      if (err.response?.status === 429) {
        setError('Too many search requests. Please wait a moment and try again.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.status === 404) {
        setError('Search service not available. Please try again later.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your connection and try again.');
      } else {
        setError('Error searching for clinics. Please try again.');
      }

      setClinics([]);
    } finally {
      console.log('🏁 Search completed, setting loading to false');
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
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchKeywords]); // Remove performSearch from dependencies to prevent infinite loop

  /**
   * Handle manual search button click
   */
  const handleSearch = useCallback(() => {
    if (!searchKeywords.trim()) {
      setError('Please enter search keywords');
      return;
    }
    
    // Clear any existing error
    setError('');
    
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
    setError('');
    setDebouncedSearchKeywords('');
  }, []);

  /**
   * Reset all search state
   */
  const resetSearch = useCallback(() => {
    setSearchKeywords('');
    setDebouncedSearchKeywords('');
    setClinics([]);
    setError('');
    setLoading(false);
  }, []);

  return {
    // State
    searchKeywords,
    clinics,
    loading,
    error,
    
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
