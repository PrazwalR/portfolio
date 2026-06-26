import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { site } from "@/content/site";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Cursor } from "@/components/providers/cursor";

// TODO: set to the production domain once deployed (used for canonical + OG URLs).
const SITE_URL = "https://prazwalratti.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "Prazwal Ratti",
    "Web3 developer",
    "Backend developer",
    "Rust",
    "Solidity",
    "TypeScript",
    "DeFi",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-glow"
        >
          Skip to content
        </a>
        <LenisProvider>{children}</LenisProvider>
        <Cursor />
      </body>
    </html>
  );
}
