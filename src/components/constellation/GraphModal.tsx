"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

import { KnowledgeGraph } from "@/components/constellation/KnowledgeGraph";
import { GalaxyFilter } from "@/components/constellation/GalaxyFilter";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import type { GraphNode, CategoryId, GraphData, Galaxy } from "@/lib/types";

/* ============================================================
   GraphModal — Full-screen Obsidian-style graph explorer.
   
   A high-z-index overlay that isolates the interactive graph,
   providing a dedicated distraction-free exploration mode.
   ============================================================ */

export interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  galaxies: Galaxy[];
  graphData: GraphData;
}

export function GraphModal({ isOpen, onClose, galaxies, graphData }: GraphModalProps) {
  const router = useRouter();
  
  // State for the graph
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Close on Escape key
  useKeyboardShortcut("escape", () => {
    if (isOpen) onClose();
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      // Measure dimensions
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        document.body.style.overflow = "unset";
      };
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Track mouse for node preview
  useEffect(() => {
    if (!isOpen) return;
    
    const handleMouse = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [isOpen]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      // Close modal first, then navigate
      onClose();
      router.push(`/article/${node.slug}`);
    },
    [onClose, router]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header area with close button */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
            <h2 className="font-[family-name:var(--font-geist-sans)] text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Knowledge Constellation
            </h2>
            
            <button
              onClick={onClose}
              className="pointer-events-auto p-2 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-primary)]"
              aria-label="Close graph view"
            >
              <X size={20} />
            </button>
          </div>

          {/* Graph Container */}
          <div className="flex-1 relative">
            <KnowledgeGraph
              width={dimensions.width}
              height={dimensions.height}
              activeCategory={activeCategory}
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              graphData={graphData}
            />
          </div>

          {/* Filter Bar */}
          <div className="absolute bottom-10 left-0 right-0 z-20 px-4 pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto">
              <GalaxyFilter
                activeGalaxy={activeCategory}
                onSelectGalaxy={setActiveCategory}
                galaxies={galaxies}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
