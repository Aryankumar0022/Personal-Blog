import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticle, ARTICLES } from "@/lib/data/articles";
import { SITE_CONFIG } from "@/lib/constants";
import { ArticlePageClient } from "./ArticlePageClient";

/* ============================================================
   Article Page — Server Component (Route Handler)
   
   Handles:
   - Static params generation for all articles
   - Dynamic metadata (SEO) based on article content
   - Article data fetching and 404 handling
   - Renders the client-side article experience
   ============================================================ */

/** Generate static params for all articles at build time. */
export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

/** Generate dynamic metadata for SEO. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: "Not Found" };
  }

  return {
    title: article.title,
    description: article.abstract,
    openGraph: {
      title: article.title,
      description: article.abstract,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [SITE_CONFIG.author],
      tags: article.tags,
    },
  };
}

/** Article page component. */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePageClient article={article} />;
}
