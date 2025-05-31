import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing async data fetching with loading and error states
 * Provides a consistent pattern for data fetching across dashboard components
 */
export const useAsyncData = (fetchFunction, dependencies = [], options = {}) => {
  const {
    initialData = null,
    onSuccess = null,
    onError = null,
    immediate = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute the fetch function
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(...args);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message || 'An error occurred while fetching data');
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, onSuccess, onError]);

  // Refresh function
  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  // Reset function
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset,
    setData,
  };
};

/**
 * Hook for managing paginated data
 */
export const usePaginatedData = (fetchFunction, options = {}) => {
  const {
    pageSize = 10,
    initialPage = 1,
    ...asyncOptions
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const paginatedFetch = useCallback(async (page = currentPage) => {
    const result = await fetchFunction({ page, pageSize });
    
    if (result.pagination) {
      setTotalPages(result.pagination.totalPages || 0);
      setTotalItems(result.pagination.totalItems || 0);
    }
    
    return result.data || result;
  }, [fetchFunction, currentPage, pageSize]);

  const asyncData = useAsyncData(paginatedFetch, [currentPage], asyncOptions);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    ...asyncData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Hook for managing filtered and searchable data
 */
export const useFilteredData = (data, filterFunction, searchTerm = '') => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      return;
    }

    let result = Array.isArray(data) ? data : [];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        filterFunction ? filterFunction(item, searchTerm) : 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(result);
  }, [data, filterFunction, searchTerm]);

  return filteredData;
};
