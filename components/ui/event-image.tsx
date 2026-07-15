"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Image with a graceful fallback. Renders a token-styled placeholder until the
 * real file exists at `src` (or if it fails to load) — so the Experience section
 * looks intentional before the photos are dropped into /public/achievements.
 *
 * Two layout modes: `fill` (default) for a positioned-parent hero image, or
 * explicit `width`/`height` for fixed-size thumbnails — next/image requires
 * one or the other.
 */
export function EventImage({
  src,
  alt,
  className,
  fill = true,
  width,
  height,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
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

  return fill ? (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 768px) 22rem, 100vw"}
      className={className}
      onError={() => setErrored(true)}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
