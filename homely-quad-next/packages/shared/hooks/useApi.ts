import { useState, useCallback } from 'react';
import type { ApiError } from '../types';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  initialLoading?: boolean;
}

export interface UseApiReturn<T, P extends any[] = any[]> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, P extends any[] = any[]>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const { onSuccess, onError, initialLoading = false } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(initialLoading);

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...params);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
}
