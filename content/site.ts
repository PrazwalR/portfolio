/**
 * Site-wide content + identity. Editable single source for name, copy, links.
 * (Public-facing contact shows both emails per the owner's choice.)
 */
export const site = {
  name: "Prazwal Ratti",
  role: "Web3 & Backend Developer",
  location: "Chennai, India",

  // Hero
  tagline:
    "I build at the systems layer — decentralized apps, DeFi tooling, and scalable backends in Rust, Solidity & TypeScript.",

  // About
  bio: "Web3 and backend developer focused on the systems layer — building decentralized applications, DeFi tooling, and scalable backend services in Rust, Solidity, and TypeScript. Active open-source contributor to major protocols (rust-lang, Uniswap, Foundry), currently researching how to eliminate liquidations in decentralized lending. Builder-first: constantly shipping, experimenting, and contributing upstream.",

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
    // TODO: fill real handles
    linkedin: "https://www.linkedin.com/in/",
    x: "https://x.com/",
  },
} as const;

/** Anchor nav used by the sticky header. */
export const nav = [
  { label: "Work", href: "#work" },
  { label: "Open Source", href: "#open-source" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
] as const;
