"use client";

import { useRef, useEffect, useCallback } from "react";

/* ============================================================
   ParticleField — Ambient floating particles background.
   
   Renders a field of slowly drifting, fading particles on a
   Canvas element. Creates a subtle, living background effect.
   Features an "antigravity/swarm" effect where particles are
   attracted to the user's mouse cursor.
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
  color: string;
}

/** Props for the ParticleField component. */
export interface ParticleFieldProps {
  /** Number of particles to render. */
  count?: number;
  /** Particle colors (randomly sampled). */
  colors?: string[];
  /** Maximum particle radius in pixels. */
  maxRadius?: number;
  /** Maximum particle velocity. */
  maxSpeed?: number;
  /** Whether to draw faint connection lines between nearby particles. */
  connectDistance?: number;
  /** Additional CSS class names for the canvas container. */
  className?: string;
}

/**
 * An ambient floating particle field rendered on HTML5 Canvas.
 */
export function ParticleField({
  count = 70,
  colors = ["#2563EB", "#8B5CF6", "#06B6D4", "#10B981"],
  maxRadius = 2,
  maxSpeed = 1.5,
  connectDistance = 120,
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
        const vx = (Math.random() - 0.5) * maxSpeed;
        const vy = (Math.random() - 0.5) * maxSpeed;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: Math.random() * maxRadius + 0.8,
          opacity: 0,
          targetOpacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    },
    [count, colors, maxRadius, maxSpeed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Track mouse movement globally so it works even if the canvas is behind UI elements
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Ensure mouse coordinates are relative to the canvas
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

    // ---------- Animation Loop ----------
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const interactionRadius = 350; // Increased interaction distance

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fade in on load
        if (p.opacity < p.targetOpacity) {
          p.opacity += 0.005;
        }

        // Swarm / Antigravity logic
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius) {
            // Calculate attraction force (stronger closer to the cursor)
            const force = (interactionRadius - dist) / interactionRadius;
            
            // Stronger pull and swirl for faster effect
            const pullStrength = 0.15;
            const swirlStrength = 0.08;
            
            p.vx += (dx / dist) * force * pullStrength;
            p.vy += (dy / dist) * force * pullStrength;
            
            // Add perpendicular vector for swirl
            p.vx += (dy / dist) * force * swirlStrength;
            p.vy -= (dx / dist) * force * swirlStrength;
          }
        }

        // Apply gentle friction so they don't accelerate infinitely
        p.vx *= 0.94; // Increased friction to control higher speeds
        p.vy *= 0.94;

        // Restore base drift if velocity drops too low (e.g. mouse left)
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Particles glow brighter when moving fast (caught in gravity well)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const dynamicOpacity = Math.min(1, p.opacity + (speed * 0.1));
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = dynamicOpacity;
        
        // Add subtle glow
        ctx.shadowBlur = speed > 1 ? 10 : 3;
        ctx.shadowColor = p.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for lines

        // Draw connections to nearby particles
        if (connectDistance > 0) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Dynamically increase connect distance if particles are caught in swarm
            const dynamicConnectDist = (speed > 1) ? connectDistance * 1.5 : connectDistance;

            if (dist < dynamicConnectDist) {
              const lineOpacity =
                (1 - dist / dynamicConnectDist) * 0.15 * Math.min(dynamicOpacity, q.opacity);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = lineOpacity;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initParticles, connectDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
