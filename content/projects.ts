/**
 * Featured projects. `stack` entries render as Tag/Chip badges.
 * SigSafe is a placeholder — the CV has no description (see TODO).
 */
export interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  href: string;
  year: string;
  /** optional external badge, e.g. npm / crates.io */
  published?: { label: string; href: string };
}

export const projects: Project[] = [
  {
    name: "SwapKit",
    tagline: "Intent-based liquidity SDK",
    description:
      "One swap(intent) call that abstracts 1inch Fusion+, Uniswap v4 hooks, and Paraswap. Routing engine with MEV-risk simulation, cross-chain execution, and gas optimization. 220+ tests.",
    stack: ["TypeScript", "Rust", "Solidity", "Uniswap v4", "MEV"],
    href: "https://github.com/PrazwalR/SwapKit",
    year: "2026",
    published: {
      label: "npm · @swap-kit/core",
      href: "https://www.npmjs.com/package/@swap-kit/core",
    },
  },
  {
    name: "Apiforge",
    tagline: "Production-grade API release CLI",
    description:
      "Automates the full release pipeline — version bump → Docker → Kubernetes → health checks — with automatic rollback, dry-run, and audit logging. Integrates AWS ECR, Docker Hub, GitHub Releases & Slack.",
    stack: ["Rust", "CLI", "Docker", "Kubernetes", "AWS ECR"],
    href: "https://github.com/PrazwalR/Apiforge",
    year: "2026",
    published: {
      label: "crates.io",
      href: "https://crates.io/",
    },
  },
  {
    name: "Tend",
    tagline: "Autonomous Uniswap v4 LP manager",
    description:
      "Monitors a liquidity position, detects out-of-range drift, and rebalances with no manual intervention. Written in async Rust with on-chain price monitoring and safe, gas-aware transaction handling.",
    stack: ["Rust", "Async", "Uniswap v4", "On-chain"],
    href: "https://github.com/PrazwalR/Tend",
    year: "2026",
  },
  {
    name: "LiqX",
    tagline: "Cross-chain anti-liquidation system",
    description:
      "Autonomous AI agents monitor positions across Ethereum & Solana, prevent liquidations, and rebalance securely. Integrated a MeTTa-powered agent layer for decision-making across 95+ lending protocols.",
    stack: ["TypeScript", "Solidity", "AI Agents", "Cross-chain"],
    href: "https://github.com/PrazwalR/LiqX",
    year: "2025",
  },
  {
    name: "SigSafe",
    // TODO: replace with a real one-line description + accurate stack tags.
    tagline: "Signature safety tooling",
    description:
      "Description coming soon — placeholder card. Add the project summary and stack here.",
    stack: ["TODO"],
    href: "https://github.com/PrazwalR/SigSafe",
    year: "2026",
  },
];
