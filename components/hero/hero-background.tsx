"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Reserved hero background area. Static layers (grid + accent glow + bottom fade)
 * paint immediately; the WebGL smoke field is dynamically imported (ssr:false)
 * and mounted on idle so it never blocks first paint. Under reduced-motion it
 * paints a single static frame; with no WebGL it renders nothing and the static
 * layers carry the hero (see SmokeField). The legacy canvas dot-field still
 * lives in ./dot-field if we ever want to swap back.
 */
const SmokeField = dynamic(
  () => import("./smoke-field").then((m) => m.SmokeField),
  { ssr: false, loading: () => null }
);

export function HeroBackground() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(
          () => cb({ didTimeout: false, timeRemaining: () => 0 }),
          250
        ));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setMount(true));
    return () => cancel(id as number);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.10]" />
      <div className="absolute left-1/2 top-[-10%] h-[42rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />
      {mount ? <SmokeField /> : null}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
