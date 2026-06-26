/**
 * Blog posts. Empty for now — content added later (e.g. MDX in app/blog).
 * When `posts` is empty the Blog section renders a "coming soon" state.
 */
export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags?: string[];
}

export const posts: Post[] = [
  // TODO: add posts, e.g.
  // {
  //   title: "Eliminating liquidations in decentralized lending",
  //   slug: "eliminating-liquidations",
  //   excerpt: "Notes from ongoing research...",
  //   date: "2026-01-01",
  //   tags: ["DeFi", "Research"],
  // },
];
