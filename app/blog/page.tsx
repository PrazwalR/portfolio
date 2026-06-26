import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { posts } from "@/content/blog";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  SectionHeading,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on Rust, DeFi, and building at the systems layer.",
};

export default function BlogIndexPage() {
  return (
    <main className="py-16">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          Back to site
        </Link>

        <div className="mt-8">
          <SectionHeading
            eyebrow="Writing"
            title="Blog"
            description="Notes on Rust, DeFi, and building at the systems layer."
          />
        </div>

        {posts.length === 0 ? (
          <Card className="mt-12">
            <CardContent className="flex flex-col items-start gap-3 p-8">
              <Badge variant="accent">Coming soon</Badge>
              <p className="max-w-xl text-balance leading-relaxed text-muted-foreground">
                No posts yet. Add entries to{" "}
                <code className="font-mono text-foreground">content/blog.ts</code>{" "}
                (or wire MDX in this route) and they&apos;ll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} interactive className="group h-full">
                <CardHeader>
                  <span className="font-mono text-xs text-muted-foreground">
                    {post.date}
                  </span>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
