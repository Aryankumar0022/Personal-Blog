"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { GRAPH_CONFIG } from "@/lib/constants";
import { useTheme } from "@/lib/hooks/useTheme";
import type { GraphNode, CategoryId, GraphData } from "@/lib/types";

/* ============================================================
   KnowledgeGraph — Interactive force-directed knowledge graph.
   
   Physics strategy:
   - High warmupTicks (100) computes the layout off-screen.
   - cooldownTicks=0 freezes the simulation immediately after.
   - Nodes are completely static once placed — no jelly.
   - Dragging pins the node (fx/fy) so it stays where you drop it.
   - Node label color adapts to dark/light theme.
   ============================================================ */

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-blue)] border-t-transparent animate-spin" />
    </div>
  ),
});

/** Props for the KnowledgeGraph component. */
export interface KnowledgeGraphProps {
  width?: number;
  height?: number;
  activeCategory?: CategoryId | null;
  onNodeHover?: (node: GraphNode | null, event: MouseEvent | null) => void;
  onNodeClick?: (node: GraphNode) => void;
  graphData: GraphData;
}

export function KnowledgeGraph({
  width,
  height,
  activeCategory = null,
  onNodeHover,
  onNodeClick,
  graphData,
}: KnowledgeGraphProps) {
  const graphRef = useRef<any>(null);
  const router = useRouter();
  const { isDark } = useTheme();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    // ── Configure d3 forces after mount ───────────────────────────────
  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;

    // Obsidian-like physics:
    // 1. Strong charge to keep them apart
    // 2. Collision force to prevent any overlap
    // 3. Very gentle center force to keep them from drifting off screen
    // 4. Stiff but bouncy links
    fg.d3Force("charge")?.strength(-400).distanceMax(800);
    fg.d3Force("collide", (window as any).d3?.forceCollide().radius((node: any) => {
        const baseRadius = Math.sqrt(node.val || 4) * GRAPH_CONFIG.nodeBaseSize;
        return baseRadius * 2.5; // Keep nodes well separated
    }).iterations(2));
    fg.d3Force("link")
      ?.distance((link: any) => 100 - (link.strength ?? 0.5) * 40)
      .strength((link: any) => (link.strength ?? 0.5) * 1.5);
    fg.d3Force("center")?.strength(0.02); // Very gentle centering

    // Restart simulation on data load
    fg.d3ReheatSimulation();
  }, [graphData]);

  // ── Drag handlers: Obsidian style (unpins on release) ─────────────
  const handleNodeDrag = useCallback((node: any) => {
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const handleNodeDragEnd = useCallback((node: any) => {
    // Unpin node after drag so it returns to floating state naturally
    node.fx = undefined;
    node.fy = undefined;
  }, []);

  const handleNodeHover = useCallback(
    (node: any) => {
      setHoveredNodeId(node?.id ?? null);
      onNodeHover?.(node as GraphNode | null, null);
      const canvas = document.querySelector(".graph-canvas canvas") as HTMLCanvasElement;
      if (canvas) canvas.style.cursor = node ? "pointer" : "grab";
    },
    [onNodeHover]
  );

  const handleNodeClick = useCallback(
    (node: any) => {
      if (onNodeClick) {
        onNodeClick(node as GraphNode);
      } else {
        router.push(`/article/${(node as GraphNode).slug}`);
      }
    },
    [onNodeClick, router]
  );

  // Memoize connected neighbors for hover dimming
  const connectedNeighbors = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    
    const connected = new Set<string>();
    connected.add(hoveredNodeId); // self is connected
    
    graphData.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
      
      if (sourceId === hoveredNodeId) connected.add(targetId);
      if (targetId === hoveredNodeId) connected.add(sourceId);
    });
    
    return connected;
  }, [hoveredNodeId, graphData.links]);

  // ── Custom node rendering ──────────────────────────────────────────
  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const g = node as GraphNode & { x: number; y: number };
      const { x, y, color, name, val, id } = g;
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(val)) return;

      const isHovered = hoveredNodeId === id;
      const isConnected = hoveredNodeId ? connectedNeighbors.has(id) : true;
      const isFiltered = activeCategory && g.category !== activeCategory;
      
      // Calculate opacity
      let alpha = 1;
      if (isFiltered) alpha = 0.15;
      else if (hoveredNodeId && !isConnected) alpha = 0.2; // Dim unconnected nodes
      
      const baseRadius = Math.sqrt(val) * GRAPH_CONFIG.nodeBaseSize;
      const radius = isHovered ? baseRadius * GRAPH_CONFIG.nodeHoverScale : baseRadius;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Obsidian nodes don't typically have glowing shadows, they are flat and crisp
      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Border on hover or if connected
      if (isHovered || (hoveredNodeId && isConnected)) {
          ctx.beginPath();
          ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
          ctx.strokeStyle = isHovered ? color : `${color}88`; // 50% opacity
          ctx.lineWidth = 1.5 / globalScale; // Keep line thin regardless of zoom
          ctx.stroke();
      }

      // Label — Obsidian style (shows up at a certain zoom, always shows on hover/connected)
      const shouldShowLabel = globalScale >= 1.5 || isHovered || (hoveredNodeId && isConnected);
      
      if (shouldShowLabel) {
        // Base font size on zoom level so it scales nicely, but clamp it
        const fontSize = Math.max(12 / globalScale, 3);
        ctx.font = `${isHovered ? '600' : '400'} ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const labelColor = isDark ? "#A1A1AA" : "#52525B";
        const labelHighlightColor = isDark ? "#FFFFFF" : "#000000";
        
        ctx.fillStyle = isHovered || (hoveredNodeId && isConnected) ? labelHighlightColor : labelColor;
        ctx.globalAlpha = isFiltered ? 0.1 : (hoveredNodeId && !isConnected) ? 0.1 : 0.9;

        // Draw a tiny background pill behind text for readability over lines
        const textWidth = ctx.measureText(name).width;
        ctx.fillStyle = isDark ? `rgba(9, 9, 11, ${isHovered ? 0.8 : 0.6})` : `rgba(252, 252, 252, ${isHovered ? 0.8 : 0.6})`;
        ctx.fillRect(x - textWidth/2 - 2, y + radius + 4, textWidth + 4, fontSize + 2);
        
        // Draw Text
        ctx.fillStyle = isHovered || (hoveredNodeId && isConnected) ? labelHighlightColor : labelColor;
        ctx.fillText(name, x, y + radius + 4 + (fontSize/2));
      }

      ctx.restore();
    },
    [hoveredNodeId, activeCategory, isDark, connectedNeighbors]
  );

  // ── Custom link rendering ──────────────────────────────────────────
  const paintLink = useCallback(
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const source = link.source as { x: number; y: number, id: string };
      const target = link.target as { x: number; y: number, id: string };
      if (
        !source || !target ||
        !Number.isFinite(source.x) || !Number.isFinite(source.y) ||
        !Number.isFinite(target.x) || !Number.isFinite(target.y)
      ) return;

      const isHoveredLink = hoveredNodeId && (source.id === hoveredNodeId || target.id === hoveredNodeId);
      const isFiltered = activeCategory && (link.source.category !== activeCategory && link.target.category !== activeCategory);
      
      let linkAlpha = link.strength * 0.3; // Base opacity
      if (isFiltered) linkAlpha = 0.02;
      else if (hoveredNodeId && !isHoveredLink) linkAlpha = 0.05; // Dim unconnected links highly
      else if (isHoveredLink) linkAlpha = Math.max(0.6, link.strength); // Highlight connected links

      const linkBase = isDark ? "255, 255, 255" : "0, 0, 0";
      
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      
      // If the link is hovered, we can draw a gradient between the two node colors!
      if (isHoveredLink && typeof link.source.color === 'string' && typeof link.target.color === 'string') {
          const grad = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
          grad.addColorStop(0, link.source.color);
          grad.addColorStop(1, link.target.color);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = linkAlpha;
      } else {
          ctx.strokeStyle = `rgba(${linkBase}, ${linkAlpha})`;
      }
      
      // Keep lines crisp regardless of zoom, but slightly thicker for hovered links
      ctx.lineWidth = isHoveredLink ? 2 / globalScale : 1 / globalScale;
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    [activeCategory, isDark, hoveredNodeId]
  );

  return (
    <div className="graph-canvas w-full h-full relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        
        // Physics — Continuous floating simulation (no freeze)
        d3AlphaDecay={0.01}  // Obsidian floats continuously 
        d3VelocityDecay={0.2} 
        
        // Rendering
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
          const val = (node as GraphNode).val || 4;
          const radius = Math.sqrt(val) * GRAPH_CONFIG.nodeBaseSize * 1.8;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }}
        linkCanvasObject={paintLink}
        
        // Interactions
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={handleNodeDragEnd}
        
        // Zoom & Pan
        minZoom={GRAPH_CONFIG.zoomRange[0]}
        maxZoom={GRAPH_CONFIG.zoomRange[1]}
        enablePanInteraction={true}
        enableZoomInteraction={true}
        enableNodeDrag={true}
      />
    </div>
  );
}
