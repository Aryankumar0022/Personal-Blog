'use client';

// =============================================================================
// Nexus Journal — Theme Provider
// =============================================================================

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { ThemeMode } from '@/lib/types';

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

/**
 * Shape of the theme context value.
 */
export interface ThemeContextValue {
  /** Current active theme mode */
  theme: ThemeMode;
  /** Setter for the theme mode (accepts value or updater function) */
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
}

/**
 * React context for theme state.
 *
 * Consumed by the `useTheme` hook — do not use directly unless
 * building custom theme-aware primitives.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STORAGE_KEY = 'nexus-theme';

// -----------------------------------------------------------------------------
// Inline Script (FOUC prevention)
// -----------------------------------------------------------------------------

/**
 * Inline script injected into `<head>` to prevent flash of wrong theme.
 *
 * Runs synchronously before React hydrates:
 * 1. Checks `localStorage` for a saved preference.
 * 2. Falls back to `prefers-color-scheme` media query.
 * 3. Applies the `dark` class to `<html>` immediately.
 *
 * @internal
 */
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------

/**
 * Props for the `ThemeProvider` component.
 */
interface ThemeProviderProps {
  /** Child components that need access to theme state */
  children: ReactNode;
  /** Optional default theme (overrides system preference for SSR) */
  defaultTheme?: ThemeMode;
}

/**
 * Provides theme state to the component tree.
 *
 * ## Features
 * - Reads system colour-scheme preference on first visit
 * - Persists user choice to `localStorage`
 * - Applies `dark` class to the `<html>` element
 * - Prevents flash of wrong theme via an inline `<script>`
 *
 * ## Usage
 * Wrap your root layout with `<ThemeProvider>`:
 *
 * ```tsx
 * // app/layout.tsx
 * import { ThemeProvider } from '@/providers/ThemeProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <head>
 *         {/* The provider injects its own inline script *\/}
 *       </head>
 *       <body>
 *         <ThemeProvider>{children}</ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // During SSR, use the default or fall back to 'dark'
    if (typeof window === 'undefined') {
      return defaultTheme ?? 'dark';
    }

    // On the client, read from localStorage or system preference
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // localStorage may be unavailable (e.g., incognito in some browsers)
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  /**
   * Wrapped setter that persists to localStorage and updates the DOM.
   */
  const setTheme: Dispatch<SetStateAction<ThemeMode>> = useCallback(
    (value) => {
      setThemeState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;

        // Persist
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Silently fail if storage is unavailable
        }

        // Apply to DOM
        const root = document.documentElement;
        root.classList.toggle('dark', next === 'dark');
        root.style.colorScheme = next;

        return next;
      });
    },
    [],
  );

  // ── Sync DOM on initial mount (in case state diverges from inline script) ──
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Listen for system preference changes ──
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      // Only auto-switch if the user hasn't explicitly set a preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext value={contextValue}>
      {/* Inline script to prevent FOUC — runs before React hydrates */}
      <script
        dangerouslySetInnerHTML={{ __html: themeInitScript }}
        suppressHydrationWarning
      />
      {children}
    </ThemeContext>
  );
}
