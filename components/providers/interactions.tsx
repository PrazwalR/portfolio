"use client";

import { useEffect } from "react";

/**
 * Global interaction layer (design-handoff motion system). Vanilla pointer
 * handlers driven by data-attributes, reading exact values from CSS tokens:
 *  - [data-magnetic] : magnetic pull toward pointer (strength/radius, spring snap-back)
 *  - [data-tilt]     : 3D pointer-tilt (perspective 1000px, --tilt-max)
 *  - [data-btn]      : white click ripple
 * All gated on (pointer:fine) + !prefers-reduced-motion — touch/reduced-motion
 * get none of it.
 */
export function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const root = getComputedStyle(document.documentElement);
    const num = (name: string, fallback: number) => {
      const n = parseFloat(root.getPropertyValue(name));
      return Number.isNaN(n) ? fallback : n;
    };
    const strength = num("--magnetic-strength", 0.3);
    const radius = num("--magnetic-radius", 100);
    const tiltMax = num("--tilt-max", 8);

    const cleanups: Array<() => void> = [];

    // ---- magnetic CTAs ----
    const mags = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    );
    if (mags.length) {
      const onMag = (e: PointerEvent) => {
        for (const b of mags) {
          const r = b.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy);
          b.style.transition = "transform .25s var(--ease-spring)";
          if (dist < radius) {
            const f = 1 - dist / radius;
            b.style.transform = `translate(${(dx * strength * f).toFixed(
              2
            )}px, ${(dy * strength * f).toFixed(2)}px)`;
          } else {
            b.style.transform = "translate(0, 0)";
          }
        }
      };
      window.addEventListener("pointermove", onMag, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onMag));
    }

    // ---- 3D tilt cards ----
    const tilts = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tilt]")
    );
    for (const c of tilts) {
      const onMove = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 2 * tiltMax;
        const ry = (px - 0.5) * 2 * tiltMax;
        c.style.transition = "transform var(--tilt-in)";
        c.style.transform = `perspective(1000px) rotateX(${rx.toFixed(
          2
        )}deg) rotateY(${ry.toFixed(2)}deg)`;
      };
      const onLeave = () => {
        c.style.transition = "transform var(--tilt-out)";
        c.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      };
      c.addEventListener("pointermove", onMove);
      c.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        c.removeEventListener("pointermove", onMove);
        c.removeEventListener("pointerleave", onLeave);
      });
    }

    // ---- click ripple ----
    const onClick = (e: MouseEvent) => {
      const t = (e.target as Element | null)?.closest?.(
        "[data-btn]"
      ) as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const span = document.createElement("span");
      span.style.cssText = `position:absolute;left:${
        e.clientX - r.left - size / 2
      }px;top:${
        e.clientY - r.top - size / 2
      }px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,.35);pointer-events:none;transform:scale(0);opacity:1;transition:transform .65s var(--ease-out),opacity .65s var(--ease-out);`;
      if (getComputedStyle(t).position === "static") t.style.position = "relative";
      t.style.overflow = "hidden";
      t.appendChild(span);
      requestAnimationFrame(() => {
        span.style.transform = "scale(1)";
        span.style.opacity = "0";
      });
      window.setTimeout(() => span.remove(), 700);
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
