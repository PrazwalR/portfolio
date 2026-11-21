"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Square icon button that copies `value` to the clipboard and flips to a
 * check mark for a moment. Announces the result through a polite live region.
 */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  /** what is being copied, for the accessible name, e.g. "email address" */
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked (insecure context / permissions): leave the button as is
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      title={copied ? "Copied" : `Copy ${label}`}
      data-cursor="link"
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-md border border-border text-muted-foreground transition-[color,border-color] duration-fast ease-out hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        copied && "border-emerald-400/50 text-emerald-400 hover:border-emerald-400/50 hover:text-emerald-400",
        className
      )}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  );
}
