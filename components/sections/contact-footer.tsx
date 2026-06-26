import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

import { site } from "@/content/site";
import { Button, Container, SectionHeading, Separator } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

export function ContactFooter() {
  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="border-t border-border/60 py-section"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            titleId="contact-title"
            title="Let's build something."
            description="Open to roles, collaborations, and interesting problems at the systems layer. The fastest way to reach me is email."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${site.email.primary}`}>
                <Mail />
                {site.email.primary}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
                <Github />
                GitHub
              </a>
            </Button>
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

        <Separator className="my-12" />

        <div className="flex flex-col items-start justify-between gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. Built with Next.js &amp;
            Tailwind.
          </p>
          <a
            href="/design-system"
            className="inline-flex items-center gap-1 font-mono text-xs transition-colors hover:text-accent"
          >
            Design system
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
