"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up number. Fires once when 50% in-view; animates 0 → `to` over
 * --counter-duration with an easeOutCubic curve. Under reduced-motion it jumps
 * straight to the final value.
 */
export function Counter({
  to,
  className,
}: {
  to: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const dur =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--counter-duration"
        )
      ) || 1600;

    let raf = 0;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !done) {
            done = true;
            io.disconnect();
            const t0 = performance.now();
            const tick = () => {
              const p = Math.min((performance.now() - t0) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(to * eased));
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
