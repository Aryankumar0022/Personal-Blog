"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, FileText, Code, Camera, BookOpen, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ContentNode, CategoryId, Galaxy, ContentNodeMetadata } from "@/lib/types";
import { CategoryBadge } from "@/components/ui/Badge";

/* ============================================================
   CommandPalette — ⌘K search overlay with instant results.
   
   A full-screen command palette inspired by Linear, Raycast,
   and VS Code. Provides instant fuzzy search across all content
   with keyboard navigation.
   ============================================================ */

/** Props for the CommandPalette component. */
export interface CommandPaletteProps {
  /** Whether the palette is currently open. */
  isOpen: boolean;
  /** Callback to close the palette. */
  onClose: () => void;
  /** All available articles metadata */
  articles: ContentNodeMetadata[];
  /** All available categories */
  galaxies: Galaxy[];
}

/** Icon mapping for content types. */
const TYPE_ICONS: Record<string, React.ReactNode> = {
  article: <FileText size={16} />,
  project: <Code size={16} />,
  research: <BookOpen size={16} />,
  tutorial: <Compass size={16} />,
  gallery: <Camera size={16} />,
};

/**
 * A command palette search overlay.
 *
 * Features:
 * - Opens with ⌘K / Ctrl+K
 * - Instant fuzzy search across titles, abstracts, tags
 * - Category quick-filters
 * - Keyboard navigation (↑/↓ arrows, Enter, Escape)
 * - Glassmorphism backdrop
 * - Smooth enter/exit animations
 *
 * @example
 * ```tsx
 * const [isSearchOpen, setSearchOpen] = useState(false);
 * <CommandPalette isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
 * ```
 */
export function CommandPalette({ isOpen, onClose, articles, galaxies }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ---------- Filtered Results ----------
  const results = useMemo(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.abstract.toLowerCase().includes(lowerQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return filtered;
  }, [query, selectedCategory, articles]);

  // ---------- Focus input on open ----------
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setSelectedCategory(null);
      // Slight delay to ensure the DOM is ready
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ---------- Keyboard Navigation ----------
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateToArticle(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // ---------- Scroll selected item into view ----------
  useEffect(() => {
    const container = resultsRef.current;
    if (!container) return;
    const selected = container.children[selectedIndex] as HTMLElement;
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  /** Navigate to article and close palette. */
  const navigateToArticle = (article: Pick<ContentNode, 'slug'>) => {
    onClose();
    router.push(`/article/${article.slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            className="fixed inset-x-0 top-[10vh] z-50 mx-auto w-full max-w-2xl px-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-primary)]">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)]">
                <Search
                  size={18}
                  className="text-[var(--text-tertiary)] shrink-0"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search articles, projects, ideas..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none text-base"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Category Quick Filters */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-primary)] overflow-x-auto">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedIndex(0);
                  }}
                  className={`
                    px-2.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap
                    ${
                      selectedCategory === null
                        ? "bg-[var(--color-accent-blue)] text-white"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  All
                </button>
                {galaxies.map((galaxy) => (
                  <button
                    key={galaxy.id}
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === galaxy.id ? null : galaxy.id
                      );
                      setSelectedIndex(0);
                    }}
                    className={`
                      px-2.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap
                      ${
                        selectedCategory === galaxy.id
                          ? "text-white"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }
                    `}
                    style={
                      selectedCategory === galaxy.id
                        ? { backgroundColor: galaxy.color }
                        : undefined
                    }
                  >
                    {galaxy.icon} {galaxy.name}
                  </button>
                ))}
              </div>

              {/* Results */}
              <div
                ref={resultsRef}
                className="max-h-[50vh] overflow-y-auto py-2"
              >
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                    <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                ) : (
                  results.map((article, index) => (
                    <button
                      key={article.id}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-colors cursor-pointer
                        ${
                          index === selectedIndex
                            ? "bg-[var(--bg-tertiary)]"
                            : "hover:bg-[var(--bg-secondary)]"
                        }
                      `}
                      onClick={() => navigateToArticle(article)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {/* Type icon */}
                      <span className="text-[var(--text-tertiary)] shrink-0">
                        {TYPE_ICONS[article.type] || <FileText size={16} />}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
                          {article.abstract}
                        </p>
                      </div>

                      {/* Category badge */}
                      <CategoryBadge category={article.category} size="sm" />

                      {/* Navigate icon */}
                      {index === selectedIndex && (
                        <ArrowRight
                          size={14}
                          className="text-[var(--text-tertiary)] shrink-0"
                        />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-primary)] text-xs text-[var(--text-tertiary)]">
                <span>
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-[var(--bg-tertiary)] text-[10px]">↑↓</kbd>
                    navigate
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-[var(--bg-tertiary)] text-[10px]">↵</kbd>
                    open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-[var(--bg-tertiary)] text-[10px]">esc</kbd>
                    close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
