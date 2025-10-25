import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced scroll handling
 * @param callback - Function to call when scroll is debounced
 * @param delay - The delay in milliseconds (default: 150ms)
 * @returns Scroll handler function
 */
export function useDebouncedScroll(
  callback: (scrollTop: number) => void,
  delay: number = 150
) {
  const [scrollTop, setScrollTop] = useState(0);
  const debouncedScrollTop = useDebounce(scrollTop, delay);

  useEffect(() => {
    callback(debouncedScrollTop);
  }, [debouncedScrollTop, callback]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    setScrollTop(target.scrollTop);
  };

  return handleScroll;
}