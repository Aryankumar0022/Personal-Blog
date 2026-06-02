"use client";

import { motion, AnimatePresence } from "motion/react";
import { Clock, FileText, Code, BookOpen, Compass, Camera } from "lucide-react";
import { CategoryBadge } from "@/components/ui/Badge";
import { truncate } from "@/lib/utils";
import type { GraphNode, ContentType } from "@/lib/types";

/* ============================================================
   NodePreview — Floating tooltip card for graph node hover.
   
   Appears when the user hovers over a node in the knowledge
   graph, showing a preview of the content with category badge,
   read time, and abstract.
   ============================================================ */

/** Props for the NodePreview component. */
export interface NodePreviewProps {
  /** The currently hovered node, or null. */
  node: GraphNode | null;
  /** Screen position to render the preview at. */
  position: { x: number; y: number };
}

/** Map content types to display icons. */
const TYPE_ICONS: Record<ContentType, React.ReactNode> = {
  article: <FileText size={12} />,
  project: <Code size={12} />,
  research: <BookOpen size={12} />,
  tutorial: <Compass size={12} />,
  gallery: <Camera size={12} />,
  video: <FileText size={12} />,
  book: <BookOpen size={12} />,
  note: <FileText size={12} />,
};

/** Map content types to human-readable labels. */
const TYPE_LABELS: Record<ContentType, string> = {
  article: "Article",
  project: "Project",
  research: "Research",
  tutorial: "Tutorial",
  gallery: "Gallery",
  video: "Video",
  book: "Book Notes",
  note: "Note",
};

/**
 * A floating preview card that appears on graph node hover.
 *
 * Displays the node's title, abstract, category, read time,
 * and content type with a glassmorphism card and smooth animation.
 *
 * Automatically repositions to stay within viewport bounds.
 *
 * @example
 * ```tsx
 * <NodePreview node={hoveredNode} position={mousePosition} />
 * ```
 */
export function NodePreview({ node, position }: NodePreviewProps) {
  // Calculate position to keep card within viewport
  const cardWidth = 300;
  const cardHeight = 140;
  const padding = 16;

  const adjustedX =
    typeof window !== "undefined" && position.x + cardWidth + padding > window.innerWidth
      ? position.x - cardWidth - padding
      : position.x + padding;

  const adjustedY =
    typeof window !== "undefined" && position.y + cardHeight + padding > window.innerHeight
      ? position.y - cardHeight
      : position.y + padding;

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{ left: adjustedX, top: adjustedY }}
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 5 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="glass-strong rounded-xl p-4 shadow-2xl border border-[var(--border-primary)]"
            style={{ width: cardWidth }}
          >
            {/* Top: Type badge + read time */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                {TYPE_ICONS[node.type]}
                <span>{TYPE_LABELS[node.type]}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                <Clock size={11} />
                <span>{node.readTime} min</span>
              </div>
            </div>

            {/* Title */}
            <h4 className="font-[family-name:var(--font-geist-sans)] font-semibold text-sm text-[var(--text-primary)] leading-snug mb-1.5">
              {node.name}
            </h4>

            {/* Abstract */}
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-3">
              {truncate(node.abstract, 120)}
            </p>

            {/* Bottom: Category */}
            <div className="flex items-center justify-between">
              <CategoryBadge category={node.category} size="sm" />
              {/* Popularity indicator */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i < Math.ceil(node.popularity / 20)
                            ? node.color
                            : "var(--border-primary)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
