import { additionalContributions, contributions } from "@/content/open-source";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Thin ticker under the hero listing every org from the Open Source section.
 * The list renders twice and slides by half its width for a seamless loop;
 * hovering pauses it. Under reduced motion the duplicate is hidden and the
 * names simply wrap.
 */
export function UpstreamMarquee() {
  const orgs = [...contributions.map((c) => c.org), ...additionalContributions];

  return (
    <section
      aria-label="Open-source projects contributed to"
      className="border-t border-border/60 bg-card/30 py-5"
    >
      <Container className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <a
          href="#open-source"
          data-cursor="link"
          className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
        >
          <span aria-hidden className="text-accent">
            {"//"}
          </span>{" "}
          Contributed upstream to
        </a>
        <div className="marquee-pause relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:[mask-image:none]">
          <ul className="flex w-max animate-marquee motion-reduce:w-auto motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:gap-y-2">
            {[...orgs, ...orgs].map((org, i) => (
              <li
                key={`${org}-${i}`}
                aria-hidden={i >= orgs.length ? true : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-7 pr-7 font-mono text-sm text-muted-foreground",
                  i >= orgs.length && "motion-reduce:hidden"
                )}
              >
                <span className="transition-colors duration-fast hover:text-foreground">
                  {org}
                </span>
                <span aria-hidden className="text-[0.6rem] text-accent/60">
                  ◆
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
