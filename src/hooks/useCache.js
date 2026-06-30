import { useRef, useCallback } from 'react';
import { PERFORMANCE_CONFIG } from '../config/performance';

export const useCache = () => {
  const cacheRef = useRef(new Map());
  const timestampsRef = useRef(new Map());

  const get = useCallback((key) => {
    const timestamp = timestampsRef.current.get(key);
    if (timestamp && Date.now() - timestamp > PERFORMANCE_CONFIG.CACHE_DURATION) {
      cacheRef.current.delete(key);
      timestampsRef.current.delete(key);
      return null;
    }
    return cacheRef.current.get(key);
  }, []);

  const set = useCallback((key, value) => {
    if (cacheRef.current.size >= PERFORMANCE_CONFIG.CACHE_MAX_SIZE) {
      // Remove oldest entry
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
      timestampsRef.current.delete(firstKey);
    }
    cacheRef.current.set(key, value);
    timestampsRef.current.set(key, Date.now());
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    timestampsRef.current.clear();
  }, []);

  return { get, set, clear };
};
