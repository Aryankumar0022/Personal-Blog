"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

/* ============================================================
   ArticleBody — Rich article content renderer.
   
   Wraps MDX-rendered content with the article-content typography class
   and entrance animations.
   ============================================================ */

/** Props for the ArticleBody component. */
export interface ArticleBodyProps {
  /** MDX rendered children. */
  children?: ReactNode;
}

/**
 * Renders article content with rich typography.
 *
 * @example
 * ```tsx
 * <ArticleBody>
 *   <MDXRemote source={article.content} />
 * </ArticleBody>
 * ```
 */
export function ArticleBody({ children }: ArticleBodyProps) {
  return (
    <motion.div
      className="article-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
