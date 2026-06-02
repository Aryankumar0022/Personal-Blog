"use client";

import { useRef, useEffect, useCallback } from "react";

/* ============================================================
   ParticleField — Dynamic Flow Field Background.
   
   Renders a field of particles drawn as tiny oriented dashes
   that form a continuous color gradient across the screen.
   Features a fast, highly reactive mouse attraction and swirl.
   ============================================================ */

/** Configuration for a single particle. */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
  colorOffset: number; // Random variation for color sampling
}

export interface ParticleFieldProps {
  /** Number of particles to render. */
  count?: number;
  /** Additional CSS class names for the canvas container. */
  className?: string;
}

/**
 * An ambient flow-field particle system rendered on HTML5 Canvas.
 */
export function ParticleField({
  count = 800, // Increased count for the field effect
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  
  // Track mouse position for the swarm effect
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  /** Initialize particles with random positions and velocities. */
  const initParticles = useCallback(
    (width: number, height: number) => {
      particlesRef.current = Array.from({ length: count }, () => {
        const vx = (Math.random() - 0.5) * 1.5;
        const vy = (Math.random() - 0.5) * 1.5;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx * 0.5,
          baseVy: vy * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          opacity: 0,
          targetOpacity: Math.random() * 0.7 + 0.3,
          colorOffset: (Math.random() - 0.5) * 0.2, // +/- 20% position offset for color
        };
      });
    },
    [count]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (particlesRef.current.length === 0 || particlesRef.current.length !== count) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    // Color gradient stops matching the screenshot (Blue -> Purple -> Red -> Orange)
    const getGradientColor = (ratio: number) => {
      // Clamp ratio
      const r = Math.max(0, Math.min(1, ratio));
      if (r < 0.33) {
        // Blue to Purple (#2563EB to #8B5CF6)
        const t = r / 0.33;
        return `rgb(${Math.floor(37 + t * (139 - 37))}, ${Math.floor(99 + t * (92 - 99))}, ${Math.floor(235 + t * (246 - 235))})`;
      } else if (r < 0.66) {
        // Purple to Red/Rose (#8B5CF6 to #F43F5E)
        const t = (r - 0.33) / 0.33;
        return `rgb(${Math.floor(139 + t * (244 - 139))}, ${Math.floor(92 + t * (63 - 92))}, ${Math.floor(246 + t * (94 - 246))})`;
      } else {
        // Red to Orange (#F43F5E to #F97316)
        const t = (r - 0.66) / 0.34;
        return `rgb(${Math.floor(244 + t * (249 - 244))}, ${Math.floor(63 + t * (115 - 63))}, ${Math.floor(94 + t * (22 - 94))})`;
      }
    };

    // ---------- Animation Loop ----------
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const interactionRadius = 400; // Large interaction area

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fade in on load
        if (p.opacity < p.targetOpacity) {
          p.opacity += 0.01;
        }

        // --- Physics & Forces ---

        // 1. Global gentle swirl around center
        const dcx = cx - p.x;
        const dcy = cy - p.y;
        const distToCenter = Math.sqrt(dcx * dcx + dcy * dcy);
        if (distToCenter > 0) {
          p.vx += (dcy / distToCenter) * 0.015;
          p.vy -= (dcx / distToCenter) * 0.015;
        }

        // 2. Fast Mouse Attraction / Swirl
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius) {
            const force = Math.pow((interactionRadius - dist) / interactionRadius, 1.5);
            
            // Much stronger, faster pull
            const pullStrength = 0.8;
            const swirlStrength = 0.6;
            
            p.vx += (dx / dist) * force * pullStrength;
            p.vy += (dy / dist) * force * pullStrength;
            
            // Fast swirl around mouse
            p.vx += (dy / dist) * force * swirlStrength;
            p.vy -= (dx / dist) * force * swirlStrength;
          }
        }

        // Apply friction to prevent infinite acceleration but keep it fluid
        p.vx *= 0.92;
        p.vy *= 0.92;

        // Restore gentle drift
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // --- Rendering ---
        
        // Color based on horizontal position (0 to 1) + individual random offset
        const xRatio = (p.x / width) + p.colorOffset;
        const color = getGradientColor(xRatio);

        // Speed determines the length of the dash
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const dashLength = Math.max(3, Math.min(speed * 3, 20)); // Cap length
        
        // Calculate angle of movement
        // If speed is very low, it just draws a short horizontal-ish dash
        const angle = speed > 0.1 ? Math.atan2(p.vy, p.vx) : Math.atan2(p.baseVy, p.baseVx);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(-dashLength / 2, 0);
        ctx.lineTo(dashLength / 2, 0);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = p.radius * 1.5;
        ctx.lineCap = "round";
        ctx.globalAlpha = Math.min(1, p.opacity + (speed * 0.05)); // Brighter when fast
        
        ctx.stroke();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
