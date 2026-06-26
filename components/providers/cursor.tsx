"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Targeting-reticle cursor (design-handoff).
 * Ring + 4 ticks + center dot in white, `mix-blend-mode: difference` so it stays
 * legible over the accent-colored hero dot field. Position lerps at --cursor-lerp;
 * grows ×1.7 and rotates --cursor-rotate over interactive elements; contracts on
 * press. Renders nothing on touch or under prefers-reduced-motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const el = ref.current;
    if (!el) return;

    const root = getComputedStyle(document.documentElement);
    const lerp = parseFloat(root.getPropertyValue("--cursor-lerp")) || 0.3;
    const growLerp =
      parseFloat(root.getPropertyValue("--cursor-grow-lerp")) || 0.16;

    let px = -100,
      py = -100,
      rx = -100,
      ry = -100,
      grow = 0,
      tGrow = 0,
      down = 0,
      tDown = 0,
      vis = 0,
      raf = 0;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      vis = 1;
      const target = e.target as Element | null;
      const hit = target?.closest?.(
        "[data-cursor=link],[data-tilt],a,button,input,textarea,[role=button]"
      );
      tGrow = hit ? 1 : 0;
    };
    const onDown = () => (tDown = 1);
    const onUp = () => (tDown = 0);
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) vis = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onOut);

    const loop = () => {
      rx += (px - rx) * lerp;
      ry += (py - ry) * lerp;
      grow += (tGrow - grow) * growLerp;
      down += (tDown - down) * 0.25;
      const s = (1 + grow * 0.7) * (1 - down * 0.16);
      el.style.opacity = vis ? "1" : "0";
      el.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) rotate(${(
        grow * 45
      ).toFixed(2)}deg) scale(${s.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 opacity-0 mix-blend-difference"
      style={{ willChange: "transform, opacity" }}
    >
      <span className="absolute inset-0 rounded-full border border-white" />
      <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-white" />
      <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white" />
      <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-white" />
      <span className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-white" />
    </div>
  );
}
