"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ============================================================
   ThemeToggle — Dark/light mode toggle with icon animation.
   
   A compact toggle button that smoothly transitions between
   sun and moon icons with a rotation + scale animation.
   ============================================================ */

/** Props for the ThemeToggle component. */
export interface ThemeToggleProps {
  /** Current theme mode. */
  theme: "dark" | "light";
  /** Callback to toggle the theme. */
  onToggle: () => void;
  /** Button size in pixels. */
  size?: number;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * A theme toggle button with animated icon transitions.
 *
 * Displays a sun icon in dark mode and a moon icon in light mode.
 * The icons transition with a rotate + scale animation.
 *
 * Uses a `mounted` guard to prevent React hydration mismatches
 * (server doesn't know the user's theme preference).
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * <ThemeToggle theme={theme} onToggle={toggleTheme} />
 * ```
 */
export function ThemeToggle({
  theme,
  onToggle,
  size = 18,
  className = "",
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-xl cursor-pointer
        bg-[var(--bg-tertiary)] hover:bg-[var(--border-hover)]
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        border border-[var(--border-primary)]
        transition-colors duration-300
        ${className}
      `}
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
    >
      {/* Render nothing until mounted to avoid hydration mismatch */}
      {!mounted ? (
        <span className="w-[18px] h-[18px]" />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Sun size={size} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Moon size={size} />
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  );
}
