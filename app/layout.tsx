import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";

import "./globals.css";
import { site } from "@/content/site";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Cursor } from "@/components/providers/cursor";
import { Interactions } from "@/components/providers/interactions";

// Design-handoff typography: display/sans = Space Grotesk, mono = Space Mono.
// globals.css --font-sans / --font-mono point at these CSS variables.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// Production domain (canonical + OG URLs).
const SITE_URL = "https://prazwal.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
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
    title: `${site.name} · ${site.role}`,
    description: site.tagline,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
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
      className={`${spaceGrotesk.variable} ${spaceMono.variable} dark`}
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
        <Interactions />
      </body>
    </html>
  );
}
