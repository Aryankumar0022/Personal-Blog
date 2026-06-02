"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { List } from "lucide-react";
import type { ArticleSection } from "@/lib/types";

/* ============================================================
   TableOfContents — Sticky sidebar article navigation.
   
   A sticky table of contents that highlights the currently
   visible section and provides smooth-scroll links to each
   heading in the article.
   ============================================================ */

/** Props for the TableOfContents component. */
export interface TableOfContentsProps {
  /** Article section definitions. */
  sections: ArticleSection[];
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Sticky sidebar table of contents with active section tracking.
 *
 * Features:
 * - Sticky positioning on desktop
 * - Active section highlighted with accent color + left border
 * - Indentation for h3-level sections
 * - Smooth scroll on click
 * - Collapsible on mobile (floating button)
 * - IntersectionObserver-based active tracking
 *
 * @example
 * ```tsx
 * <TableOfContents sections={article.sections} />
 * ```
 */
export function TableOfContents({
  sections,
  className = "",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(section.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sections]);

  /** Smooth scroll to a section heading. */
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileOpen(false);
    }
  }, []);

  if (sections.length === 0) return null;

  const tocContent = (
    <nav aria-label="Table of Contents">
      <h4 className="font-[family-name:var(--font-geist-sans)] text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
        On this page
      </h4>
      <ul className="space-y-1">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          const isNested = section.level >= 3;

          return (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`
                  w-full text-left text-sm py-1.5 transition-all duration-200 cursor-pointer
                  border-l-2 hover:text-[var(--text-primary)]
                  ${isNested ? "pl-6" : "pl-3"}
                  ${
                    isActive
                      ? "border-[var(--color-accent-blue)] text-[var(--text-primary)] font-medium"
                      : "border-transparent text-[var(--text-tertiary)]"
                  }
                `}
              >
                {section.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div
        className={`hidden lg:block sticky top-24 w-64 shrink-0 ${className}`}
      >
        <div className="glass rounded-xl p-4">{tocContent}</div>
      </div>

      {/* Mobile: floating toggle button + dropdown */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <motion.button
          className="w-12 h-12 rounded-full glass-strong flex items-center justify-center text-[var(--text-primary)] shadow-lg cursor-pointer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle table of contents"
        >
          <List size={20} />
        </motion.button>

        {isMobileOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-72 glass-strong rounded-xl p-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            {tocContent}
          </motion.div>
        )}
      </div>
    </>
  );
}
