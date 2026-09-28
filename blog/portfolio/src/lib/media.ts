import { useSyncExternalStore } from 'react';

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    onChange => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

// Cursor effects only where there is a fine pointer and room for them.
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 769px)');

export const useWide = () => useMediaQuery('(min-width: 900px)');
