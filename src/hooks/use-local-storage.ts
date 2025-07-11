import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      // Try to parse it as JSON, but if it fails, return the raw item (for simple strings)
      try {
        return JSON.parse(item);
      } catch (e) {
        return item as unknown as T; // For non-JSON strings
      }
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        // For objects and arrays, stringify them. For simple strings, store as is.
        const valueToSave = typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore);
        window.localStorage.setItem(key, valueToSave);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
            try {
                setStoredValue(JSON.parse(item));
            } catch (e) {
                 setStoredValue(item as unknown as T);
            }
        }
    }
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
