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

export { getGalaxies, getGalaxy, getGalaxyColor } from './categories';

export {
  getAllArticles,
  getAllArticleMetadata,
  getArticle,
  getArticlesByCategory,
  getFeaturedArticles,
  getRecentArticles,
} from './articles';

export {
  RELATIONSHIPS,
  getRelatedNodes,
} from './relationships';

export { getGraphData } from './graph';
