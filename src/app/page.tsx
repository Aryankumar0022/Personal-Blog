import { getRecentArticles, getAllArticleMetadata } from "@/lib/data/articles";
import { getGalaxies } from "@/lib/data/categories";
import { getGraphData } from "@/lib/data/graph";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const recentArticles = getRecentArticles(4);
  const allArticles = getAllArticleMetadata();
  const galaxies = getGalaxies();
  const graphData = getGraphData();

  return (
    <HomePageClient 
      recentArticles={recentArticles} 
      allArticles={allArticles} 
      galaxies={galaxies} 
      graphData={graphData}
    />
  );
}
