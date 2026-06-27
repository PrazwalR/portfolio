import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { OpenSource } from "@/components/sections/open-source";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { About } from "@/components/sections/about";
import { ContactFooter } from "@/components/sections/contact-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <FeaturedProjects />
        <OpenSource />
        <Experience />
        <Skills />
        <About />
      </main>
      <ContactFooter />
    </>
  );
}
