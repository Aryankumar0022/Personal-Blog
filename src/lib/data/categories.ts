// =============================================================================
// Nexus Journal — Galaxy (Category) Definitions
// =============================================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { CategoryId, Galaxy } from '../types';
import { COLORS } from '../constants';

// -----------------------------------------------------------------------------
// Galaxy Registry
// -----------------------------------------------------------------------------

const CATEGORIES_DIR = path.join(process.cwd(), 'content', 'categories');

/**
 * Get all galaxies (content categories) in the Nexus Journal universe.
 * Reads from content/categories/*.mdx files.
 */
export function getGalaxies(): Galaxy[] {
  if (!fs.existsSync(CATEGORIES_DIR)) return [];
  
  const fileNames = fs.readdirSync(CATEGORIES_DIR);
  const galaxies = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx$/, '') as CategoryId;
      const fullPath = path.join(CATEGORIES_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data } = matter(fileContents);
      
      return {
        id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        gradient: data.gradient,
      } as Galaxy;
    });

  return galaxies;
}

/**
 * Look up a galaxy by its `CategoryId`.
 *
 * @param id - The category identifier
 * @returns The matching `Galaxy` object
 * @throws {Error} If the id does not match any known galaxy
 */
export function getGalaxy(id: CategoryId): Galaxy {
  const galaxies = getGalaxies();
  const galaxy = galaxies.find((g) => g.id === id);
  if (!galaxy) {
    throw new Error(`[Nexus] Unknown galaxy id: "${id}"`);
  }
  return galaxy;
}

/**
 * Get the primary hex colour for a galaxy.
 *
 * @param id - The category identifier
 * @returns Hex colour string (e.g. `"#2563EB"`)
 */
export function getGalaxyColor(id: CategoryId): string {
  return getGalaxy(id).color;
}
