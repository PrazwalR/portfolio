import { ArrowUpRight, Github } from "lucide-react";

import { projects } from "@/content/projects";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  SectionHeading,
} from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

export function FeaturedProjects() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Featured Work"
            titleId="work-title"
            title="Projects I've shipped"
            description="Production tooling and protocols across DeFi, infrastructure, and developer experience."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.065}>
              <div
                data-tilt
                data-cursor="link"
                className="group h-full [transform-style:preserve-3d] will-change-transform"
              >
                <Card className="flex h-full flex-col transition-[border-color,box-shadow] duration-base ease-out hover:border-accent/40 hover:shadow-glow">
                <CardHeader>
                  <div className="flex items-baseline justify-between gap-3">
                    <CardTitle className="flex items-center gap-1.5">
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="after:absolute after:inset-0 focus:outline-none"
                      >
                        {project.name}
                      </a>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-accent" />
                    </CardTitle>
                    <span className="font-mono text-xs text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-accent">
                    {project.tagline}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                  <div className="relative z-10 flex flex-wrap items-center gap-4 font-mono text-xs">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Github className="size-3.5" />
                      Repository
                    </a>
                    {project.published ? (
                      <a
                        href={project.published.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
                      >
                        {project.published.label}
                      </a>
                    ) : null}
                  </div>
                </CardFooter>
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
