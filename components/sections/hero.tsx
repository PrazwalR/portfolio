import { ArrowRight, FileText, Github, Linkedin } from "lucide-react";

import { site } from "@/content/site";
import { Button, Container } from "@/components/ui";
import { XLogo } from "@/components/ui/x-logo";
import { HeroBackground } from "@/components/hero/hero-background";
import { AnimatedName } from "@/components/hero/animated-name";
import { SpeakerPortrait } from "@/components/hero/speaker-portrait";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh items-center overflow-hidden pt-16"
    >
      <HeroBackground />
      <Container className="py-section">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="order-2 max-w-2xl lg:order-1">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 py-1 pl-2.5 pr-3.5 font-mono text-xs text-muted-foreground backdrop-blur-sm">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-foreground/90">{site.status}</span>
            <span aria-hidden className="text-border">/</span>
            {site.location}
          </div>
          <h1
            id="hero-title"
            className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <AnimatedName text={site.name} />
          </h1>
          <p className="mt-4 font-mono text-base text-accent sm:text-lg">
            {site.role}
          </p>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            {site.tagline}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#work" data-magnetic data-btn data-cursor="link">
                <span className="relative z-10 inline-flex items-center gap-2">
                  View work
                  <ArrowRight />
                </span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                data-btn
                data-cursor="link"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <FileText />
                  Résumé
                </span>
              </a>
            </Button>
            <div className="flex items-center gap-1 sm:ml-1">
              <Button asChild size="icon" variant="ghost" className="size-12 [&_svg]:size-5">
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  data-cursor="link"
                >
                  <Github />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="size-12 [&_svg]:size-5">
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  data-cursor="link"
                >
                  <Linkedin />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="size-12">
                <a
                  href={site.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  title="X"
                  data-cursor="link"
                >
                  <XLogo />
                </a>
              </Button>
            </div>
          </div>
          </div>
          <SpeakerPortrait className="order-1 lg:order-2" />
        </div>
      </Container>
    </section>
  );
}
