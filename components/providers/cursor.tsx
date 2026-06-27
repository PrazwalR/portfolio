"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Soft glow spotlight cursor. A blurred accent light eases after the pointer
 * (mix-blend-screen so it adds light over the dark UI), brightening + growing
 * over interactive elements and dimming on press. Position/grow lerp at the
 * --cursor-* tokens. Renders nothing on touch or under prefers-reduced-motion.
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
      const hit = (e.target as Element | null)?.closest?.(
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
      const s = (1 + grow * 0.9) * (1 - down * 0.18);
      el.style.opacity = vis ? (0.45 + grow * 0.35).toFixed(3) : "0";
      el.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${s.toFixed(
        3
      )})`;
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
      className="pointer-events-none fixed left-0 top-0 z-[90] h-14 w-14 rounded-full opacity-0 blur-lg mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--accent) / 0.7), hsl(var(--accent) / 0) 70%)",
        willChange: "transform, opacity",
      }}
    />
  );
}
