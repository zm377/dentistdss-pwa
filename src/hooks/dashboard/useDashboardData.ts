import { useState, useEffect, DependencyList } from 'react';

interface UseDashboardDataReturn<T> {
  // State
  data: T | null;
  loading: boolean;
  error: string;

  // Actions
  retry: () => void;
  updateData: (newData: T | null) => void;
  clearError: () => void;
  refetch: () => Promise<void>;

  // Convenience flags
  hasData: boolean;
  hasError: boolean;
}

/**
 * Custom hook for managing dashboard data fetching and state
 *
 * Features:
 * - Centralized loading and error state management
 * - Automatic data fetching with dependency tracking
 * - Error handling and retry functionality
 * - Flexible data fetching function support
 */
const useDashboardData = <T = any>(
  fetchFunction?: () => Promise<T>,
  dependencies: DependencyList = []
): UseDashboardDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  /**
   * Fetch data using provided function
   */
  const fetchData = async (): Promise<void> => {
    if (!fetchFunction) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retry data fetching
   */
  const retry = (): void => {
    fetchData();
  };

  /**
   * Update data manually (for optimistic updates)
   */
  const updateData = (newData: T | null): void => {
    setData(newData);
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
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

interface DataConfig<T = any> {
  key: string;
  fetchFunction: () => Promise<T>;
}

interface UseMultipleDashboardDataReturn {
  dataMap: Record<string, any>;
  errorMap: Record<string, string | null>;
  loading: boolean;
  refetchAll: () => Promise<void>;
  hasErrors: boolean;
}

/**
 * Hook for managing multiple data sources
 */
export const useMultipleDashboardData = (
  dataConfigs: DataConfig[] = []
): UseMultipleDashboardDataReturn => {
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

  const fetchAllData = async (): Promise<void> => {
    setGlobalLoading(true);

    const promises = dataConfigs.map(async (config) => {
      try {
        const result = await config.fetchFunction();
        return { key: config.key, data: result, error: null };
      } catch (error: any) {
        return { key: config.key, data: null, error: error.message };
      }
    });

    const results = await Promise.all(promises);

    const newDataMap: Record<string, any> = {};
    const newErrorMap: Record<string, string | null> = {};

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
