import { site, SITE_URL } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { OpenSource } from "@/components/sections/open-source";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { About } from "@/components/sections/about";
import { Blog } from "@/components/sections/blog";
import { ContactFooter } from "@/components/sections/contact-footer";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: SITE_URL,
  sameAs: [site.socials.github, site.socials.x].filter(Boolean),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <SiteHeader />
      <main id="main">
        <Hero />
        <FeaturedProjects />
        <OpenSource />
        <Experience />
        <Skills />
        <About />
        <Blog />
      </main>
      <ContactFooter />
    </>
  );
}
