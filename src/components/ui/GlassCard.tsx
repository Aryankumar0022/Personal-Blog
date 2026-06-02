"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

/* ============================================================
   GlassCard — Refined glassmorphism card with subtle elevation.
   
   A versatile container component with a frosted glass background,
   subtle border, and professional hover elevation effect.
   ============================================================ */

/** Props for the GlassCard component. */
export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Card content. */
  children: ReactNode;
  /** Legacy prop, kept for compatibility but does not emit neon glow anymore. */
  glowColor?: string;
  /** Legacy prop, maps to enableHoverElevation now. */
  enableGlow?: boolean;
  /** Whether to apply the hover scale and shadow animation. */
  enableHoverScale?: boolean;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * A sophisticated card component with refined glassmorphism styling.
 *
 * Features:
 * - Subtle frosted glass background
 * - Crisp 1px border
 * - Professional elevation effect on hover
 * - Smooth transitions
 */
export function GlassCard({
  children,
  glowColor, // Ignored in the new professional aesthetic
  enableGlow = false, // Treated as enableHoverScale/elevation
  enableHoverScale = true,
  className = "",
  ...motionProps
}: GlassCardProps) {
  
  // We use the new CSS class for elevation hover if requested
  const hoverClass = (enableHoverScale || enableGlow) ? "elevation-hover" : "";

  return (
    <motion.div
      className={`glass rounded-[var(--radius-card)] p-6 transition-all duration-300 ${hoverClass} ${className}`}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
