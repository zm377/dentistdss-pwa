import { useState, useMemo } from 'react';
import { filterItems, debounce } from '../../utils/dashboard/dashboardUtils';

interface UseSearchReturn<T> {
  searchTerm: string;
  debouncedSearchTerm: string;
  isSearching: boolean;
  filteredItems: T[];
  updateSearchTerm: (term: string) => void;
  clearSearch: () => void;
  searchProps: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

/**
 * Custom hook for search functionality
 *
 * Features:
 * - Debounced search for performance
 * - Configurable search fields
 * - Filtered results with memoization
 * - Search state management
 */
const useSearch = <T extends Record<string, any>>(
  items: T[] = [],
  searchFields: string[] = [],
  debounceMs: number = 300
): UseSearchReturn<T> => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Create debounced search function
  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), debounceMs),
    [debounceMs]
  );

  // Update search term and trigger debounced search
  const updateSearchTerm = (term: string): void => {
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
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => updateSearchTerm(event.target.value),
    },
  };
};

export default useSearch;
