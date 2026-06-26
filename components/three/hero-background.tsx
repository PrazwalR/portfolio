"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * HeroBackground — the reserved full-viewport area for the hero visual.
 * Always renders a cheap static fallback (grid + accent glow). The R3F canvas
 * is dynamically imported (ssr:false) and only mounted after idle, and never
 * under prefers-reduced-motion — so it can't block LCP or fight accessibility.
 */
const HeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => null,
});

export function HeroBackground() {
  const [mount3d, setMount3d] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 250));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;

    const id = ric(() => setMount3d(true));
    return () => cancel(id as number);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* static fallback — also the 3D loading + reduced-motion state */}
      <div className="absolute inset-0 bg-grid opacity-[0.12]" />
      <div className="absolute left-1/2 top-[-10%] h-[42rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      {mount3d ? <HeroCanvas /> : null}
    </div>
  );
}
