// =============================================================================
// Nexus Journal — Content Relationships (Client-safe)
//
// This file is deliberately free of `fs` / `path` / `gray-matter` imports so
// it can be safely imported from Client Components (e.g. ThoughtExplorer).
// The heavy `getGraphData()` builder lives in `graph.ts` instead.
// =============================================================================

import type { ContentLink } from '../types';

// -----------------------------------------------------------------------------
// Relationship Definitions
// -----------------------------------------------------------------------------

/**
 * Meaningful connections between content nodes in the knowledge graph.
 *
 * Each link has a `strength` value (0–1) that controls visual weight:
 * - **0.9–1.0** — Core relationships within the same topic
 * - **0.6–0.8** — Strong thematic connections across related topics
 * - **0.3–0.5** — Lighter cross-category bridges
 *
 * These links are curated, not auto-generated, to ensure the graph
 * communicates genuine intellectual connections.
 */
export const RELATIONSHIPS: ContentLink[] = [
  // ── AI Research cluster ────────────────────────────────────────────
  {
    source: 'article-llm-architecture',
    target: 'tutorial-attention-mechanisms',
    strength: 0.95,
    label: 'Attention is a core component of LLM architecture',
  },

  // ── Software Engineering cluster ───────────────────────────────────
  {
    source: 'article-resilient-microservices',
    target: 'research-edge-computing',
    strength: 0.7,
    label: 'Edge deployments require resilient service patterns',
  },

  // ── Photography cluster ────────────────────────────────────────────
  {
    source: 'article-golden-hour',
    target: 'article-street-tokyo',
    strength: 0.8,
    label: 'Light and composition techniques shared across genres',
  },

  // ── Photography ↔ Travel ───────────────────────────────────────────
  {
    source: 'article-street-tokyo',
    target: 'article-kyoto-temples',
    strength: 0.85,
    label: 'Both explore visual storytelling in Japan',
  },
  {
    source: 'article-golden-hour',
    target: 'article-kyoto-temples',
    strength: 0.5,
    label: 'Golden-hour light enhances temple photography',
  },

  // ── Philosophy cluster ─────────────────────────────────────────────
  {
    source: 'article-consciousness',
    target: 'article-stoicism-digital',
    strength: 0.6,
    label: 'Both explore the nature of subjective experience',
  },

  // ── Philosophy ↔ AI (consciousness connection) ─────────────────────
  {
    source: 'article-consciousness',
    target: 'article-llm-architecture',
    strength: 0.7,
    label: 'Machine consciousness question connects to LLM capabilities',
  },
  {
    source: 'article-consciousness',
    target: 'tutorial-attention-mechanisms',
    strength: 0.45,
    label: 'Attention in AI vs attention in consciousness',
  },

  // ── Projects ↔ Software Engineering ────────────────────────────────
  {
    source: 'project-nexus-journal',
    target: 'article-resilient-microservices',
    strength: 0.5,
    label: 'Shared engineering principles in system design',
  },
  {
    source: 'project-nexus-journal',
    target: 'research-edge-computing',
    strength: 0.4,
    label: 'Edge-first deployment considerations for the blog',
  },

  // ── Projects ↔ AI ──────────────────────────────────────────────────
  {
    source: 'project-nexus-journal',
    target: 'article-llm-architecture',
    strength: 0.35,
    label: 'Blog covers AI topics extensively',
  },

  // ── Cross-category bridges ─────────────────────────────────────────
  {
    source: 'research-edge-computing',
    target: 'article-llm-architecture',
    strength: 0.65,
    label: 'Running LLMs on edge devices is an active research area',
  },
  {
    source: 'research-edge-computing',
    target: 'tutorial-attention-mechanisms',
    strength: 0.4,
    label: 'Efficient attention mechanisms for edge inference',
  },
  {
    source: 'article-stoicism-digital',
    target: 'project-nexus-journal',
    strength: 0.35,
    label: 'Digital intentionality reflected in the blog\'s design',
  },
  {
    source: 'article-stoicism-digital',
    target: 'article-street-tokyo',
    strength: 0.3,
    label: 'Mindful observation connects Stoic practice and photography',
  },
  {
    source: 'article-kyoto-temples',
    target: 'article-consciousness',
    strength: 0.4,
    label: 'Zen temple aesthetics connect to consciousness inquiry',
  },
  {
    source: 'article-kyoto-temples',
    target: 'article-stoicism-digital',
    strength: 0.45,
    label: 'Japanese contemplative culture echoes Stoic mindfulness',
  },

  // ── Additional thematic links ──────────────────────────────────────
  {
    source: 'article-resilient-microservices',
    target: 'article-llm-architecture',
    strength: 0.35,
    label: 'Serving LLMs at scale requires resilient infrastructure',
  },
  {
    source: 'article-golden-hour',
    target: 'article-consciousness',
    strength: 0.25,
    label: 'Perception of beauty connects aesthetics and consciousness',
  },
];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Get all relationships involving a specific content node.
 *
 * Returns links where the node appears as either source or target.
 *
 * @param nodeId - The content node id to search for
 * @returns Array of `ContentLink`s involving this node
 */
export function getRelatedNodes(nodeId: string): ContentLink[] {
  return RELATIONSHIPS.filter(
    (r) => r.source === nodeId || r.target === nodeId,
  );
}
