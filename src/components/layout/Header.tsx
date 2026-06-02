"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SITE_CONFIG } from "@/lib/constants";

/* ============================================================
   Header — Floating glassmorphism navigation header.
   
   A minimal, transparent header that appears on scroll with
   the site logo, search trigger, and theme toggle. Auto-hides
   when scrolling down and reappears when scrolling up.
   ============================================================ */

/** Props for the Header component. */
export interface HeaderProps {
  /** Current theme mode. */
  theme: "dark" | "light";
  /** Callback to toggle theme. */
  onToggleTheme: () => void;
  /** Callback to open the command palette / search. */
  onOpenSearch: () => void;
  /** Use light header text while transparent (over a dark hero). */
  overDarkHero?: boolean;
}

/**
 * Floating header with glassmorphism styling.
 *
 * Behavior:
 * - Transparent at the very top of the page
 * - Adds glass background after scrolling past 50px
 * - Hides on scroll down, shows on scroll up
 * - Contains: logo, search trigger (⌘K), theme toggle
 *
 * @example
 * ```tsx
 * <Header
 *   theme={theme}
 *   onToggleTheme={toggleTheme}
 *   onOpenSearch={() => setSearchOpen(true)}
 * />
 * ```
 */
export function Header({ theme, onToggleTheme, onOpenSearch, overDarkHero = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const overDark = overDarkHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 50);

      // Hide on scroll down, show on scroll up (only after 100px)
      if (currentY > 100) {
        setIsVisible(currentY < lastScrollY || currentY < 50);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className={`
            fixed top-0 left-0 right-0 z-40
            transition-all duration-500
            ${isScrolled ? "glass-strong" : "bg-transparent"}
          `}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Site Name */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
              >
                {/* Animated logo mark */}
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden rounded-lg">
                  <div
                    className="absolute inset-0 animate-gradient"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-violet), var(--color-accent-blue))",
                      backgroundSize: "200% 200%",
                      opacity: 0.9,
                    }}
                  />
                  <Image
                    src="/nexus-n-mark.png"
                    alt=""
                    width={32}
                    height={32}
                    className="relative w-7 h-7 object-contain"
                  />
                </div>
                <span
                  className={`font-[family-name:var(--font-geist-sans)] font-semibold text-lg tracking-tight hidden sm:block ${
                    overDark ? "text-white" : "text-[var(--text-primary)]"
                  }`}
                >
                  {SITE_CONFIG.name}
                </span>
              </Link>

              {/* Center: Search Trigger */}
              <button
                onClick={onOpenSearch}
                className={`
                  hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl text-sm
                  transition-all duration-200 cursor-pointer min-w-[240px]
                  ${
                    overDark
                      ? "bg-white/10 border border-white/20 text-white/70 hover:border-white/35 hover:text-white"
                      : "bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                  }
                `}
                aria-label="Open search (Ctrl+K)"
              >
                <Search size={14} />
                <span className="flex-1 text-left">Search knowledge...</span>
                <kbd
                  className={`hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs ${
                    overDark
                      ? "bg-white/10 border border-white/20 text-white/60"
                      : "bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-tertiary)]"
                  }`}
                >
                  ⌘K
                </kbd>
              </button>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {/* Mobile search button */}
                <button
                  onClick={onOpenSearch}
                  className={`sm:hidden p-2 rounded-xl cursor-pointer ${
                    overDark
                      ? "text-white/80 hover:text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  aria-label="Open search"
                >
                  <Search size={18} />
                </button>

                <ThemeToggle
                  theme={theme}
                  onToggle={onToggleTheme}
                  className={
                    overDark
                      ? "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white"
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
