"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Badge } from "@/components/ui/Badge";

import { useTheme } from "@/lib/hooks/useTheme";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import { getArticlesByCategory } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";
import type { Galaxy } from "@/lib/types";

/* ============================================================
   GalaxyPageClient — Category landing page.
   
   Shows all articles within a specific galaxy (topic) with
   a beautiful category-colored header and grid of article cards.
   ============================================================ */

/** Props for the GalaxyPageClient component. */
interface GalaxyPageClientProps {
  galaxy: Galaxy;
}

/**
 * Client-side galaxy/category page.
 */
export function GalaxyPageClient({ galaxy }: GalaxyPageClientProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const articles = getArticlesByCategory(galaxy.id);

  // Keyboard shortcuts
  useKeyboardShortcut("ctrl+k", () => setIsSearchOpen(true));
  useKeyboardShortcut("meta+k", () => setIsSearchOpen(true));

  return (
    <>
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
        {/* Galaxy header */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, ${galaxy.color}20 0%, transparent 60%),
                var(--bg-primary)
              `,
            }}
          />

          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
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

            {/* Galaxy icon + title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-5xl mb-4 block">{galaxy.icon}</span>
              <div style={{ color: galaxy.color }}>
                <AnimatedText
                  text={galaxy.name}
                  as="h1"
                  splitBy="word"
                  delay={0.2}
                  className="font-[family-name:var(--font-geist-sans)] text-4xl sm:text-5xl font-bold tracking-tight"
                />
              </div>
              <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl">
                {galaxy.description}
              </p>
              <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                {articles.length} article{articles.length !== 1 ? "s" : ""} in
                this galaxy
              </p>
            </motion.div>
          </div>
        </section>

        {/* Articles grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                >
                  <GlassCard
                    enableGlow
                    glowColor={`${galaxy.color}15`}
                    className="cursor-pointer group"
                    onClick={() => router.push(`/article/${article.slug}`)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Type + date */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            label={article.type}
                            color={galaxy.color}
                            size="sm"
                          />
                          <span className="text-xs text-[var(--text-tertiary)]">
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-[family-name:var(--font-geist-sans)] font-semibold text-lg text-[var(--text-primary)] leading-snug mb-1.5 group-hover:text-[var(--color-accent-blue)] transition-colors">
                          {article.title}
                        </h3>

                        {/* Abstract */}
                        <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-2">
                          {article.abstract}
                        </p>

                        {/* Tags + read time */}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                            <Clock size={12} />
                            {article.readTime} min
                          </span>
                          <div className="flex gap-1.5">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="shrink-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight
                          size={18}
                          className="text-[var(--text-tertiary)]"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {articles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[var(--text-tertiary)]">
                  No articles in this galaxy yet. Stay tuned!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
