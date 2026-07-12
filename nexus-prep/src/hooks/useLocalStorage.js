// hooks/useLocalStorage.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// Persists state to localStorage automatically.
// Useful for: theme preference, sidebar open/closed, last visited tab.
// Usage: const [theme, setTheme] = useLocalStorage('theme', 'light')
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}
