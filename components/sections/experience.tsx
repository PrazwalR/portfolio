import { ArrowUpRight, Mic, Sparkles, Trophy } from "lucide-react";

import { achievements } from "@/content/achievements";
import { Badge, Card, Container, SectionHeading } from "@/components/ui";
import { EventImage } from "@/components/ui/event-image";
import { Reveal } from "@/components/motion/reveal";

const kindIcon = { Hackathon: Trophy, Speaking: Mic, Award: Sparkles } as const;

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            titleId="experience-title"
            title="Hackathons & speaking"
            description="Wins, builds, and stage time from the Web3 trenches."
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-6">
          {achievements.map((a, i) => {
            const Icon = kindIcon[a.kind] ?? Sparkles;
            return (
              <Reveal key={a.title} delay={i * 0.065}>
                <Card
                  interactive
                  className="grid overflow-hidden md:grid-cols-[minmax(0,22rem)_1fr]"
                >
                  <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-[16rem]">
                    <EventImage
                      src={a.images[0]}
                      alt={a.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-3 p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant="accent"
                        className="inline-flex items-center gap-1.5"
                      >
                        <Icon className="size-3" />
                        {a.kind}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {a.event} · {a.date}
                        {a.location ? ` · ${a.location}` : ""}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight">
                      {a.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {a.blurb}
                    </p>

                    {a.highlights && a.highlights.length > 0 ? (
                      <ul className="flex flex-col gap-1.5">
                        {a.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {a.images.length > 1 ? (
                      <div className="flex flex-wrap gap-2">
                        {a.images.slice(1).map((src) => (
                          <EventImage
                            key={src}
                            src={src}
                            alt={a.title}
                            className="h-14 w-20 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    ) : null}

                    {a.tags && a.tags.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {a.tags.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                    ) : null}

                    {a.href ? (
                      <a
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
                      >
                        View post
                        <ArrowUpRight className="size-3" />
                      </a>
                    ) : null}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
