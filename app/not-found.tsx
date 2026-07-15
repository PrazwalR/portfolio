import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Newspaper } from "lucide-react";

import { Button, Container } from "@/components/ui";
import { SiteHeader } from "@/components/site-header";
import { ContactFooter } from "@/components/sections/contact-footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-dvh items-center pb-16 pt-32">
        <Container className="flex flex-col items-start gap-6">
          <span className="font-mono text-sm text-accent">404</span>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            This page doesn&apos;t exist.
          </h1>
          <p className="max-w-md text-balance leading-relaxed text-muted-foreground">
            The link might be broken, or the page may have moved. Try the
            homepage, or browse the blog.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/">
                <Home />
                Home
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">
                <Newspaper />
                Blog
              </Link>
            </Button>
          </div>
        </Container>
      </main>
      <ContactFooter />
    </>
  );
}
