import { ArrowUpRight } from "lucide-react";

import { contributions } from "@/content/open-source";
import { Container, SectionHeading } from "@/components/ui";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/motion/reveal";

export function OpenSource() {
  const stats = [
    {
      value: contributions.reduce((sum, c) => sum + c.prs.length, 0),
      label: "PRs merged",
    },
    { value: contributions.length, label: "Orgs" },
    {
      value: new Set(
        contributions.flatMap((c) =>
          c.prs.map((p) => {
            const m = p.href.match(/github\.com\/([^/]+\/[^/]+)/);
            return m ? m[1] : p.href;
          })
        )
      ).size,
      label: "Repos",
    },
  ];

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
            description="Merged work across compilers, DeFi cores, and protocol tooling, fixing real problems in the systems other builders depend on."
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
                  <Counter to={s.value} />
                </dd>
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="mt-8 flex flex-col">
          {contributions
            .filter((c) => c.featured)
            .map((c, i) => (
            <Reveal key={c.repo} delay={i * 0.03}>
              <li className="group grid gap-4 border-t border-border py-6 last:border-b md:grid-cols-[minmax(0,16rem)_1fr]">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {c.repo}
                  </span>
                  <span className="text-sm text-muted-foreground">{c.area}</span>
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {c.date}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-balance leading-relaxed text-muted-foreground">
                    {c.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.prs.map((pr) => (
                      <a
                        key={pr.href}
                        href={pr.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {pr.label}
                        <ArrowUpRight className="size-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
