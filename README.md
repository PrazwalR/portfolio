# Prazwal Ratti — Portfolio

Production Next.js portfolio **and** an extractable design system. Built so a
design pass (Claude Design) can import the tokens + primitives from this repo and
a handoff bundle can be merged back cleanly.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v3.4** + **shadcn/ui**-style primitives
- **Geist** Sans/Mono via `next/font`
- Motion (kept minimal, wired): **framer-motion**, **@react-three/fiber + three**
  (lazy hero stub), **lenis** (smooth scroll), custom cursor

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # production build
pnpm typecheck      # tsc --noEmit
pnpm lint
```

## Design system = single source of truth

This is the most important part of the repo.

| What            | Where                                              |
| --------------- | -------------------------------------------------- |
| **Tokens**      | `app/globals.css` (`:root` CSS custom properties)  |
| **Token mirror**| `tailwind.config.ts` (`theme.extend` → `var(--x)`) |
| **Primitives**  | `components/ui/*` (barrel: `components/ui/index.ts`)|
| **Living guide**| `/design-system` route                             |

Rules:

- Every color/space/radius/shadow/font-size/motion value is a **token** in
  `globals.css`. Nothing is hard-coded in components — they read tokens through
  Tailwind utilities that resolve to `var(--token)`.
- Change a token once and the whole site + style guide updates.

### Re-skin the accent

Swap the `--accent` / `--ring` / `--primary` lines in `app/globals.css` for one
of the documented presets (cool-blue _default_, ice, cyan, steel). Everything —
buttons, links, rings, glows, the 3D hero — follows.

### Design handoff

Keep the merge surface small. A handoff bundle should touch only:

1. the token block in `app/globals.css` (+ the mirror in `tailwind.config.ts`),
2. `components/ui/*`,
3. `app/design-system/page.tsx`.

Sections (`components/sections/*`) and content (`content/*`) consume primitives,
so visual changes flow from the three places above without rewriting sections.

## Structure

```
app/
  layout.tsx              fonts, metadata, providers, skip-link
  page.tsx                one-page composition
  globals.css             ← DESIGN TOKENS (source of truth)
  design-system/page.tsx  living style guide
  blog/page.tsx           placeholder index
components/
  ui/                     token-driven primitives (Button, Card, Badge, …)
  sections/               Hero, FeaturedProjects, OpenSource, Skills, About, Blog, ContactFooter
  three/                  hero-background (lazy) + hero-canvas (R3F stub)
  providers/              lenis-provider, cursor
  motion/                 reveal (scroll animation)
  site-header.tsx
content/                  site, projects, open-source, skills, blog (typed data)
public/resume.pdf
```

## Accessibility & performance

- Mobile-first, fully responsive; semantic landmarks; keyboard-navigable; skip-link.
- `prefers-reduced-motion` honored globally (CSS killswitch) **and** per-feature
  (Lenis, Reveal, cursor, and the 3D hero all disable/freeze).
- 3D is dynamically imported (`ssr:false`) and only mounted after idle, so it
  never blocks first paint.

## Content TODOs

- **SigSafe** (`content/projects.ts`) — add a real description + stack tags.
- **Socials** (`content/site.ts`) — fill LinkedIn / X handles.
- **PR links** (`content/open-source.ts`) — confirm the `verify: true` slugs
  (Circle `arc-node`, Keplr `chainapsis/keplr-wallet`) resolve before publishing.
- `SITE_URL` in `app/layout.tsx` — set to the production domain after deploy.

## Deploy

See the push + Vercel commands in the project handoff, or import the repo at
[vercel.com/new](https://vercel.com/new) (zero-config Next.js).
```
