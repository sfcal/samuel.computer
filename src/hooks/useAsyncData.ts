import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = []
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const memoizedAsyncFunction = useCallback(asyncFunction, dependencies);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const data = await memoizedAsyncFunction();
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ 
            data: null, 
            loading: false, 
            error: error instanceof Error ? error : new Error('Unknown error') 
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [memoizedAsyncFunction]);

  return state;
}