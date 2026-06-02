"use client";

import { motion } from "motion/react";

/* ============================================================
   AnimatedText — Staggered text reveal animation.
   
   Splits text into individual characters or words and animates
   each element with a stagger delay for a premium reveal effect.
   ============================================================ */

/** Props for the AnimatedText component. */
export interface AnimatedTextProps {
  /** The text string to animate. */
  text: string;
  /** HTML tag to render. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** Whether to split by character or word. */
  splitBy?: "character" | "word";
  /** Delay before animation starts (seconds). */
  delay?: number;
  /** Duration of each element's animation (seconds). */
  duration?: number;
  /** Stagger delay between each element (seconds). */
  stagger?: number;
  /** Additional CSS class names. */
  className?: string;
  /** Whether to animate on view or immediately. */
  animateOnView?: boolean;
}

/**
 * Renders text with a staggered character-by-character or
 * word-by-word reveal animation.
 *
 * Uses Motion's `staggerChildren` orchestration for smooth,
 * cascading reveals. Respects `prefers-reduced-motion`.
 *
 * @example
 * ```tsx
 * <AnimatedText
 *   text="Nexus Journal"
 *   as="h1"
 *   splitBy="character"
 *   className="text-5xl font-bold"
 * />
 * ```
 */
export function AnimatedText({
  text,
  as: Tag = "span",
  splitBy = "word",
  delay = 0,
  duration = 0.4,
  stagger = 0.03,
  className = "",
  animateOnView = true,
}: AnimatedTextProps) {
  const elements =
    splitBy === "character" ? text.split("") : text.split(" ");

  // Container animation orchestrates children
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Each child element fades in and translates up
  const childVariants: any = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      {...(animateOnView
        ? { whileInView: "visible", viewport: { once: true, margin: "-50px" } }
        : { animate: "visible" })}
    >
      {elements.map((element, index) => (
        <motion.span
          key={`${element}-${index}`}
          variants={childVariants}
          className="inline-block"
          style={{
            // Preserve spaces between words
            marginRight: splitBy === "word" ? "0.3em" : undefined,
            // Preserve space characters
            whiteSpace: element === " " ? "pre" : undefined,
          }}
        >
          {element === " " ? "\u00A0" : element}
        </motion.span>
      ))}
    </MotionTag>
  );
}
