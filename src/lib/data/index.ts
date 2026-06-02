// =============================================================================
// Nexus Journal — Data Layer Barrel Export
// =============================================================================

/**
 * Re-exports all data modules for convenient single-path imports:
 *
 * ```ts
 * import { ARTICLES, GALAXIES, RELATIONSHIPS, getGraphData } from '@/lib/data';
 * ```
 */

export { GALAXIES, getGalaxy, getGalaxyColor } from './categories';

export {
  ARTICLES,
  getArticle,
  getArticlesByCategory,
  getFeaturedArticles,
  getRecentArticles,
} from './articles';

export {
  RELATIONSHIPS,
  getRelatedNodes,
  getGraphData,
} from './relationships';
