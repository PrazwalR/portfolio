/**
 * Blog post metadata. The post body lives as raw markdown in
 * `content/posts/<slug>.md` and is read + rendered by `app/blog/[slug]`.
 * Newest first; the homepage Blog section and /blog index both map this list.
 */
export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags?: string[];
}

export const posts: Post[] = [
  {
    title:
      "I Got Tired of Babysitting Releases, So I Built a CLI That Doesn't Need Me",
    slug: "apiforge-release-cli",
    excerpt:
      "Apiforge takes merged code to healthy pods in production in one command, and rolls itself back in reverse if any step fails. A field guide to every way a release pipeline can quietly betray you.",
    date: "2026-07-01",
    tags: ["Rust", "CLI", "DevOps", "Kubernetes"],
  },
  {
    title:
      "Building SwapKit: How I Killed 3 Weeks of DEX Integration Down to 4 Lines of Code",
    slug: "building-swapkit",
    excerpt:
      "One SDK across Uniswap V4, 1inch Fusion+ and Paraswap with built-in MEV protection, and the quietly-wrong bugs I had to kill to make sandwich-risk scoring actually correct.",
    date: "2026-06-15",
    tags: ["Rust", "TypeScript", "DeFi", "MEV"],
  },
];
