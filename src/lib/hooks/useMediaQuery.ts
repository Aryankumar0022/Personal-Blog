'use client';

// =============================================================================
// Nexus Journal — useMediaQuery Hook
// =============================================================================

import { useCallback, useEffect, useState } from 'react';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Subscribe to a CSS media query and re-render on match changes.
 *
 * SSR-safe — returns `false` on the server and during hydration,
 * then updates on the first client-side effect.
 *
 * @param query - A valid CSS media query string (e.g. `"(min-width: 768px)"`)
 * @returns `true` if the media query currently matches, `false` otherwise
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((): boolean => {
    // SSR guard
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value on mount
    setMatches(mediaQuery.matches);

    /** Handler for media query changes */
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, [query, getMatches]);

  return matches;
}
