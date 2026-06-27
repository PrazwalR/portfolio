"use client";

import { useState } from "react";

/**
 * Image with a graceful fallback. Renders a token-styled placeholder until the
 * real file exists at `src` (or if it fails to load) — so the Experience section
 * looks intentional before the photos are dropped into /public/achievements.
 */
export function EventImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-muted to-card ${
          className ?? ""
        }`}
        aria-label={alt}
        role="img"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          photo soon
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
