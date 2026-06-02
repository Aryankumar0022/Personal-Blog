// =============================================================================
// Nexus Journal — Galaxy (Category) Definitions
// =============================================================================

import type { CategoryId, Galaxy } from '../types';
import { COLORS } from '../constants';

// -----------------------------------------------------------------------------
// Galaxy Registry
// -----------------------------------------------------------------------------

/**
 * All galaxies (content categories) in the Nexus Journal universe.
 *
 * Each galaxy is a themed cluster in the knowledge graph, with its own
 * colour identity and gradient used in cards, badges, and graph nodes.
 */
export const GALAXIES: Galaxy[] = [
  {
    id: 'ai-research',
    name: 'AI Research',
    description:
      'Explorations in artificial intelligence, machine learning architectures, and the frontier of intelligent systems.',
    icon: '🧠',
    color: COLORS.galaxy['ai-research'],
    gradient: ['#2563EB', '#7C3AED'],
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    description:
      'Systems design, distributed architecture, developer tooling, and the craft of building reliable software.',
    icon: '⚙️',
    color: COLORS.galaxy['software-engineering'],
    gradient: ['#8B5CF6', '#EC4899'],
  },
  {
    id: 'photography',
    name: 'Photography',
    description:
      'Capturing light, colour, and moment — from golden-hour landscapes to candid street scenes.',
    icon: '📷',
    color: COLORS.galaxy['photography'],
    gradient: ['#F59E0B', '#EF4444'],
  },
  {
    id: 'travel',
    name: 'Travel',
    description:
      'Wandering through cultures, cities, and landscapes — field notes from the physical world.',
    icon: '🌍',
    color: COLORS.galaxy['travel'],
    gradient: ['#10B981', '#06B6D4'],
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    description:
      'Reflections on consciousness, ethics, meaning, and the perennial questions of human existence.',
    icon: '💭',
    color: COLORS.galaxy['philosophy'],
    gradient: ['#06B6D4', '#3B82F6'],
  },
  {
    id: 'personal',
    name: 'Personal',
    description:
      'Life updates, introspections, and the unfiltered human behind the screen.',
    icon: '✨',
    color: COLORS.galaxy['personal'],
    gradient: ['#F43F5E', '#F97316'],
  },
  {
    id: 'projects',
    name: 'Projects',
    description:
      'Deep dives into things I\'ve built — open-source tools, creative experiments, and side quests.',
    icon: '🚀',
    color: COLORS.galaxy['projects'],
    gradient: ['#F97316', '#EAB308'],
  },
];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/** Internal lookup map for O(1) access by id. */
const galaxyMap = new Map<CategoryId, Galaxy>(
  GALAXIES.map((g) => [g.id, g]),
);

/**
 * Look up a galaxy by its `CategoryId`.
 *
 * @param id - The category identifier
 * @returns The matching `Galaxy` object
 * @throws {Error} If the id does not match any known galaxy
 */
export function getGalaxy(id: CategoryId): Galaxy {
  const galaxy = galaxyMap.get(id);
  if (!galaxy) {
    throw new Error(`[Nexus] Unknown galaxy id: "${id}"`);
  }
  return galaxy;
}

/**
 * Get the primary hex colour for a galaxy.
 *
 * Shorthand for `getGalaxy(id).color` — useful in graph renderers
 * and dynamic style generation.
 *
 * @param id - The category identifier
 * @returns Hex colour string (e.g. `"#2563EB"`)
 */
export function getGalaxyColor(id: CategoryId): string {
  return getGalaxy(id).color;
}
