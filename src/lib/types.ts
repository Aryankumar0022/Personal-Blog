// =============================================================================
// Nexus Journal — Core Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Content Types
// -----------------------------------------------------------------------------

/**
 * Discriminated content type for classifying nodes in the knowledge graph.
 * Each type may render differently in the UI and carry type-specific metadata.
 */
export type ContentType =
  | 'article'
  | 'project'
  | 'research'
  | 'gallery'
  | 'video'
  | 'book'
  | 'tutorial'
  | 'note';

// -----------------------------------------------------------------------------
// Content Node
// -----------------------------------------------------------------------------

/**
 * A single content node in the knowledge graph.
 *
 * Every piece of content — articles, projects, research notes — is
 * represented as a `ContentNode`. Nodes are rendered as stars in their
 * parent galaxy (category) and linked to other nodes via `ContentLink`.
 */
export interface ContentNode {
  /** Unique identifier (used as graph node id) */
  id: string;
  /** URL-safe slug for routing */
  slug: string;
  /** Display title */
  title: string;
  /** Short description, 1-2 sentences — shown on hover and in cards */
  abstract: string;
  /** Full article content in markdown format */
  content: string;
  /** The kind of content this node represents */
  type: ContentType;
  /** Parent galaxy/category this node belongs to */
  category: CategoryId;
  /** Freeform tags for filtering and search */
  tags: string[];
  /** URL or path to the cover/hero image */
  coverImage: string;
  /** ISO 8601 publication date */
  publishedAt: string;
  /** ISO 8601 date of the last meaningful update */
  updatedAt?: string;
  /** Estimated reading time in minutes */
  readTime: number;
  /** Popularity score (0–100) — drives node size in the graph */
  popularity: number;
  /** Whether this node should be surfaced on the home page */
  featured: boolean;
  /** Ordered list of sections for table-of-contents rendering */
  sections?: ArticleSection[];
}

// -----------------------------------------------------------------------------
// Article Section (Table of Contents)
// -----------------------------------------------------------------------------

/**
 * Represents a heading within an article, used to build a
 * navigable table of contents sidebar.
 */
export interface ArticleSection {
  /** Unique anchor id (e.g. `"architecture-overview"`) */
  id: string;
  /** Human-readable section title */
  title: string;
  /** Heading depth: 1 = h1, 2 = h2, 3 = h3 */
  level: number;
}

// -----------------------------------------------------------------------------
// Categories / Galaxies
// -----------------------------------------------------------------------------

/**
 * Literal union of all valid category (galaxy) identifiers.
 * Each galaxy groups related content nodes and has its own visual identity.
 */
export type CategoryId =
  | 'ai-research'
  | 'software-engineering'
  | 'photography'
  | 'travel'
  | 'philosophy'
  | 'personal'
  | 'projects';

/**
 * A galaxy represents a top-level content category, rendered as a
 * coloured cluster in the knowledge graph.
 */
export interface Galaxy {
  /** Unique category identifier */
  id: CategoryId;
  /** Human-readable display name */
  name: string;
  /** Short description of the galaxy's theme */
  description: string;
  /** Emoji icon shown in navigation and labels */
  icon: string;
  /** Primary hex colour for the galaxy */
  color: string;
  /** CSS gradient colour pair `[from, to]` */
  gradient: [string, string];
  /** Number of content nodes in this galaxy (computed at runtime) */
  nodeCount?: number;
}

// -----------------------------------------------------------------------------
// Content Relationships
// -----------------------------------------------------------------------------

/**
 * A weighted, directed edge between two `ContentNode`s in the knowledge graph.
 * Used to surface "related reading" and to render links in the force graph.
 */
export interface ContentLink {
  /** Source node id */
  source: string;
  /** Target node id */
  target: string;
  /** Relationship strength (0–1) — affects visual link weight */
  strength: number;
  /** Optional human-readable description of the relationship */
  label?: string;
}

// -----------------------------------------------------------------------------
// Graph Data Structures (react-force-graph compatible)
// -----------------------------------------------------------------------------

/**
 * Top-level data payload consumed by `react-force-graph-2d` / `3d`.
 */
export interface GraphData {
  /** All renderable nodes */
  nodes: GraphNode[];
  /** All renderable links between nodes */
  links: GraphLink[];
}

/**
 * Extended node type for graph rendering.
 * Carries visual properties alongside content metadata.
 *
 * `x` and `y` are populated by d3-force at runtime.
 */
export interface GraphNode {
  /** Unique node id (matches `ContentNode.id`) */
  id: string;
  /** Display label in the graph */
  name: string;
  /** Node size value — larger values = bigger circles */
  val: number;
  /** Hex colour for the node fill */
  color: string;
  /** Parent galaxy */
  category: CategoryId;
  /** Content type */
  type: ContentType;
  /** URL slug for navigation on click */
  slug: string;
  /** Short description shown on hover tooltip */
  abstract: string;
  /** Cover image path for tooltip preview */
  coverImage: string;
  /** Reading time in minutes */
  readTime: number;
  /** Popularity score 0–100 */
  popularity: number;
  /** Computed x position (set by d3-force) */
  x?: number;
  /** Computed y position (set by d3-force) */
  y?: number;
}

/**
 * Extended link type for graph rendering.
 * Source and target reference node ids (d3-force resolves them to objects).
 */
export interface GraphLink {
  /** Source node id */
  source: string;
  /** Target node id */
  target: string;
  /** Visual weight of the link (0–1) */
  strength: number;
  /** Optional hex colour override for the link stroke */
  color?: string;
}

// -----------------------------------------------------------------------------
// UI / App Types
// -----------------------------------------------------------------------------

/** Active colour scheme */
export type ThemeMode = 'dark' | 'light';

/**
 * A scored search result returned by the search utility.
 */
export interface SearchResult {
  /** The matched content node */
  node: ContentNode;
  /** Relevance score (higher = better match) */
  score: number;
  /** Which fields contributed to the match (e.g. `['title', 'tags']`) */
  matchedFields: string[];
}

/**
 * Tracks a user's reading progress for a specific article.
 * Persisted in localStorage for cross-session continuity.
 */
export interface ReadingProgress {
  /** The article's unique id */
  articleId: string;
  /** Scroll progress from 0 (unread) to 1 (finished) */
  progress: number;
  /** ISO 8601 timestamp of the last reading session */
  lastRead: string;
}
