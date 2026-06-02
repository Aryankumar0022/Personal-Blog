"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { ArticleSection } from "@/lib/types";

/* ============================================================
   ArticleBody — Rich article content renderer.
   
   Parses plain-text article content into structured HTML with
   proper heading IDs for TOC linking and the article-content
   typography class.
   ============================================================ */

/** Props for the ArticleBody component. */
export interface ArticleBodyProps {
  /** Raw article content text. */
  content: string;
  /** Section definitions for heading IDs. */
  sections?: ArticleSection[];
}

/**
 * Parsed content block — either a heading or a paragraph.
 * @internal
 */
interface ContentBlock {
  type: "h2" | "h3" | "p";
  text: string;
  id?: string;
}

/**
 * Parses raw content text into structured content blocks.
 *
 * Supports:
 * - `## ` → h2 headings
 * - `### ` → h3 headings
 * - Regular text → paragraphs
 * - Empty lines as separators
 *
 * @internal
 */
function parseContent(
  content: string,
  sections?: ArticleSection[]
): ContentBlock[] {
  const lines = content.split("\n");
  const blocks: ContentBlock[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: "p",
        text: currentParagraph.join(" "),
      });
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      const text = trimmed.slice(4);
      const section = sections?.find((s) => s.title === text);
      blocks.push({
        type: "h3",
        text,
        id: section?.id ?? text.toLowerCase().replace(/\s+/g, "-"),
      });
    } else if (trimmed.startsWith("## ")) {
      flushParagraph();
      const text = trimmed.slice(3);
      const section = sections?.find((s) => s.title === text);
      blocks.push({
        type: "h2",
        text,
        id: section?.id ?? text.toLowerCase().replace(/\s+/g, "-"),
      });
    } else if (trimmed === "") {
      flushParagraph();
    } else {
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  return blocks;
}

/**
 * Renders article content with rich typography.
 *
 * Parses raw content text into headings and paragraphs,
 * applies the `article-content` CSS class for styling,
 * and adds `id` attributes to headings for TOC linking.
 *
 * @example
 * ```tsx
 * <ArticleBody
 *   content={article.content}
 *   sections={article.sections}
 * />
 * ```
 */
export function ArticleBody({ content, sections }: ArticleBodyProps) {
  const blocks = useMemo(() => parseContent(content, sections), [content, sections]);

  return (
    <motion.div
      className="article-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} id={block.id}>
                {block.text}
              </h3>
            );
          case "p":
            return <p key={index}>{block.text}</p>;
          default:
            return null;
        }
      })}
    </motion.div>
  );
}
