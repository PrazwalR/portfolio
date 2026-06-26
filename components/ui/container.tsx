/**
 * Container — the layout spine. Centers content, caps width at --container-max,
 * and applies the responsive --gutter on both sides. Use it to wrap every section.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mx-auto w-full max-w-container px-gutter", className)}
    {...props}
  />
));
Container.displayName = "Container";

export { Container };
