import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

import { posts } from "@/content/blog";
import { site, SITE_URL } from "@/content/site";
import { Badge, Container, HomeLink } from "@/components/ui";
import { PostBody } from "@/components/blog/post-body";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { SiteHeader } from "@/components/site-header";
import { ContactFooter } from "@/components/sections/contact-footer";

const WORDS_PER_MINUTE = 200;

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
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = posts[postIndex];
  if (!post) notFound();

  const file = path.join(process.cwd(), "content", "posts", `${slug}.md`);
  const content = fs.readFileSync(file, "utf8");

  const wordCount = content.trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

  const previousPost = posts[postIndex - 1];
  const nextPost = posts[postIndex + 1];

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: postUrl,
    mainEntityOfPage: postUrl,
    author: { "@type": "Person", name: site.name, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <SiteHeader />

      <main className="pb-14 pt-32 sm:pb-20 sm:pt-36">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft className="size-3.5" />
                Back to blog
              </Link>
              <HomeLink className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-accent">
                <Home className="size-3.5" />
                Home
              </HomeLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted-foreground">
              <time dateTime={post.date}>{formattedDate}</time>
              <span aria-hidden>·</span>
              <span>{readingMinutes} min read</span>
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

            {previousPost || nextPost ? (
              <nav
                aria-label="More posts"
                className="mt-14 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2"
              >
                {previousPost ? (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <ArrowLeft className="size-3.5" />
                      Previous
                    </span>
                    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                      {previousPost.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-accent/40 sm:col-start-2"
                  >
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      Next
                      <ArrowLeft className="size-3.5 rotate-180" />
                    </span>
                    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </article>
        </Container>
      </main>

      <ContactFooter />
      <ScrollToTop />
    </>
  );
}
