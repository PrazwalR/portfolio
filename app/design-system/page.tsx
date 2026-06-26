import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  SectionHeading,
  Separator,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Living style guide — every design token and UI primitive on one page.",
};

/* ------------------------------------------------------------------ */
/* Token tables (names mirror app/globals.css — the source of truth).  */
/* ------------------------------------------------------------------ */

const colorTokens = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "card", className: "bg-card" },
  { name: "popover", className: "bg-popover" },
  { name: "muted", className: "bg-muted" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "border", className: "bg-border" },
  { name: "input", className: "bg-input" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-foreground", className: "bg-accent-foreground" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "destructive", className: "bg-destructive" },
  { name: "ring", className: "bg-ring" },
];

const typeScale = [
  { token: "text-7xl", className: "text-7xl" },
  { token: "text-6xl", className: "text-6xl" },
  { token: "text-5xl", className: "text-5xl" },
  { token: "text-4xl", className: "text-4xl" },
  { token: "text-3xl", className: "text-3xl" },
  { token: "text-2xl", className: "text-2xl" },
  { token: "text-xl", className: "text-xl" },
  { token: "text-base", className: "text-base" },
  { token: "text-sm", className: "text-sm" },
  { token: "text-xs", className: "text-xs" },
];

const spaceScale = [
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-6",
  "--space-8",
  "--space-12",
  "--space-16",
  "--space-24",
];

const radii = [
  { token: "rounded-sm", className: "rounded-sm" },
  { token: "rounded-md", className: "rounded-md" },
  { token: "rounded-lg", className: "rounded-lg" },
  { token: "rounded-xl", className: "rounded-xl" },
  { token: "rounded-2xl", className: "rounded-2xl" },
];

const shadows = [
  { token: "shadow-sm", className: "shadow-sm" },
  { token: "shadow-md", className: "shadow-md" },
  { token: "shadow-lg", className: "shadow-lg" },
  { token: "shadow-glow", className: "shadow-glow" },
];

const motion = [
  { token: "--duration-fast", value: "150ms" },
  { token: "--duration-base", value: "300ms" },
  { token: "--duration-slow", value: "600ms" },
  { token: "--ease-out", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { token: "--ease-in-out", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { token: "--ease-spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/60 py-12">
      <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.2em] text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
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
            eyebrow="Living Style Guide"
            title="Design System"
            description="Every token and primitive on one page. Tokens live in app/globals.css and are mirrored into tailwind.config.ts — the single source of truth this page renders."
          />
        </div>

        {/* COLORS */}
        <Block title="Color tokens">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {colorTokens.map((c) => (
              <div key={c.name} className="flex flex-col gap-2">
                <div
                  className={`h-20 rounded-lg border border-border ${c.className}`}
                />
                <div className="font-mono text-xs text-muted-foreground">
                  --{c.name}
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* TYPOGRAPHY */}
        <Block title="Type scale">
          <div className="flex flex-col gap-4">
            {typeScale.map((t) => (
              <div
                key={t.token}
                className="flex items-baseline justify-between gap-6 border-b border-border/60 pb-4"
              >
                <span
                  className={`${t.className} truncate font-semibold tracking-tight`}
                >
                  The quick brown fox
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {t.token}
                </span>
              </div>
            ))}
            <p className="font-mono text-sm text-muted-foreground">
              font-mono · 0123456789 · {"=> { } ( ) []"}
            </p>
          </div>
        </Block>

        {/* SPACING */}
        <Block title="Spacing scale">
          <div className="flex flex-col gap-3">
            {spaceScale.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">
                  {s}
                </span>
                <span
                  className="h-3 rounded-sm bg-accent/70"
                  style={{ width: `var(${s})` }}
                />
              </div>
            ))}
          </div>
        </Block>

        {/* RADII + SHADOWS */}
        <Block title="Radii & shadows">
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="flex flex-wrap gap-5">
              {radii.map((r) => (
                <div key={r.token} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-20 border border-border bg-card ${r.className}`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.token}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6">
              {shadows.map((s) => (
                <div key={s.token} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-20 rounded-lg border border-border bg-card ${s.className}`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.token}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Block>

        {/* MOTION */}
        <Block title="Motion">
          <div className="grid gap-2 sm:grid-cols-2">
            {motion.map((m) => (
              <div
                key={m.token}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3"
              >
                <span className="font-mono text-xs text-foreground">
                  {m.token}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </Block>

        {/* BUTTONS */}
        <Block title="Button">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="GitHub">
                <Github />
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </Block>

        {/* BADGES */}
        <Block title="Badge / Tag / Chip">
          <div className="flex flex-wrap gap-2">
            <Badge>default</Badge>
            <Badge variant="accent">accent</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge>Rust</Badge>
            <Badge>Solidity</Badge>
            <Badge>TypeScript</Badge>
          </div>
        </Block>

        {/* CARD + SECTION HEADING */}
        <Block title="Card & SectionHeading">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card interactive>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>
                  Interactive surface with hover-lift and accent glow, built from
                  --card / --border / --shadow tokens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Tag</Badge>
                  <Badge variant="accent">Accent</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <div className="rounded-xl border border-border bg-card p-6">
              <SectionHeading
                eyebrow="Eyebrow"
                title="Section heading"
                description="Eyebrow + display title + description, all from tokens."
              />
            </div>
          </div>
        </Block>

        <Separator className="my-12" />
        <p className="font-mono text-xs text-muted-foreground">
          Primitives: <code>@/components/ui</code> · Tokens:{" "}
          <code>app/globals.css</code> + <code>tailwind.config.ts</code>
        </p>
      </Container>
    </main>
  );
}
