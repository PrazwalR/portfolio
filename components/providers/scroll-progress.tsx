"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Thin accent line pinned to the top edge of the viewport that tracks reading
 * depth. Sits just above the sticky header; purely decorative (aria-hidden).
 * Under reduced-motion it maps 1:1 to scroll instead of spring-smoothing.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent/30 via-accent to-accent/30 shadow-[0_0_12px_-1px_hsl(var(--accent)_/_0.6)]"
    />
  );
}
