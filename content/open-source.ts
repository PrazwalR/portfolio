/**
 * Open-source contributions — top 5 by name recognition, not the full list.
 * Each entry links to its PR(s); `merged` is checked against the GitHub API
 * (only foundry-rs/foundry #15142 is currently confirmed merged).
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
  prs: Pr[];
}

export const contributions: Contribution[] = [
  {
    org: "rust-lang",
    repo: "rust-lang/rust",
    area: "Compiler / trait solver",
    date: "2026",
    summary:
      "Fix detecting cyclic subtypes during generalization in the next-generation trait solver.",
    prs: [
      { label: "#157786", href: "https://github.com/rust-lang/rust/pull/157786" },
    ],
  },
  {
    org: "Uniswap",
    repo: "Uniswap/v4-core",
    area: "DeFi core pool accounting",
    date: "2026",
    summary: "Added fee-growth direction assertions to the core pool-accounting tests.",
    prs: [
      { label: "#1017", href: "https://github.com/Uniswap/v4-core/pull/1017" },
    ],
  },
  {
    org: "Foundry",
    repo: "foundry-rs/foundry",
    area: "Ethereum tooling",
    date: "2026",
    summary:
      "Added support for running `forge verify-bytecode` without a block explorer.",
    prs: [
      {
        label: "#15142",
        href: "https://github.com/foundry-rs/foundry/pull/15142",
        merged: true,
      },
    ],
  },
  {
    org: "Aptos",
    repo: "aptos-labs/aptos-core",
    area: "Move VM",
    date: "2026",
    summary: "Validation of Move Identifier during deserialization for safer module loading.",
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
      "Node DoS hardening on arc-node; added ITokenMessenger interfaces and minFee fuzz invariants to the Cross-Chain Transfer Protocol contracts.",
    prs: [
      { label: "arc-node #161", href: "https://github.com/circlefin/arc-node/pull/161" },
      { label: "cctp #108", href: "https://github.com/circlefin/evm-cctp-contracts/pull/108" },
      { label: "cctp #109", href: "https://github.com/circlefin/evm-cctp-contracts/pull/109" },
    ],
  },
];
