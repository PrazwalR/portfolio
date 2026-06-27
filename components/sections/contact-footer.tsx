import { Github, Linkedin, Mail } from "lucide-react";

import { site } from "@/content/site";
import { Button, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

/** X (formerly Twitter) brand glyph — lucide ships no official mark. */
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
      </Container>
    </footer>
  );
}
