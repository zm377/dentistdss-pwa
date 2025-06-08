import { useState, useEffect, useCallback, DependencyList } from 'react';

interface UseAsyncDataOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

interface UseAsyncDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  refresh: () => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * Custom hook for managing async data fetching with loading and error states
 * Provides a consistent pattern for data fetching across dashboard components
 */
export const useAsyncData = <T = any>(
  fetchFunction: (...args: any[]) => Promise<T>,
  dependencies: DependencyList = [],
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> => {
  const {
    initialData = null,
    onSuccess = null,
    onError = null,
    immediate = true,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Execute the fetch function
  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction(...args);
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err: any) {
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
  const refresh = useCallback((): Promise<T> => {
    return execute();
  }, [execute]);

  // Reset function
  const reset = useCallback((): void => {
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

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginationResult<T> {
  data?: T[];
  pagination?: {
    totalPages?: number;
    totalItems?: number;
  };
}

interface UsePaginatedDataOptions<T> extends UseAsyncDataOptions<T[]> {
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginatedDataReturn<T> extends UseAsyncDataReturn<T[]> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Hook for managing paginated data
 */
export const usePaginatedData = <T = any>(
  fetchFunction: (params: PaginationParams) => Promise<PaginationResult<T> | T[]>,
  options: UsePaginatedDataOptions<T> = {}
): UsePaginatedDataReturn<T> => {
  const {
    pageSize = 10,
    initialPage = 1,
    ...asyncOptions
  } = options;

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  const paginatedFetch = useCallback(async (page: number = currentPage): Promise<T[]> => {
    const result = await fetchFunction({ page, pageSize });

    if (result && typeof result === 'object' && 'pagination' in result) {
      const paginatedResult = result as PaginationResult<T>;
      if (paginatedResult.pagination) {
        setTotalPages(paginatedResult.pagination.totalPages || 0);
        setTotalItems(paginatedResult.pagination.totalItems || 0);
      }
      return paginatedResult.data || [];
    }

    return result as T[];
  }, [fetchFunction, currentPage, pageSize]);

  const asyncData = useAsyncData(paginatedFetch, [currentPage], asyncOptions);

  const goToPage = useCallback((page: number): void => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback((): void => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback((): void => {
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
export const useFilteredData = <T = any>(
  data: T[] | null | undefined,
  filterFunction?: (item: T, searchTerm: string) => boolean,
  searchTerm: string = ''
): T[] => {
  const [filteredData, setFilteredData] = useState<T[]>([]);

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
