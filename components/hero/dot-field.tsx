"use client";

import { useEffect, useRef } from "react";

/**
 * Hero dot-matrix ripple field (design-handoff, Direction B).
 * Plain canvas-2D (no WebGL): ambient sine wave + cursor push (R=150) + click
 * shockwave rings. Dots are accent-colored via --acc-rgb. DPR capped at 1.75,
 * dot gap 30px (38px ≤640px). Under prefers-reduced-motion it paints one static
 * frame and stops (no RAF). Exact constants lifted from the reference build.
 */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const acc =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--acc-rgb")
        .trim() || "54, 183, 243";

    let w = 0,
      h = 0,
      cols = 0,
      rows = 0,
      ox = 0,
      oy = 0,
      gap = 30,
      mx = -9999,
      my = -9999,
      raf = 0;
    const bursts: { x: number; y: number; t: number }[] = [];
    const R = 150;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = window.innerWidth <= 640 ? 38 : 30;
      cols = Math.ceil(w / gap) + 1;
      rows = Math.ceil(h / gap) + 1;
      ox = (w - (cols - 1) * gap) / 2;
      oy = (h - (rows - 1) * gap) / 2;
    };
    fit();

    const localXY = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = localXY(e);
      mx = p.x;
      my = p.y;
    };
    const onDown = (e: PointerEvent) => {
      const p = localXY(e);
      if (p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h) {
        bursts.push({ x: p.x, y: p.y, t: performance.now() });
      }
    };
    const onResize = () => fit();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onResize);

    const t0 = performance.now();
    const frame = () => {
      const time = (performance.now() - t0) / 1000;
      const now = performance.now();
      ctx.clearRect(0, 0, w, h);

      for (let k = bursts.length - 1; k >= 0; k--) {
        if ((now - bursts[k].t) / 1000 > 0.85) bursts.splice(k, 1);
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = ox + i * gap,
            y = oy + j * gap;
          const dx = x - mx,
            dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const wave = reduce
            ? 0
            : Math.sin(time * 1.4 + (x + y) * 0.012) * 0.5 + 0.5;
          let size = 1.1 + wave * 0.7;
          let alpha = 0.14 + wave * 0.09;
          let dispX = 0,
            dispY = 0;

          if (dist < R) {
            const f = 1 - dist / R;
            const nx = dist > 0.001 ? dx / dist : 0;
            const ny = dist > 0.001 ? dy / dist : 0;
            dispX += nx * f * 14;
            dispY += ny * f * 14;
            size += f * 2.6;
            alpha = 0.16 + f * 0.7;
          }

          for (let k = 0; k < bursts.length; k++) {
            const bz = bursts[k];
            const age = (now - bz.t) / 1000;
            const ringR = age * 540;
            const bdx = x - bz.x,
              bdy = y - bz.y;
            const bd = Math.sqrt(bdx * bdx + bdy * bdy);
            const prox = 1 - Math.min(Math.abs(bd - ringR) / 70, 1);
            if (prox > 0) {
              const fade = Math.max(0, 1 - age / 0.85);
              const bnx = bd > 0.001 ? bdx / bd : 0;
              const bny = bd > 0.001 ? bdy / bd : 0;
              dispX += bnx * prox * fade * 26;
              dispY += bny * prox * fade * 26;
              size += prox * fade * 2.4;
              alpha += prox * fade * 0.6;
            }
          }

          ctx.beginPath();
          ctx.arc(x + dispX, y + dispY, size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + acc + "," + Math.min(alpha, 0.9).toFixed(3) + ")";
          ctx.fill();
        }
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
