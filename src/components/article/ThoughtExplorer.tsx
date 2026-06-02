"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getRelatedNodes } from "@/lib/data/relationships";
import type { ContentNodeMetadata, CategoryId, Galaxy } from "@/lib/types";

/* ============================================================
   ThoughtExplorer — Article connection graph.
   
   Shows related content at the bottom of an article as a
   visual tree of connections, grouped by category. Replaces
   the traditional "Related Posts" section.
   ============================================================ */

/** Props for the ThoughtExplorer component. */
export interface ThoughtExplorerProps {
  /** ID of the current article. */
  currentArticleId: string;
  /** All articles (metadata only — no fs dependency). */
  allArticles: ContentNodeMetadata[];
  /** All galaxies for category lookups. */
  galaxies: Galaxy[];
  /** Additional CSS class names. */
  className?: string;
}

/** A related article grouped with its category info. */
interface GroupedRelation {
  category: CategoryId;
  galaxyName: string;
  galaxyIcon: string;
  galaxyColor: string;
  articles: ContentNodeMetadata[];
}

/**
 * Displays related content connections at the bottom of an article.
 *
 * Instead of a simple "Related Posts" list, this component shows
 * a visual tree of connected ideas grouped by category galaxy,
 * emphasizing the knowledge graph's interconnections.
 *
 * @example
 * ```tsx
 * <ThoughtExplorer
 *   currentArticleId={article.id}
 *   allArticles={allArticles}
 *   galaxies={galaxies}
 * />
 * ```
 */
export function ThoughtExplorer({
  currentArticleId,
  allArticles,
  galaxies,
  className = "",
}: ThoughtExplorerProps) {
  // Get related content, grouped by category
  const groupedRelations = useMemo(() => {
    const links = getRelatedNodes(currentArticleId);
    const relatedIds = links.map((link) =>
      link.source === currentArticleId ? link.target : link.source
    );

    // Resolve IDs to full article objects
    const relatedArticles = relatedIds
      .map((id) => allArticles.find((a) => a.id === id))
      .filter(Boolean) as ContentNodeMetadata[];

    // Group by category
    const groups = new Map<CategoryId, ContentNodeMetadata[]>();
    for (const article of relatedArticles) {
      const existing = groups.get(article.category) ?? [];
      existing.push(article);
      groups.set(article.category, existing);
    }

    // Convert to array with galaxy info
    const result: GroupedRelation[] = [];
    groups.forEach((articles, categoryId) => {
      const galaxy = galaxies.find((g) => g.id === categoryId);
      if (!galaxy) return;
      result.push({
        category: categoryId,
        galaxyName: galaxy.name,
        galaxyIcon: galaxy.icon,
        galaxyColor: galaxy.color,
        articles,
      });
    });

    return result;
  }, [currentArticleId, allArticles, galaxies]);

  if (groupedRelations.length === 0) return null;

  return (
    <GlassCard
      enableGlow={false}
      enableHoverScale={false}
      className={`${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={18} className="text-[var(--color-accent-violet)]" />
        <h3 className="font-[family-name:var(--font-geist-sans)] font-semibold text-lg text-[var(--text-primary)]">
          This idea connects to
        </h3>
      </div>

      {/* Connection tree */}
      <div className="space-y-5">
        {groupedRelations.map((group, groupIndex) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Category header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{group.galaxyIcon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: group.galaxyColor }}
              >
                {group.galaxyName}
              </span>
              {/* Connecting line */}
              <div
                className="flex-1 h-px"
                style={{
                  background: `linear-gradient(90deg, ${group.galaxyColor}30, transparent)`,
                }}
              />
            </div>

            {/* Articles in this category */}
            <div className="space-y-1 ml-6">
              {group.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex items-center gap-2 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ backgroundColor: group.galaxyColor }}
                  />
                  <span className="flex-1 truncate">{article.title}</span>
                  <ArrowRight
                    size={12}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)]"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
