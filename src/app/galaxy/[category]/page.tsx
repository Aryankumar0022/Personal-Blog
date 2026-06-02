import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGalaxies, getGalaxy } from "@/lib/data/categories";
import { getAllArticleMetadata, getArticlesByCategory } from "@/lib/data/articles";
import type { CategoryId } from "@/lib/types";
import { GalaxyPageClient } from "./GalaxyPageClient";

/* ============================================================
   Galaxy Page — Server Component (Route Handler)
   
   Category landing page showing all articles within a specific
   "galaxy" (topic category).
   ============================================================ */

/** Generate static params for all galaxy categories. */
export async function generateStaticParams() {
  return getGalaxies().map((galaxy) => ({
    category: galaxy.id,
  }));
}

/** Generate dynamic metadata. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const galaxies = getGalaxies();
  const galaxy = galaxies.find((g) => g.id === category);

  if (!galaxy) {
    return { title: "Not Found" };
  }

  return {
    title: `${galaxy.icon} ${galaxy.name}`,
    description: galaxy.description,
  };
}

/** Galaxy page component. */
export default async function GalaxyPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const galaxies = getGalaxies();
  const galaxy = galaxies.find((g) => g.id === category);

  if (!galaxy) {
    notFound();
  }

  const allArticles = getAllArticleMetadata();
  const articles = getArticlesByCategory(galaxy.id);

  return <GalaxyPageClient galaxy={galaxy} articles={articles} allArticles={allArticles} galaxies={galaxies} />;
}
