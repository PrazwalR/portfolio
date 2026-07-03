import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { posts } from "@/content/blog";
import { site } from "@/content/site";
import { Badge, Container } from "@/components/ui";
import { PostBody } from "@/components/blog/post-body";
import { ContactFooter } from "@/components/sections/contact-footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const file = path.join(process.cwd(), "content", "posts", `${slug}.md`);
  const content = fs.readFileSync(file, "utf8");

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header className="border-b border-border/60">
        <Container className="flex h-16 items-center">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-tight text-foreground"
          >
            <span className="text-accent">{"//"}</span> {site.name}
          </Link>
        </Container>
      </header>

      <main className="py-14 sm:py-20">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-3.5" />
              All writing
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted-foreground">
              <time dateTime={post.date}>{formattedDate}</time>
              {post.tags?.length ? (
                <>
                  <span aria-hidden>·</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-10">
              <PostBody content={content} />
            </div>
          </article>
        </Container>
      </main>

      <ContactFooter />
    </>
  );
}
