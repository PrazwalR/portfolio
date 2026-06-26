import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
import { Reveal } from "@/components/motion/reveal";

export function Blog() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Writing"
            titleId="blog-title"
            title="From the blog"
            description="Notes on Rust, DeFi, and building at the systems layer."
          />
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={0.05}>
            <Card className="mt-12">
              <CardContent className="flex flex-col items-start gap-3 p-8">
                <Badge variant="accent">Coming soon</Badge>
                <p className="max-w-xl text-balance leading-relaxed text-muted-foreground">
                  Posts are on the way. This section is wired to{" "}
                  <code className="font-mono text-foreground">
                    content/blog.ts
                  </code>{" "}
                  — add entries there (or MDX under{" "}
                  <code className="font-mono text-foreground">app/blog</code>)
                  and cards render automatically.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Card interactive className="group h-full">
                  <CardHeader>
                    <span className="font-mono text-xs text-muted-foreground">
                      {post.date}
                    </span>
                    <CardTitle className="flex items-center gap-1.5 text-lg">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="after:absolute after:inset-0"
                      >
                        {post.title}
                      </Link>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-accent" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
