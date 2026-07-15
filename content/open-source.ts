/**
 * Open-source contributions. Each entry links to its PR(s).
 *
 * `merged` lives on the individual PR (not the contribution) since a given org
 * entry can mix merged and still-open PRs — informational per-PR metadata,
 * checked against the GitHub API. The "PRs opened" and "Organizations" stats
 * in the section component derive from this array's length; "Merged upstream"
 * does NOT (see MERGED_UPSTREAM there) since most of the user's real merged
 * work doesn't have a public link on this page — summing `merged` here would
 * undercount, not overcount.
 *
 * `lang` is the primary language/stack of the *contribution itself* (verified
 * against each repo's actual language where possible), used purely to group
 * the list into scannable buckets — it is not a claim about the whole repo.
 *
 * NOTE: `verify: true` entries need a final check before being fully trusted —
 * Convex's repo/PR number couldn't be resolved via the GitHub API (get-convex
 * org has no matching issue/PR #596 in convex-backend); confirm the exact
 * repo + link before relying on it.
 */
export interface Pr {
  label: string;
  href: string;
  merged?: boolean;
}

export type ContributionLang =
  | "Rust"
  | "Go"
  | "Solidity"
  | "TypeScript"
  | "Python"
  | "Java";

export interface Contribution {
  org: string;
  repo: string;
  lang: ContributionLang;
  area: string;
  date: string;
  summary: string;
  prs: Pr[];
  verify?: boolean;
}

export const contributions: Contribution[] = [
  {
    org: "rust-lang",
    repo: "rust-lang/rust",
    lang: "Rust",
    area: "Compiler / trait solver",
    date: "2026",
    summary:
      "Fix detecting cyclic subtypes during generalization in the next-generation trait solver.",
    prs: [
      { label: "#157786", href: "https://github.com/rust-lang/rust/pull/157786" },
    ],
  },
  {
    org: "Foundry",
    repo: "foundry-rs/foundry",
    lang: "Rust",
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
    org: "Convex",
    repo: "get-convex/convex-backend",
    lang: "Rust",
    area: "Backend platform",
    date: "2026",
    summary:
      "Hardened the Postgres wire-protocol decoder against malformed messages.",
    prs: [
      {
        label: "#596",
        href: "https://github.com/get-convex/convex-backend/pull/596",
      },
    ],
    verify: true,
  },
  {
    org: "Optimism",
    repo: "ethereum-optimism/optimism",
    lang: "Rust",
    area: "op-reth (L2 execution client)",
    date: "2026",
    summary: "Reserve the Isthmus operator fee in the op-reth tx-pool balance check.",
    prs: [
      {
        label: "#21718",
        href: "https://github.com/ethereum-optimism/optimism/pull/21718",
      },
    ],
  },
  {
    org: "Cosmos SDK",
    repo: "cosmos/cosmos-sdk",
    lang: "Go",
    area: "BaseApp / state pruning",
    date: "2026",
    summary: "Prune stale commit-info metadata and make BaseApp.Close idempotent.",
    prs: [
      { label: "#26561", href: "https://github.com/cosmos/cosmos-sdk/pull/26561" },
      { label: "#26562", href: "https://github.com/cosmos/cosmos-sdk/pull/26562" },
    ],
  },
  {
    org: "Compound",
    repo: "compound-finance/compound-protocol",
    lang: "Solidity",
    area: "Interest-rate model",
    date: "2026",
    summary: "Interest-rate model assumed 12s blocks; fixed for post-Merge block times.",
    prs: [
      {
        label: "#310",
        href: "https://github.com/compound-finance/compound-protocol/pull/310",
      },
    ],
  },
  {
    org: "Hyperliquid",
    repo: "hyperliquid-dex/hyperliquid-rust-sdk",
    lang: "Rust",
    area: "Rust SDK",
    date: "2026",
    summary: "Preserve sign in truncate_float for negative values (silently became 0.0).",
    prs: [
      {
        label: "#194",
        href: "https://github.com/hyperliquid-dex/hyperliquid-rust-sdk/pull/194",
      },
    ],
  },
  {
    org: "Circle",
    repo: "circlefin/arc-node · evm-cctp-contracts",
    lang: "Rust",
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
  {
    org: "Uniswap",
    repo: "Uniswap/v4-core",
    lang: "Solidity",
    area: "DeFi core pool accounting",
    date: "2026",
    summary: "Added fee-growth direction assertions to the core pool-accounting tests.",
    prs: [
      { label: "#1017", href: "https://github.com/Uniswap/v4-core/pull/1017" },
    ],
  },
  {
    org: "Aptos",
    repo: "aptos-labs/aptos-core",
    lang: "Rust",
    area: "Move VM",
    date: "2026",
    summary: "Validation of Move Identifier during deserialization for safer module loading.",
    prs: [
      { label: "#20056", href: "https://github.com/aptos-labs/aptos-core/pull/20056" },
    ],
  },
  {
    org: "Fetch.ai",
    repo: "fetchai/uAgents",
    lang: "Python",
    area: "Agent framework",
    date: "2026",
    summary: "Fixed a sync-query future leak (and cross-talk) in the ASGI server.",
    prs: [
      { label: "#910", href: "https://github.com/fetchai/uAgents/pull/910" },
    ],
  },
  {
    org: "Noir",
    repo: "noir-lang/noir",
    lang: "Rust",
    area: "ACVM",
    date: "2026",
    summary: "Reject out-of-range Keccakf1600 lanes instead of panicking.",
    prs: [
      { label: "#13262", href: "https://github.com/noir-lang/noir/pull/13262" },
    ],
  },
  {
    org: "Oasis",
    repo: "oasisprotocol/oasis-sdk",
    lang: "Rust",
    area: "rofl-scheduler",
    date: "2026",
    summary: "Fixed rofl-scheduler domain verification (was deriving an empty token).",
    prs: [
      { label: "#2479", href: "https://github.com/oasisprotocol/oasis-sdk/pull/2479" },
    ],
  },
  {
    org: "Stellar",
    repo: "stellar/freighter",
    lang: "TypeScript",
    area: "Freighter wallet",
    date: "2026",
    summary: "Fixed muxed-address transactions mislabeled as sent.",
    prs: [
      { label: "#2856", href: "https://github.com/stellar/freighter/pull/2856" },
    ],
  },
  {
    org: "Keplr",
    repo: "chainapsis/keplr-wallet",
    lang: "TypeScript",
    area: "Wallet extension",
    date: "2026",
    summary:
      "Ledger transport fix on app-open reconnect, and a crash guard when a query base URL is invalid.",
    prs: [
      { label: "#1964", href: "https://github.com/chainapsis/keplr-wallet/pull/1964" },
      { label: "#1965", href: "https://github.com/chainapsis/keplr-wallet/pull/1965" },
    ],
  },
  {
    org: "RSK",
    repo: "rsksmart/rskj",
    lang: "Java",
    area: "Node networking",
    date: "2026",
    summary: "Test coverage for IpUtils invalid-port edge cases and non-fatal list parsing.",
    prs: [
      { label: "#3623", href: "https://github.com/rsksmart/rskj/pull/3623" },
    ],
  },
  {
    org: "Citrea",
    repo: "chainwayxyz/citrea",
    lang: "Rust",
    area: "Bitcoin DA layer",
    date: "2026",
    summary: "Hardened coinbase parsing in the short-header proof and verifier against panics.",
    prs: [
      { label: "#3304", href: "https://github.com/chainwayxyz/citrea/pull/3304" },
    ],
  },
];
