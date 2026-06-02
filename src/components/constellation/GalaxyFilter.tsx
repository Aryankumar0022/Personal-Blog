"use client";

import { motion } from "motion/react";
import type { CategoryId, Galaxy } from "@/lib/types";

/* ============================================================
   GalaxyFilter — Horizontal category filter bar.
   
   Allows users to filter the knowledge constellation by
   galaxy (category). Shows all galaxies as pill buttons with
   emoji icons and category names.
   ============================================================ */

/** Props for the GalaxyFilter component. */
export interface GalaxyFilterProps {
  /** Currently active galaxy filter (null = all). */
  activeGalaxy: CategoryId | null;
  /** Callback when a galaxy is selected/deselected. */
  onSelectGalaxy: (galaxy: CategoryId | null) => void;
  /** All available galaxies. */
  galaxies: Galaxy[];
  /** Additional CSS class names. */
  className?: string;
}

/**
 * A horizontal scrollable filter bar for galaxy/category selection.
 *
 * Features:
 * - "All" button to reset filter
 * - Category buttons with emoji + name
 * - Active state with category color background
 * - Smooth animated indicator
 * - Horizontal scroll on mobile
 *
 * @example
 * ```tsx
 * <GalaxyFilter
 *   activeGalaxy={activeCategory}
 *   onSelectGalaxy={setActiveCategory}
 *   galaxies={galaxies}
 * />
 * ```
 */
export function GalaxyFilter({
  activeGalaxy,
  onSelectGalaxy,
  galaxies,
  className = "",
}: GalaxyFilterProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none ${className}`}
      role="tablist"
      aria-label="Filter by galaxy"
    >
      {/* All button */}
      <motion.button
        className={`
          relative shrink-0 px-4 py-2 rounded-full text-sm font-medium
          transition-colors duration-200 cursor-pointer whitespace-nowrap
          ${
            activeGalaxy === null
              ? "bg-[var(--text-primary)] text-[var(--text-inverse)]"
              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }
        `}
        onClick={() => onSelectGalaxy(null)}
        whileTap={{ scale: 0.95 }}
        role="tab"
        aria-selected={activeGalaxy === null}
      >
        ✦ All
      </motion.button>

      {/* Galaxy buttons */}
      {galaxies.map((galaxy) => {
        const isActive = activeGalaxy === galaxy.id;

        return (
          <motion.button
            key={galaxy.id}
            className={`
              relative shrink-0 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 cursor-pointer whitespace-nowrap
              ${
                isActive
                  ? "text-white shadow-lg"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }
            `}
            style={
              isActive
                ? {
                    backgroundColor: galaxy.color,
                    boxShadow: `0 0 20px ${galaxy.color}40`,
                  }
                : undefined
            }
            onClick={() => onSelectGalaxy(isActive ? null : galaxy.id)}
            whileTap={{ scale: 0.95 }}
            role="tab"
            aria-selected={isActive}
          >
            {galaxy.icon} {galaxy.name}
          </motion.button>
        );
      })}
    </div>
  );
}
