import { skills } from "@/content/skills";
import { Badge, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

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
          {skills.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.04} className="bg-card">
              <div className="flex h-full flex-col gap-4 p-6">
                <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
