/**
 * SectionHeading — eyebrow (mono, accent) + display title + optional description.
 * Renders a semantic <h2> by default; pass `id` to anchor section landmarks.
 * Pass `as="h1"` on standalone pages (e.g. /blog) that have no other h1 —
 * the homepage's h1 is the Hero name, so every in-page SectionHeading there
 * stays h2.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  titleId?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
  align = "left",
  as: Heading = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          <span aria-hidden className="h-px w-6 bg-accent/60" />
          {eyebrow}
        </span>
      ) : null}
      <Heading
        id={titleId}
        className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
      >
        {title}
      </Heading>
      {description ? (
        <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeading };
