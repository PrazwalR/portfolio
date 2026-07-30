import { Boxes, Code2, Server, Wrench } from "lucide-react";

import { skills } from "@/content/skills";
import { Badge, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

/** Accent glyph per skill group; falls back to Code2 for any unmapped label. */
const groupIcon: Record<string, typeof Code2> = {
  Languages: Code2,
  "Blockchain / Web3": Boxes,
  Backend: Server,
  "DevOps & Tools": Wrench,
};

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Toolbox"
            titleId="skills-title"
            title="Skills & technologies"
          />
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {skills.map((group, i) => {
            const Icon = groupIcon[group.label] ?? Code2;
            return (
              <Reveal
                key={group.label}
                delay={i * 0.04}
                className="group bg-card"
              >
                <div className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2.5 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      <span className="inline-flex size-7 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent transition-colors duration-base ease-out group-hover:border-accent/50">
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      {group.label}
                    </h3>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground/50">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="transition-colors duration-fast ease-out hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
