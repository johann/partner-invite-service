import { useCallback, useRef } from "react";

type Callback<T extends unknown[]> = (...args: T) => void;

export function useDebouncedCallback<T extends unknown[]>(fn: Callback<T>, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [delay, fn]
  );
}