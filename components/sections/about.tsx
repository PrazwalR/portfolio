import { GraduationCap, MapPin, Telescope } from "lucide-react";

import { site } from "@/content/site";
import {
  Card,
  CardContent,
  Container,
  SectionHeading,
} from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

export function About() {
  const { education } = site;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,22rem)]">
          <Reveal>
            <SectionHeading
              index="05"
            eyebrow="About"
              titleId="about-title"
              title="Builder at the systems layer"
              description={site.bio}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <Card spotlight className="h-full">
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  <GraduationCap className="size-4 text-accent" />
                  Education
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">
                    {education.school}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {education.degree}
                  </p>
                  <div className="mt-2 font-mono text-xs text-muted-foreground/80">
                    <span>{education.period}</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-4 border-t border-border/70 pt-5">
                  <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    <Telescope className="size-4 text-accent" />
                    Now
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {site.now}
                  </p>
                  <p className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/80">
                    <MapPin className="size-3.5" aria-hidden />
                    {site.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
