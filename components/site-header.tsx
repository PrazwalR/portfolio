"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { nav, site } from "@/content/site";
import { Button, Container } from "@/components/ui";

/**
 * Nav items are homepage section anchors ("#work"). Prefix with "/" so they
 * resolve correctly from any route (e.g. a blog post) — Next.js Link handles
 * same-page hash scroll and cross-page navigate-then-scroll for "/#work"
 * automatically, without a full reload when already on "/".
 */
function sectionHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}

/** Sticky top nav. Solid/blur on scroll; collapses to a toggle panel on mobile. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-base ease-out",
        scrolled || open
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-sm font-mono text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent">{"//"}</span> {site.name}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={sectionHref(item.href)}
              className="rounded-sm text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" variant="outline">
            <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {open ? (
        <Container className="md:hidden">
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1 border-t border-border py-3"
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              Home
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={sectionHref(item.href)}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" variant="outline" className="mt-2 w-full">
              <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer">
                Résumé
              </a>
            </Button>
          </nav>
        </Container>
      ) : null}
    </header>
  );
}
