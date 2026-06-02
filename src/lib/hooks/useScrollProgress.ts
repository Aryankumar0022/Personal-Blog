'use client';

// =============================================================================
// Nexus Journal — useScrollProgress Hook
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Track scroll progress as a normalised value between 0 and 1.
 *
 * Without a `ref`, tracks the entire page. When a `ref` is attached to a
 * specific element, tracks progress within that element's scroll height.
 *
 * The scroll handler is **throttled** to ~60 fps via `requestAnimationFrame`
 * for optimal performance.
 *
 * @example
 * ```tsx
 * // Track entire page
 * const progress = useScrollProgress();
 *
 * // Track a specific scrollable element
 * const { ref, progress } = useScrollProgress();
 * <article ref={ref}>…</article>
 * ```
 *
 * @returns An object with:
 * - `progress` — scroll progress from 0 (top) to 1 (bottom)
 * - `ref` — a React ref to attach to a specific scrollable element
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    // Cancel any pending frame to throttle to ~60 fps
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const el = elementRef.current;

      if (el) {
        // Track progress within a specific element
        const rect = el.getBoundingClientRect();
        const scrollable = el.scrollHeight - el.clientHeight;

        if (scrollable > 0) {
          setProgress(Math.min(1, Math.max(0, el.scrollTop / scrollable)));
        } else {
          // Element isn't internally scrollable — use viewport intersection
          const viewportHeight = window.innerHeight;
          const total = rect.height - viewportHeight;

          if (total > 0) {
            setProgress(Math.min(1, Math.max(0, -rect.top / total)));
          }
        }
      } else {
        // Track full page scroll
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollable = docHeight - winHeight;

        if (scrollable > 0) {
          setProgress(Math.min(1, Math.max(0, scrollTop / scrollable)));
        }
      }
    });
  }, []);

  useEffect(() => {
    const target = elementRef.current ?? window;
    target.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);

  return { progress, ref: elementRef };
}
