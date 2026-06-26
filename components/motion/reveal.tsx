"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal — fade + slide-up on scroll-into-view. Falls back to a plain wrapper
 * (no animation) when the user prefers reduced motion.
 */
interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
