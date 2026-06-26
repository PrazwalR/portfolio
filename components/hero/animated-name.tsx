"use client";

import { useEffect, useState } from "react";

/**
 * Per-character hero name entrance: each glyph rises + de-rotates into place
 * (translateY(46px) rotate(8deg) → 0, 760ms --ease-out, delay 200ms + i×46ms).
 * Under reduced-motion it renders statically. The accessible name is on the
 * wrapper; the per-char spans are aria-hidden.
 */
export function AnimatedName({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [reduce, setReduce] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setReduce(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    setShown(true);
  }, []);

  const chars = Array.from(text);

  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre will-change-transform"
          style={
            reduce
              ? undefined
              : {
                  opacity: shown ? 1 : 0,
                  transform: shown
                    ? "translateY(0) rotate(0deg)"
                    : "translateY(46px) rotate(8deg)",
                  transition: `transform 760ms var(--ease-out) ${
                    200 + i * 46
                  }ms, opacity 760ms var(--ease-out) ${200 + i * 46}ms`,
                }
          }
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
