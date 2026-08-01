/**
 * Open-source contributions — top 5 mirroring the resume, plus an
 * "additional contributions" org list. Each entry links to its PR(s);
 * `merged` is checked against the GitHub API (only foundry-rs/foundry
 * #15142 is currently confirmed merged).
 */
export interface Pr {
  label: string;
  href: string;
  merged?: boolean;
}

export interface Contribution {
  org: string;
  repo: string;
  area: string;
  date: string;
  summary: string;
  /** security-engineering focus chips rendered beside the summary */
  focus: string[];
  prs: Pr[];
}

export const contributions: Contribution[] = [
  {
    org: "Foundry",
    repo: "foundry-rs/foundry",
    area: "Ethereum tooling · Rust",
    date: "2026",
    summary:
      "Enabled `forge verify-bytecode` to run without a block explorer, so deployed bytecode can be verified against source in trust-minimized setups.",
    focus: ["Bytecode verification", "Supply-chain trust"],
    prs: [
      {
        label: "#15142",
        href: "https://github.com/foundry-rs/foundry/pull/15142",
        merged: true,
      },
    ],
  },
  {
    org: "Convex",
    repo: "Convex-Dev/convex",
    area: "Decentralised platform · Java",
    date: "2026",
    summary:
      "Hardened the Postgres wire-protocol decoder against malformed pre-auth frames, closing crash paths triggered by untrusted network input.",
    focus: ["Input validation", "Protocol hardening"],
    prs: [
      {
        label: "#596",
        href: "https://github.com/Convex-Dev/convex/pull/596",
      },
    ],
  },
  {
    org: "Oasis",
    repo: "oasisprotocol/oasis-sdk",
    area: "Confidential runtime · Rust",
    date: "2026",
    summary:
      "Fixed the ROFL scheduler's `domain_verification_token` finalizing into an empty digest — identical tokens across domains — closing a cross-tenant custom-domain takeover and TLS MITM vector.",
    focus: ["Domain verification", "MITM prevention"],
    prs: [
      {
        label: "#2479",
        href: "https://github.com/oasisprotocol/oasis-sdk/pull/2479",
      },
    ],
  },
  {
    org: "Aptos",
    repo: "aptos-labs/aptos-core",
    area: "Move VM · Rust",
    date: "2026",
    summary:
      "Validated Move `Identifier` during deserialization for safer module loading — malformed identifiers are rejected before they reach the VM.",
    focus: ["Deserialization safety", "VM security"],
    prs: [
      { label: "#20056", href: "https://github.com/aptos-labs/aptos-core/pull/20056" },
    ],
  },
  {
    org: "Circle",
    repo: "circlefin/arc-node · evm-cctp-contracts",
    area: "Node robustness & CCTP",
    date: "2026",
    summary:
      "Hardened node robustness against streaming-overflow DoS, spammer panics, and metrics drift; added ITokenMessenger interfaces and minFee fuzz invariants to the Cross-Chain Transfer Protocol contracts.",
    focus: ["DoS hardening", "Fuzz invariants"],
    prs: [
      { label: "arc-node #161", href: "https://github.com/circlefin/arc-node/pull/161" },
      { label: "cctp #108", href: "https://github.com/circlefin/evm-cctp-contracts/pull/108" },
      { label: "cctp #109", href: "https://github.com/circlefin/evm-cctp-contracts/pull/109" },
    ],
  },
];

/** Orgs with further merged/open contributions, listed as a compact strip. */
export const additionalContributions: string[] = [
  "Optimism",
  "Compound",
  "Hyperliquid",
  "rust-lang/rust",
  "Uniswap v4",
  "Noir",
  "Cosmos",
  "Fetch.ai",
  "Stellar",
  "Keplr",
];
