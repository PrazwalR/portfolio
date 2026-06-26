import { ArrowRight, FileText, Github } from "lucide-react";

import { site } from "@/content/site";
import { Badge, Button, Container } from "@/components/ui";
import { HeroBackground } from "@/components/three/hero-background";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh items-center overflow-hidden pt-16"
    >
      <HeroBackground />
      <Container className="py-section">
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-6">
            {site.location}
          </Badge>
          <h1
            id="hero-title"
            className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {site.name}
          </h1>
          <p className="mt-4 font-mono text-base text-accent sm:text-lg">
            {site.role}
          </p>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            {site.tagline}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#work">
                View work
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileText />
                Résumé
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
