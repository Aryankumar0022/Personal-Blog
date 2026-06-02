"use client";

import type { CategoryId } from "@/lib/types";
import { COLORS } from "@/lib/constants";

/* ============================================================
   Badge — Category/tag badge with category-specific colors.
   
   A small pill-shaped label for displaying content categories,
   tags, or status indicators with appropriate color coding.
   ============================================================ */

/** Props for the Badge component. */
export interface BadgeProps {
  /** Display text for the badge. */
  label: string;
  /** Category ID for automatic color mapping. */
  category?: CategoryId;
  /** Custom background color (overrides category color). */
  color?: string;
  /** Badge size variant. */
  size?: "sm" | "md";
  /** Additional CSS class names. */
  className?: string;
  /** Click handler. */
  onClick?: () => void;
}

/** Map category IDs to human-readable names. */
const CATEGORY_LABELS: Record<CategoryId, string> = {
  "ai-research": "AI Research",
  "software-engineering": "Software Engineering",
  photography: "Photography",
  travel: "Travel",
  philosophy: "Philosophy",
  personal: "Personal",
  projects: "Projects",
};

/**
 * A pill-shaped badge component with category-specific colors.
 *
 * Automatically maps category IDs to colors from the design system.
 * Supports both automatic category badges and custom-colored badges.
 *
 * @example
 * ```tsx
 * <Badge category="ai-research" label="AI Research" />
 * <Badge label="TypeScript" color="#3178C6" />
 * ```
 */
export function Badge({
  label,
  category,
  color,
  size = "sm",
  className = "",
  onClick,
}: BadgeProps) {
  // Resolve color from category or use custom/default
  const resolvedColor = color ?? (category ? COLORS.galaxy[category] : COLORS.accent.blue);

  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        transition-opacity duration-200
        ${onClick ? "cursor-pointer hover:opacity-80" : ""}
        ${sizeClasses}
        ${className}
      `}
      style={{
        backgroundColor: `${resolvedColor}18`,
        color: resolvedColor,
        border: `1px solid ${resolvedColor}30`,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </span>
  );
}

/**
 * Convenience component: renders a badge pre-configured for a category.
 *
 * @example
 * ```tsx
 * <CategoryBadge category="photography" />
 * ```
 */
export function CategoryBadge({
  category,
  size = "sm",
  className = "",
  onClick,
}: {
  category: CategoryId;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Badge
      label={CATEGORY_LABELS[category]}
      category={category}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
}
