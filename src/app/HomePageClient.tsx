"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowDown, Clock, Network } from "lucide-react";

import { ParticleField } from "@/components/effects/ParticleField";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { CategoryBadge } from "@/components/ui/Badge";
import { GlowButton } from "@/components/ui/GlowButton";
import { GraphModal } from "@/components/constellation/GraphModal";

import { useTheme } from "@/lib/hooks/useTheme";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import type { ContentNode, Galaxy, ContentNodeMetadata, GraphData } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/constants";

/* ============================================================
   Landing Page — Interactive Knowledge Universe
   
   Features:
   - Dynamic particle background
   - Launch button for Obsidian-style Graph View Modal
   - Featured content grid
   - Galaxies directory
   ============================================================ */

export interface HomePageClientProps {
  recentArticles: ContentNode[];
  allArticles: ContentNodeMetadata[];
  galaxies: Galaxy[];
  graphData: GraphData;
}

export default function HomePageClient({ recentArticles, allArticles, galaxies, graphData }: HomePageClientProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  // ⌘K shortcut
  useKeyboardShortcut("ctrl+k", () => setIsSearchOpen(true));
  useKeyboardShortcut("meta+k", () => setIsSearchOpen(true));

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={allArticles}
        galaxies={galaxies}
      />

      {/* The Obsidian-style Graph View Modal */}
      <GraphModal 
        isOpen={isGraphModalOpen} 
        onClose={() => setIsGraphModalOpen(false)} 
        galaxies={galaxies}
        graphData={graphData}
      />

      <main className="flex-1">
        {/* ============ HERO SECTION ============ */}
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4">
          {/* Ambient particles (background) */}
          <ParticleField
            count={isMobile ? 25 : 50}
            className="absolute inset-0 z-0"
          />

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center select-none text-center">
            <motion.h1
              className="font-[family-name:var(--font-geist-sans)] text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter solid-text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {SITE_CONFIG.name}
            </motion.h1>
            
            <motion.p
              className="mt-4 mb-10 text-lg sm:text-xl text-[var(--text-secondary)] max-w-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {SITE_CONFIG.tagline}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            >
              <GlowButton 
                size="lg" 
                icon={<Network size={18} />}
                onClick={() => setIsGraphModalOpen(true)}
              >
                Explore Graph View
              </GlowButton>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 1.5 },
              y: { duration: 2, repeat: Infinity },
            }}
          >
            <ArrowDown size={20} className="text-[var(--text-tertiary)]" />
          </motion.div>
        </section>

        {/* ============ FEATURED CONTENT ============ */}
        <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8 pb-24 bg-gradient-to-b from-transparent to-[var(--bg-primary)]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                Featured Explorations
              </h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                Deep dives across the knowledge constellation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    enableGlow
                    glowColor={`${galaxies.find((g) => g.id === article.category)?.color ?? "#2563EB"}20`}
                    className="cursor-pointer h-full"
                    onClick={() => router.push(`/article/${article.slug}`)}
                  >
                    <div
                      className="h-1 w-16 rounded-full mb-4"
                      style={{
                        background: `linear-gradient(90deg, ${
                          galaxies.find((g) => g.id === article.category)?.color ?? "#2563EB"
                        }, transparent)`,
                      }}
                    />
                    <div className="flex items-center justify-between mb-3">
                      <CategoryBadge category={article.category} />
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Clock size={12} />
                        {article.readTime} min
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-geist-sans)] font-semibold text-lg text-[var(--text-primary)] leading-snug mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-3">
                      {article.abstract}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
                Explore Galaxies
              </h2>
              <p className="text-[var(--text-secondary)] mb-8">
                Navigate by topic through the knowledge constellation
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galaxies.map((galaxy, index) => (
                  <motion.div
                    key={galaxy.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard
                      enableGlow
                      glowColor={`${galaxy.color}25`}
                      className="cursor-pointer text-center"
                      onClick={() => router.push(`/galaxy/${galaxy.id}`)}
                    >
                      <span className="text-3xl mb-2 block">{galaxy.icon}</span>
                      <h3
                        className="font-semibold text-sm mb-1"
                        style={{ color: galaxy.color }}
                      >
                        {galaxy.name}
                      </h3>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {galaxy.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
