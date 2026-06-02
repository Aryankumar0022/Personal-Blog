'use client';

// =============================================================================
// Nexus Journal — useTheme Hook
// =============================================================================

import { useCallback, useContext, useMemo } from 'react';
import { ThemeContext } from '@/providers/ThemeProvider';
import type { ThemeMode } from '../types';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Access and control the current colour theme.
 *
 * Must be used within a `<ThemeProvider>`. Returns the current theme
 * mode alongside mutation helpers.
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme, isDark } = useTheme();
 * ```
 *
 * @returns Theme state and control functions:
 * - `theme` — current `ThemeMode` (`'dark'` | `'light'`)
 * - `toggleTheme` — flip between dark and light
 * - `setTheme` — set an explicit theme mode
 * - `isDark` — convenience boolean
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      '[Nexus] useTheme must be used within a <ThemeProvider>.',
    );
  }

  const { theme, setTheme } = context;

  /** Toggle between dark and light mode. */
  const toggleTheme = useCallback(() => {
    setTheme((prev: ThemeMode) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  /** Whether the current theme is dark. */
  const isDark = theme === 'dark';

  return useMemo(
    () => ({ theme, toggleTheme, setTheme, isDark }),
    [theme, toggleTheme, setTheme, isDark],
  );
}
