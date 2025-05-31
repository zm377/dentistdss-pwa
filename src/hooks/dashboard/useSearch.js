import { useState, useMemo } from 'react';
import { filterItems, debounce } from '../../utils/dashboard/dashboardUtils';

/**
 * Custom hook for search functionality
 * 
 * Features:
 * - Debounced search for performance
 * - Configurable search fields
 * - Filtered results with memoization
 * - Search state management
 */
const useSearch = (items = [], searchFields = [], debounceMs = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Create debounced search function
  const debouncedSetSearch = useMemo(
    () => debounce((term) => setDebouncedSearchTerm(term), debounceMs),
    [debounceMs]
  );

  // Update search term and trigger debounced search
  const updateSearchTerm = (term) => {
    setSearchTerm(term);
    debouncedSetSearch(term);
  };

  // Filter items based on debounced search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return items;
    return filterItems(items, debouncedSearchTerm, searchFields);
  }, [items, debouncedSearchTerm, searchFields]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  // Check if search is active
  const isSearching = debouncedSearchTerm.trim().length > 0;

  return {
    // Current search state
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    
    // Filtered results
    filteredItems,
    
    // Actions
    updateSearchTerm,
    clearSearch,
    
    // Convenience props for search components
    searchProps: {
      value: searchTerm,
      onChange: (event) => updateSearchTerm(event.target.value),
    },
  };
};

export default useSearch;
