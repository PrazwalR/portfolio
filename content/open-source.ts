/**
 * Open-source contributions. Each entry links to its PR(s).
 * NOTE: repo slugs marked with `verify: true` are best-guesses — confirm the
 * URLs resolve before publishing (Circle arc-node, Keplr wallet).
 */
export interface Pr {
  label: string;
  href: string;
}

export interface Contribution {
  org: string;
  repo: string;
  area: string;
  date: string;
  summary: string;
  prs: Pr[];
  verify?: boolean;
  /** show in the curated on-page highlights list (stats still count all) */
  featured?: boolean;
}

export const contributions: Contribution[] = [
  {
    org: "rust-lang",
    repo: "rust-lang/rust",
    featured: true,
    area: "Compiler / trait solver",
    date: "Jun 2026",
    summary:
      "Fix detecting cyclic subtypes during generalization in the next-generation trait solver.",
    prs: [
      { label: "#157786", href: "https://github.com/rust-lang/rust/pull/157786" },
    ],
  },
  {
    org: "Uniswap",
    repo: "Uniswap/v4-core",
    featured: true,
    area: "DeFi core pool accounting",
    date: "Mar 2026",
    summary:
      "Added fee-growth direction assertions to the core pool-accounting tests.",
    prs: [
      { label: "#1017", href: "https://github.com/Uniswap/v4-core/pull/1017" },
    ],
  },
  {
    org: "Foundry",
    repo: "foundry-rs/foundry",
    featured: true,
    area: "Ethereum tooling (Rust)",
    date: "Jun 2026",
    summary:
      "Added support for running `forge verify-bytecode` without a block explorer.",
    prs: [
      { label: "#15142", href: "https://github.com/foundry-rs/foundry/pull/15142" },
    ],
  },
  {
    org: "Aptos",
    repo: "aptos-labs/aptos-core",
    featured: true,
    area: "Move VM (Rust)",
    date: "Jun 2026",
    summary:
      "Validation of Move Identifier during deserialization for safer module loading.",
    prs: [
      { label: "#20056", href: "https://github.com/aptos-labs/aptos-core/pull/20056" },
    ],
  },
  {
    org: "Circle",
    repo: "circlefin/arc-node · evm-cctp-contracts",
    area: "Node robustness & CCTP",
    date: "Jun 2026",
    summary:
      "Hardened node robustness (streaming-overflow DoS, spammer panics, metrics accuracy); added ITokenMessenger interfaces and minFee fuzz invariants to the Cross-Chain Transfer Protocol.",
    prs: [
      { label: "arc-node #161", href: "https://github.com/circlefin/arc-node/pull/161" },
      { label: "cctp #108", href: "https://github.com/circlefin/evm-cctp-contracts/pull/108" },
      { label: "cctp #109", href: "https://github.com/circlefin/evm-cctp-contracts/pull/109" },
    ],
    verify: true,
  },
  {
    org: "Oasis",
    repo: "oasisprotocol/oasis-sdk",
    area: "Confidential compute SDK",
    date: "2026",
    summary: "Contribution to the Oasis SDK.",
    prs: [
      { label: "#2479", href: "https://github.com/oasisprotocol/oasis-sdk/pull/2479" },
    ],
  },
  {
    org: "Keplr",
    repo: "chainapsis/keplr-wallet",
    area: "Cosmos wallet",
    date: "2026",
    summary: "Contributions to the Keplr wallet.",
    prs: [
      { label: "#1964", href: "https://github.com/chainapsis/keplr-wallet/pull/1964" },
      { label: "#1965", href: "https://github.com/chainapsis/keplr-wallet/pull/1965" },
    ],
    verify: true,
  },
  {
    org: "Stellar",
    repo: "stellar/freighter",
    area: "Stellar wallet extension",
    date: "2026",
    summary: "Contribution to the Stellar Freighter wallet.",
    prs: [
      { label: "#2856", href: "https://github.com/stellar/freighter/pull/2856" },
    ],
  },
];
