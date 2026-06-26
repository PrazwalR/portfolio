/**
 * Badge — the Tag / Chip primitive (tech-stack pills, eyebrow labels).
 * Mono font for the "engineered" look. Variants: default | accent | outline.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-xs leading-5 transition-colors duration-fast ease-out",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-muted-foreground",
        accent: "border-accent/30 bg-accent/10 text-accent",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
