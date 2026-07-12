// hooks/useDebounce.js
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
// Used by CourseCatalog search so we don't filter on every keypress.
// Usage: const debouncedSearch = useDebounce(searchQuery, 300)
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
