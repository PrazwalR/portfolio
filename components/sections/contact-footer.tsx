import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

import { site } from "@/content/site";
import { Button, Container, SectionHeading } from "@/components/ui";
import { CopyButton } from "@/components/ui/copy-button";
import { XLogo } from "@/components/ui/x-logo";
import { Reveal } from "@/components/motion/reveal";

export function ContactFooter() {
  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-border/60 pt-section"
    >
      {/* accent glow pooled behind the call to action */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <Container>
        <Reveal>
          <SectionHeading
            index="07"
            eyebrow="Contact"
            titleId="contact-title"
            title="Let's build something."
            description="Open to roles, collaborations, and interesting problems at the systems layer. The fastest way to reach me is email."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a
                href={`mailto:${site.email.primary}`}
                data-magnetic
                data-btn
                data-cursor="link"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Mail />
                  {site.email.primary}
                </span>
              </a>
            </Button>
            <CopyButton value={site.email.primary} label="email address" />
            <Button asChild size="lg" variant="outline">
              <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
                <Github />
                GitHub
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={site.socials.x} target="_blank" rel="noopener noreferrer">
                <XLogo />X
              </a>
            </Button>
            {site.socials.linkedin ? (
              <Button asChild size="lg" variant="ghost">
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin />
                  LinkedIn
                </a>
              </Button>
            ) : null}
          </div>

          <p className="mt-6 font-mono text-sm text-muted-foreground">
            Also:{" "}
            <a
              href={`mailto:${site.email.secondary}`}
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {site.email.secondary}
            </a>
          </p>
        </Reveal>

        <div className="mt-20 flex flex-col-reverse gap-3 border-t border-border/60 pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name} · {site.location}
          </span>
          <a
            href="#top"
            data-cursor="link"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-base ease-out group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Container>

      {/* oversized wordmark that dissolves into the bottom edge of the page */}
      <div aria-hidden className="pointer-events-none mt-8 select-none overflow-hidden">
        <p className="whitespace-nowrap bg-gradient-to-b from-foreground/[0.11] via-foreground/[0.04] to-transparent bg-clip-text pb-[0.04em] text-center text-[clamp(3.5rem,17vw,17rem)] font-semibold leading-[0.82] tracking-tighter text-transparent">
          {site.name}
        </p>
      </div>
    </footer>
  );
}
