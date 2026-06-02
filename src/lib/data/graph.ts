// =============================================================================
// Nexus Journal — Graph Data Builder (Server-only)
//
// This module imports from `articles.ts` and `categories.ts` which use `fs`,
// so it MUST only be called from Server Components or build-time code.
// =============================================================================

import type { GraphData, GraphLink, GraphNode, CategoryId } from '../types';
import { getAllArticleMetadata } from './articles';
import { getGalaxies } from './categories';
import { RELATIONSHIPS } from './relationships';

// -----------------------------------------------------------------------------
// Graph Builder
// -----------------------------------------------------------------------------

/**
 * Transform articles and relationships into the `GraphData` format
 * consumed by react-force-graph.
 *
 * - Nodes are coloured by their galaxy.
 * - Node `val` is derived from the popularity score for size differentiation.
 * - Links carry their original strength for rendering.
 *
 * @returns Complete `GraphData` payload ready for the force graph
 */
export function getGraphData(): GraphData {
  const articles = getAllArticleMetadata();
  const galaxies = getGalaxies();

  const getGalaxyColor = (id: CategoryId) => {
    return galaxies.find(g => g.id === id)?.color || '#000';
  };

  const nodes: GraphNode[] = articles.map((article) => ({
    id: article.id,
    name: article.title,
    val: Math.max(2, article.popularity / 10),
    color: getGalaxyColor(article.category),
    category: article.category,
    type: article.type,
    slug: article.slug,
    abstract: article.abstract,
    coverImage: article.coverImage,
    readTime: article.readTime,
    popularity: article.popularity,
  }));

  const links: GraphLink[] = RELATIONSHIPS.map((rel) => ({
    source: rel.source,
    target: rel.target,
    strength: rel.strength,
    color: `rgba(255, 255, 255, ${rel.strength * 0.3})`,
  }));

  return { nodes, links };
}
