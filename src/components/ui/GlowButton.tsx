"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/* ============================================================
   Button — Premium minimalist button.
   
   A sleek, high-contrast, professional button without 
   the magnetic or neon effects.
   (File kept as GlowButton.tsx for backward compatibility)
   ============================================================ */

/** Visual variant of the button. */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/** Size of the button. */
export type ButtonSize = "sm" | "md" | "lg";

/** Props for the Button component. */
export interface GlowButtonProps extends HTMLMotionProps<"button"> {
  /** Visual style variant. */
  variant?: ButtonVariant;
  /** Button size. */
  size?: ButtonSize;
  /** Content to render inside the button. */
  children: React.ReactNode;
  /** Icon element to render before the label. */
  icon?: React.ReactNode;
  /** Whether the button is in a loading state. */
  loading?: boolean;
}

/* ---------- Style Maps ---------- */

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] hover:bg-[var(--text-secondary)] hover:border-[var(--text-secondary)] shadow-sm",
  secondary:
    "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)] shadow-sm",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-md",
  md: "px-5 py-2.5 text-sm font-medium gap-2 rounded-lg",
  lg: "px-7 py-3 text-base font-medium gap-2.5 rounded-lg",
};

/**
 * A premium, minimalist button.
 *
 * Provides a crisp, high-contrast design with subtle scale feedback on click.
 */
export function GlowButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  loading = false,
  className = "",
  disabled,
  ...buttonProps
}: GlowButtonProps) {

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
}
