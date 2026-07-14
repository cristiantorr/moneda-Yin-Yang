import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch { /* storage full or unavailable */ }
        return next;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch { /* ignore */ }
  }, [key, initialValue]);

  return [storedValue, setValue, remove] as const;
}
