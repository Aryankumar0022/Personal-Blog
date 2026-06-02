// =============================================================================
// Nexus Journal — App-Wide Constants
// =============================================================================

import type { CategoryId } from './types';

// -----------------------------------------------------------------------------
// Site Metadata
// -----------------------------------------------------------------------------

/**
 * Global site configuration used across meta tags, the header,
 * and structured data (JSON-LD).
 */
export const SITE_CONFIG = {
  /** Site name displayed in the header and browser tab */
  name: 'Nexus Journal',
  /** One-line tagline shown below the logo */
  tagline: 'A living map of thoughts, projects, ideas and discoveries.',
  /** Meta description for SEO */
  description:
    'An explorable digital knowledge universe — personal blog reimagined.',
  /** Default author name */
  author: 'Nexus',
  /** Canonical base URL */
  url: 'https://nexus-journal.dev',
} as const;

// -----------------------------------------------------------------------------
// Design Tokens
// -----------------------------------------------------------------------------

/**
 * Core colour palette that mirrors the Tailwind CSS theme.
 *
 * - `background` / `foreground` — surface colours per theme mode.
 * - `accent` — shared accent palette used for interactive elements.
 * - `galaxy` — per-category colours used in the knowledge graph.
 */
export const COLORS = {
  /** Surface background per theme */
  background: { dark: '#0A0A0A', light: '#FAFAFA' },
  /** Primary text colour per theme */
  foreground: { dark: '#FFFFFF', light: '#0A0A0A' },
  /** Shared accent palette */
  accent: {
    blue: '#2563EB',
    violet: '#8B5CF6',
    cyan: '#06B6D4',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#F43F5E',
    orange: '#F97316',
  },
  /**
   * Galaxy (category) colours — each key maps to a `CategoryId`.
   * Used to colour graph nodes, category badges, and gradient accents.
   */
  galaxy: {
    'ai-research': '#2563EB',
    'software-engineering': '#8B5CF6',
    'photography': '#F59E0B',
    'travel': '#10B981',
    'philosophy': '#06B6D4',
    'personal': '#F43F5E',
    'projects': '#F97316',
  } satisfies Record<CategoryId, string>,
} as const;

// -----------------------------------------------------------------------------
// Graph Physics Configuration
// -----------------------------------------------------------------------------

/**
 * Physics parameters for the d3-force simulation powering the knowledge graph.
 *
 * These values are tuned to produce a visually pleasing, explorable layout
 * with clear cluster separation and minimal overlap.
 */
export const GRAPH_CONFIG = {
  /** Default radius multiplier for graph nodes */
  nodeBaseSize: 4,
  /** Scale factor applied when a node is hovered */
  nodeHoverScale: 1.5,
  /** Target distance between linked nodes (px) */
  linkDistance: 80,
  /** Repulsion strength for the many-body force */
  chargeStrength: -120,
  /** Strength of the centering force (keeps the graph on-screen) */
  centerStrength: 0.05,
  /** Number of simulation ticks to run before the first render */
  warmupTicks: 100,
  /** Time in ms before the simulation freezes after warmup */
  cooldownTime: 3000,
  /** Min/max zoom range `[minZoom, maxZoom]` */
  zoomRange: [0.5, 8] as [number, number],
} as const;

// -----------------------------------------------------------------------------
// Animation Durations
// -----------------------------------------------------------------------------

/**
 * Standardised animation durations (in milliseconds).
 * Consumed by Motion variants and CSS transitions.
 */
export const ANIMATION = {
  /** Micro-interactions: button presses, toggles */
  fast: 150,
  /** Default transitions: modals, dropdowns */
  normal: 300,
  /** Emphasis transitions: page sections, accordions */
  slow: 500,
  /** Full page transitions (route changes) */
  pageTransition: 600,
} as const;

// -----------------------------------------------------------------------------
// Responsive Breakpoints
// -----------------------------------------------------------------------------

/**
 * Pixel breakpoints aligned with Tailwind CSS defaults.
 * Used by `useMediaQuery` and responsive layout utilities.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
