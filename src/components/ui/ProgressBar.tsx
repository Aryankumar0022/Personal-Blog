"use client";

import { motion } from "motion/react";

/* ============================================================
   ProgressBar — Animated reading progress indicator.
   
   A thin, color-gradient progress bar that tracks scroll position
   or arbitrary progress values. Used at the top of article pages.
   ============================================================ */

/** Props for the ProgressBar component. */
export interface ProgressBarProps {
  /** Current progress value (0 to 1). */
  progress: number;
  /** Height of the progress bar in pixels. */
  height?: number;
  /** Whether to fix the bar at the top of the viewport. */
  fixed?: boolean;
  /** Gradient start color. */
  colorFrom?: string;
  /** Gradient end color. */
  colorTo?: string;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * An animated progress bar with gradient coloring.
 *
 * Typically used as a reading progress indicator fixed at the
 * top of the viewport. The bar smoothly animates width changes
 * using spring physics.
 *
 * @example
 * ```tsx
 * const progress = useScrollProgress();
 * <ProgressBar progress={progress} fixed />
 * ```
 */
export function ProgressBar({
  progress,
  height = 3,
  fixed = false,
  colorFrom = "var(--color-accent-blue)",
  colorTo = "var(--color-accent-violet)",
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <div
      className={`
        w-full overflow-hidden z-50
        ${fixed ? "fixed top-0 left-0 right-0" : "relative"}
        ${className}
      `}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(clampedProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: clampedProgress }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      {/* Glow effect at the leading edge */}
      {clampedProgress > 0 && (
        <motion.div
          className="absolute top-0 h-full w-8 blur-sm"
          style={{
            background: `linear-gradient(90deg, transparent, ${colorTo})`,
            right: `${(1 - clampedProgress) * 100}%`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}
