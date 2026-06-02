"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Calendar } from "lucide-react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { CategoryBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { COLORS } from "@/lib/constants";
import type { CategoryId, ContentType } from "@/lib/types";

/* ============================================================
   ArticleHero — Full-screen hero section for articles.
   
   Displays a beautiful gradient background based on category
   color with parallax scrolling, animated title reveal, and
   article metadata.
   ============================================================ */

/** Props for the ArticleHero component. */
export interface ArticleHeroProps {
  /** Article title. */
  title: string;
  /** Short abstract / description. */
  abstract: string;
  /** Category ID for gradient coloring. */
  category: CategoryId;
  /** Publication date (ISO string). */
  publishedAt: string;
  /** Estimated read time in minutes. */
  readTime: number;
  /** Content type. */
  type: ContentType;
}

/**
 * A full-viewport hero section with category-colored gradient,
 * parallax effect, animated title reveal, and metadata bar.
 *
 * Since we use placeholder images, the hero renders a beautiful
 * gradient background derived from the article's category color
 * with subtle mesh-like patterns.
 *
 * @example
 * ```tsx
 * <ArticleHero
 *   title="The Architecture of LLMs"
 *   abstract="Exploring transformer architectures..."
 *   category="ai-research"
 *   publishedAt="2025-11-15"
 *   readTime={12}
 *   type="article"
 * />
 * ```
 */
export function ArticleHero({
  title,
  abstract,
  category,
  publishedAt,
  readTime,
  type,
}: ArticleHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const categoryColor = COLORS.galaxy[category];

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax transform — background moves slower than content
  const parallaxOffset = scrollY * 0.4;
  const overlayOpacity = Math.min(0.9, 0.3 + scrollY / 800);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Gradient Background with parallax */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          background: `
            radial-gradient(ellipse at 20% 50%, ${categoryColor}30 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, ${categoryColor}20 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0A0A0A 0%, #141414 50%, #0A0A0A 100%)
          `,
        }}
      />

      {/* Animated accent orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow"
        style={{
          top: "10%",
          left: "60%",
          background: `radial-gradient(circle, ${categoryColor}15 0%, transparent 70%)`,
          transform: `translateY(${parallaxOffset * 0.5}px)`,
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-pulse-glow"
        style={{
          top: "50%",
          left: "10%",
          background: `radial-gradient(circle, ${categoryColor}10 0%, transparent 70%)`,
          animationDelay: "1.5s",
          transform: `translateY(${parallaxOffset * 0.3}px)`,
        }}
      />

      {/* Bottom gradient fade to page background */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: `linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)`,
        }}
      />

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Metadata row */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CategoryBadge category={category} size="md" />
          <span className="text-sm text-white/65 capitalize">
            {type}
          </span>
        </motion.div>

        {/* Title */}
        <AnimatedText
          text={title}
          as="h1"
          splitBy="word"
          delay={0.3}
          stagger={0.06}
          className="font-[family-name:var(--font-geist-sans)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-4"
        />

        {/* Abstract */}
        <motion.p
          className="text-lg text-white/85 max-w-2xl leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {abstract}
        </motion.p>

        {/* Date + Read time */}
        <motion.div
          className="flex items-center gap-4 text-sm text-white/65"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(publishedAt)}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/45" />
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {readTime} min read
          </span>
        </motion.div>
      </div>
    </section>
  );
}
