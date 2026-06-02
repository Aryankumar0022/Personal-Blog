// =============================================================================
// Nexus Journal — Utility Functions
// =============================================================================

/**
 * Merge CSS class names, filtering out falsy values.
 *
 * A lightweight alternative to `clsx` — accepts strings, `undefined`,
 * `null`, and `false`, joins the truthy ones with a space.
 *
 * @example
 * ```ts
 * cn('px-4', isActive && 'bg-blue-500', undefined, 'text-white');
 * // => "px-4 bg-blue-500 text-white"
 * ```
 */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format an ISO 8601 date string into a human-readable form.
 *
 * @param date  - ISO date string (e.g. `"2026-01-15"`)
 * @param style - Intl date style: `'long'` (default), `'short'`, `'medium'`
 * @returns Formatted date string (e.g. `"January 15, 2026"`)
 *
 * @example
 * ```ts
 * formatDate('2026-01-15');         // "January 15, 2026"
 * formatDate('2026-01-15', 'short'); // "1/15/2026"
 * ```
 */
export function formatDate(
  date: string,
  style: 'long' | 'short' | 'medium' = 'long',
): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: style }).format(
    new Date(date),
  );
}

/**
 * Estimate reading time based on word count.
 *
 * Uses an average reading speed of **200 words per minute** and always
 * returns at least 1 minute.
 *
 * @param content - Raw text or markdown content
 * @returns Estimated reading time in whole minutes
 */
export function estimateReadTime(content: string): number {
  const WORDS_PER_MINUTE = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/**
 * Convert arbitrary text into a URL-safe slug.
 *
 * Lowercases the input, replaces non-alphanumeric characters with hyphens,
 * collapses consecutive hyphens, and trims leading/trailing hyphens.
 *
 * @example
 * ```ts
 * slugify('The Architecture of LLMs!'); // "the-architecture-of-llms"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Truncate a string to `maxLength` characters, appending an ellipsis
 * if the string was shortened. Breaks at the last space before the limit
 * to avoid splitting words.
 *
 * @param text      - The string to truncate
 * @param maxLength - Maximum allowed length (including the ellipsis)
 * @returns The (possibly shortened) string
 *
 * @example
 * ```ts
 * truncate('Hello beautiful world', 15); // "Hello…"
 * ```
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  const breakpoint = lastSpace > 0 ? lastSpace : maxLength;

  return `${trimmed.slice(0, breakpoint)}…`;
}

/**
 * Pick `count` random items from an array using the Fisher–Yates shuffle.
 *
 * Returns a **new** array — the original is not mutated.
 * If `count >= array.length`, returns a shuffled copy of the full array.
 *
 * @typeParam T - Element type
 * @param array - Source array
 * @param count - Number of items to pick
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array];
  const n = Math.min(count, shuffled.length);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, n);
}

/**
 * Linearly interpolate between two numbers.
 *
 * @param start - Value at t = 0
 * @param end   - Value at t = 1
 * @param t     - Interpolation factor (typically 0–1, but not clamped)
 * @returns The interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5); // 50
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a number to a given inclusive range.
 *
 * @param value - The number to clamp
 * @param min   - Lower bound
 * @param max   - Upper bound
 * @returns The clamped value
 *
 * @example
 * ```ts
 * clamp(150, 0, 100); // 100
 * clamp(-5, 0, 100);  // 0
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
