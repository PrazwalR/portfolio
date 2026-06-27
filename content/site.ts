/**
 * Site-wide content + identity. Editable single source for name, copy, links.
 * (Public-facing contact shows both emails per the owner's choice.)
 */
export const site = {
  name: "Prazwal Ratti",
  role: "Web3 & Backend Engineer",
  location: "Chennai, India",

  // Hero
  tagline:
    "I build at the systems layer: decentralized protocols, DeFi infrastructure, and the backends that keep them honest. Language-agnostic by habit; I reach for whatever the problem actually calls for.",

  // About
  bio: "Engineer working close to the systems layer: decentralized protocols, DeFi infrastructure, and the backend services that hold them up. I care more about how a system behaves under load and adversaries than which language it happens to be written in, and I pick up new stacks as the work demands. Active open-source contributor across the ecosystem, from low-level language tooling to core DeFi protocols, and currently researching how to remove liquidations from decentralized lending entirely.",

  education: {
    school: "Vellore Institute of Technology (VIT), Chennai",
    degree: "B.Tech, Computer Science (Core)",
    detail: "CGPA 8.10 / 10",
    period: "2023 – 2027",
  },

  resumeUrl: "/resume.pdf",

  email: {
    primary: "prazwalr07@gmail.com",
    secondary: "ratti.prazwal2023@vitstudent.ac.in",
  },
  phone: "+91 93925 85884",

  socials: {
    github: "https://github.com/PrazwalR",
    x: "https://x.com/RattiPrazwal",
    // TODO: real LinkedIn handle (currently a dead link — hidden in the footer
    // until set; see contact-footer.tsx).
    linkedin: "",
  },
} as const;

/** Anchor nav used by the sticky header. */
export const nav = [
  { label: "Work", href: "#work" },
  { label: "Open Source", href: "#open-source" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
