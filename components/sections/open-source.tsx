import { ArrowUpRight } from "lucide-react";

import { contributions, type ContributionLang } from "@/content/open-source";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

const totalPrs = contributions.flatMap((c) => c.prs).length;
const totalOrgs = contributions.length;

/**
 * Merged-upstream count is asserted directly rather than derived from
 * `pr.merged` on the visible list below: most merged work doesn't get a
 * public link on this page, so filtering the linked-PR array would
 * undercount real merges instead of overcounting them. Update by hand when
 * the true count changes.
 */
const MERGED_UPSTREAM = 5;

const stats = [
  // Rounded down so the label ("20+") never overclaims as new PRs land.
  { value: `${Math.floor(totalPrs / 10) * 10}+`, label: "PRs opened" },
  { value: String(totalOrgs), label: "Organizations" },
  { value: String(MERGED_UPSTREAM), label: "Merged upstream" },
];

// Fixed order so the primary languages the role cares about lead the grid.
const LANG_ORDER: ContributionLang[] = [
  "Rust",
  "Solidity",
  "Go",
  "TypeScript",
  "Python",
  "Java",
];

const groups = LANG_ORDER.map((lang) => ({
  lang,
  items: contributions.filter((c) => c.lang === lang),
})).filter((g) => g.items.length > 0);

export function OpenSource() {
  return (
    <section
      id="open-source"
      aria-labelledby="open-source-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Open Source"
            titleId="open-source-title"
            title="Contributions upstream"
            description="Contributions across compilers, DeFi cores, and protocol tooling: fixing real problems in the systems other builders depend on."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <dl className="mt-12 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 border-l border-border p-6 text-center first:border-l-0 sm:p-7"
              >
                <dd className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
                  {s.value}
                </dd>
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {groups.map((group, gi) => (
            <Reveal key={group.lang} delay={gi * 0.04}>
              <h3 className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-accent">
                {group.lang}
              </h3>
              <ul className="mt-4 flex flex-col gap-5">
                {group.items.map((c) => (
                  <li key={c.repo}>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {c.org}
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        {c.area}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {c.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.prs.map((pr) => (
                        <a
                          key={pr.href}
                          href={pr.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                        >
                          {pr.label}
                          <ArrowUpRight className="size-3" />
                        </a>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
