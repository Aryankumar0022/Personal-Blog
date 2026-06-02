// =============================================================================
// Nexus Journal — Article Data Fetching
// =============================================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { CategoryId, ContentNode, ContentNodeMetadata } from '../types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

/**
 * Get all articles from the filesystem.
 */
export function getAllArticles(): ContentNode[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const fileNames = fs.readdirSync(ARTICLES_DIR);
  return fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(ARTICLES_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(fileContents);

      return {
        id: data.id,
        slug,
        title: data.title,
        abstract: data.abstract,
        type: data.type,
        category: data.category as CategoryId,
        tags: data.tags || [],
        coverImage: data.coverImage,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        readTime: data.readTime,
        popularity: data.popularity,
        featured: data.featured,
        content,
      } as ContentNode;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Get all articles without the bulky content body, useful for client-side search.
 */
export function getAllArticleMetadata(): ContentNodeMetadata[] {
  return getAllArticles().map(({ content, ...meta }) => meta);
}

/**
 * Find a single article by its URL slug.
 *
 * @param slug - URL-safe slug (e.g. `"the-architecture-of-large-language-models"`)
 * @returns The matching `ContentNode`, or `undefined` if not found
 */
export function getArticle(slug: string): ContentNode | undefined {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return undefined;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id: data.id,
    slug,
    title: data.title,
    abstract: data.abstract,
    type: data.type,
    category: data.category as CategoryId,
    tags: data.tags || [],
    coverImage: data.coverImage,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    readTime: data.readTime,
    popularity: data.popularity,
    featured: data.featured,
    content,
  } as ContentNode;
}

/**
 * Get all articles belonging to a specific galaxy (category).
 *
 * @param category - The `CategoryId` to filter by
 * @returns Array of matching `ContentNode`s, sorted by publication date (newest first)
 */
export function getArticlesByCategory(category: CategoryId): ContentNode[] {
  return getAllArticles().filter((a) => a.category === category);
}

/**
 * Get all articles marked as `featured`.
 *
 * @returns Array of featured `ContentNode`s
 */
export function getFeaturedArticles(): ContentNode[] {
  return getAllArticles().filter((a) => a.featured);
}

/**
 * Get the most recent articles.
 *
 * @param count - Maximum number of articles to return (default: 5)
 * @returns Array of `ContentNode`s sorted by publication date (newest first)
 */
export function getRecentArticles(count: number = 5): ContentNode[] {
  return getAllArticles().slice(0, count);
}
