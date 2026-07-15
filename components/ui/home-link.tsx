"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Link to "/" that force-resets scroll when already on the homepage.
 * Next.js only auto-scrolls-to-top on a route *change* — clicking a plain
 * `<Link href="/">` while already at pathname "/" (e.g. after following a
 * "#blog" section anchor) just strips the hash and leaves scroll position
 * where it was, so "Home" appears to do nothing. This forces the reset in
 * exactly that case; a real cross-page navigation to "/" is unaffected
 * (Next already scrolls that to top correctly).
 */
export function HomeLink({
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href="/"
      onClick={(e) => {
        onClick?.(e);
        if (window.location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }}
      {...props}
    />
  );
}
