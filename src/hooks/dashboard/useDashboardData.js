import { useState, useEffect } from 'react';

/**
 * Custom hook for managing dashboard data fetching and state
 * 
 * Features:
 * - Centralized loading and error state management
 * - Automatic data fetching with dependency tracking
 * - Error handling and retry functionality
 * - Flexible data fetching function support
 */
const useDashboardData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch data using provided function
   */
  const fetchData = async () => {
    if (!fetchFunction) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retry data fetching
   */
  const retry = () => {
    fetchData();
  };

  /**
   * Update data manually (for optimistic updates)
   */
  const updateData = (newData) => {
    setData(newData);
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError('');
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    data,
    loading,
    error,
    
    // Actions
    retry,
    updateData,
    clearError,
    refetch: fetchData,
    
    // Convenience flags
    hasData: data !== null,
    hasError: error.length > 0,
  };
};

/**
 * Hook for managing multiple data sources
 */
export const useMultipleDashboardData = (dataConfigs = []) => {
  const [globalLoading, setGlobalLoading] = useState(true);
  const [dataMap, setDataMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const fetchAllData = async () => {
    setGlobalLoading(true);
    
    const promises = dataConfigs.map(async (config) => {
      try {
        const result = await config.fetchFunction();
        return { key: config.key, data: result, error: null };
      } catch (error) {
        return { key: config.key, data: null, error: error.message };
      }
    });

    const results = await Promise.all(promises);
    
    const newDataMap = {};
    const newErrorMap = {};
    
    results.forEach(({ key, data, error }) => {
      newDataMap[key] = data;
      newErrorMap[key] = error;
    });
    
    setDataMap(newDataMap);
    setErrorMap(newErrorMap);
    setGlobalLoading(false);
  };

  useEffect(() => {
    if (dataConfigs.length > 0) {
      fetchAllData();
    } else {
      setGlobalLoading(false);
    }
  }, [dataConfigs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    dataMap,
    errorMap,
    loading: globalLoading,
    refetchAll: fetchAllData,
    hasErrors: Object.values(errorMap).some(error => error !== null),
  };
};

export default useDashboardData;
