"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ThoughtExplorer } from "@/components/article/ThoughtExplorer";

import { useTheme } from "@/lib/hooks/useTheme";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import type { ContentNode } from "@/lib/types";

/* ============================================================
   ArticlePageClient — Client-side article experience.
   
   Renders the full article reading experience:
   - Reading progress bar
   - Parallax hero
   - Article body with TOC sidebar
   - ThoughtExplorer connections
   - Back navigation
   ============================================================ */

/** Props for the ArticlePageClient component. */
interface ArticlePageClientProps {
  article: ContentNode;
}

/**
 * Client-side article page with all interactive features.
 */
export function ArticlePageClient({ article }: ArticlePageClientProps) {
  const { theme, toggleTheme } = useTheme();
  const { progress: scrollProgress } = useScrollProgress();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcut("ctrl+k", () => setIsSearchOpen(true));
  useKeyboardShortcut("meta+k", () => setIsSearchOpen(true));

  return (
    <>
      {/* Reading progress bar */}
      <ProgressBar progress={scrollProgress} fixed />

      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main className="flex-1">
        {/* Hero section */}
        <ArticleHero
          title={article.title}
          abstract={article.abstract}
          category={article.category}
          publishedAt={article.publishedAt}
          readTime={article.readTime}
          type={article.type}
        />

        {/* Article content area */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Constellation
            </Link>
          </motion.div>

          {/* Main content + TOC layout */}
          <div className="flex gap-12">
            {/* Article body */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <ArticleBody
                content={article.content}
                sections={article.sections}
              />
            </div>

            {/* Table of Contents sidebar */}
            {article.sections && article.sections.length > 0 && (
              <TableOfContents sections={article.sections} />
            )}
          </div>

          {/* Thought Explorer — "This idea connects to:" */}
          <div className="mt-16 max-w-3xl">
            <ThoughtExplorer currentArticleId={article.id} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
