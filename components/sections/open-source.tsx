import {
  ArrowUpRight,
  GitMerge,
  GitPullRequest,
  ShieldCheck,
} from "lucide-react";

import { additionalContributions, contributions } from "@/content/open-source";
import { Badge, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

/** Render `code` spans inside content strings in mono, matching the resume. */
function withInlineCode(text: string) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-muted px-1 py-px font-mono text-[0.82em] text-foreground/90"
      >
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function OpenSource() {
  return (
    <section
      id="open-source"
      aria-labelledby="open-source-title"
      className="relative border-t border-border/60 py-section"
    >
      {/* subtle blueprint backdrop: dot grid fading from the top + soft accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:22px_22px] opacity-40 [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-24 right-[8%] size-72 rounded-full bg-accent/[0.05] blur-3xl" />
      </div>

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Open Source"
            titleId="open-source-title"
            title="Contributions upstream"
            description="Security-minded fixes and features across Ethereum tooling, DeFi cores, blockchain frameworks, and protocol infrastructure: hardening the systems other builders depend on."
          />
        </Reveal>

        <ul className="mt-12 flex flex-col">
          {contributions.map((c, i) => (
            <Reveal key={c.repo} delay={i * 0.05}>
              <li className="group relative grid gap-4 border-t border-border py-7 transition-colors duration-base ease-out last:border-b hover:bg-muted/20 md:grid-cols-[2.75rem_minmax(0,15rem)_1fr] md:gap-6">
                {/* accent rail sweeps in on hover */}
                <span
                  aria-hidden
                  className="absolute -left-px top-0 h-full w-0.5 origin-top scale-y-0 bg-gradient-to-b from-accent via-accent/60 to-transparent transition-transform duration-slow ease-out group-hover:scale-y-100"
                />

                <span
                  aria-hidden
                  className="hidden pt-0.5 font-mono text-xs tracking-widest text-muted-foreground/50 transition-colors duration-base group-hover:text-accent md:block"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col gap-1 pl-4 md:pl-0">
                  <span className="font-medium text-foreground">{c.org}</span>
                  <span className="break-words font-mono text-xs text-muted-foreground">
                    {c.repo}
                  </span>
                  <span className="text-sm text-muted-foreground">{c.area}</span>
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {c.date}
                  </span>
                </div>

                <div className="flex flex-col gap-3 pl-4 md:pl-0">
                  <p className="leading-relaxed text-muted-foreground">
                    {withInlineCode(c.summary)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {c.focus.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/[0.07] px-2.5 py-0.5 font-mono text-xs text-accent"
                      >
                        <ShieldCheck className="size-3" aria-hidden />
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {c.prs.map((pr) => (
                      <a
                        key={pr.href}
                        href={pr.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-xs transition-colors ${
                          pr.merged
                            ? "border-accent/30 bg-accent/10 text-accent hover:border-accent/60"
                            : "border-border bg-muted text-muted-foreground hover:border-accent/40 hover:text-accent"
                        }`}
                      >
                        {pr.merged ? (
                          <GitMerge className="size-3" aria-hidden />
                        ) : (
                          <GitPullRequest className="size-3" aria-hidden />
                        )}
                        {pr.label}
                        {pr.merged ? <span className="sr-only">(merged)</span> : null}
                        <ArrowUpRight className="size-3" aria-hidden />
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.25}>
          <div className="mt-10 rounded-xl border border-border/60 bg-card/40 p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <GitPullRequest className="size-3.5 text-accent" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Additional contributions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {additionalContributions.map((org) => (
                <Badge key={org}>{org}</Badge>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
