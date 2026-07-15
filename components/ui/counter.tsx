"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up number. Animates 0 → `to` over --counter-duration with an
 * easeOutCubic curve once the element is in view. Under reduced-motion it
 * jumps straight to the final value.
 *
 * Checks the bounding rect immediately on mount (not just the
 * IntersectionObserver callback) so a direct deep link to an anchor further
 * down the page (e.g. `/#open-source` from a blog post) — where the browser
 * has already scrolled the element into view before this component's
 * observer attaches — still animates instead of sitting at 0.
 */
export function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
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
    const run = () => {
      if (done) return;
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
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) run();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);

    // Fallback for elements already on-screen at mount (deep-linked anchor).
    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (alreadyVisible) run();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
