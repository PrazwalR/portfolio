/**
 * Experience / achievements: hackathons, wins, speaking.
 * Images live in /public/achievements (drop the photo files there; the
 * EventImage component shows a placeholder until a file exists).
 */
export interface Achievement {
  title: string;
  kind: "Hackathon" | "Speaking" | "Award";
  event: string;
  location?: string;
  date: string;
  blurb: string;
  highlights?: string[];
  tags?: string[];
  /** first image is the card hero; the rest render as a thumbnail row */
  images: string[];
  /** CSS object-position for the hero crop, e.g. "75% center" when the subject sits off-center */
  imagePosition?: string;
  href?: string;
}

export const achievements: Achievement[] = [
  {
    title: "Assay Graduated UHI10 with a $1,500 Developer Grant",
    kind: "Award",
    event: "Uniswap Hookathon Incubator (UHI10) · Atrium Academy",
    date: "Sep 2026",
    blurb:
      "Assay, a Uniswap v4 hook that prices adverse selection per swap instead of per pool, graduated Atrium Academy's Uniswap Hookathon Incubator (UHI10) with a $1,500 Developer Grant. Demo day was live: the hook has now priced 29 real swaps on Base Sepolia, from 1.00 to 98.10 basis points, same pool and same reference, priced entirely by which direction you trade.",
    highlights: [
      "201 tests, 100% line coverage, deployed bytecode verified byte-identical to source.",
      "Still unaudited, testnet only — the adverse-selection gate still doesn't pass, and I said so on stage. The grant isn't for having solved DeFi's oldest pricing problem, it's for building something real enough to be honest about.",
      "Live app: assay.prazwal.xyz · Code: github.com/PrazwalR/Assay",
    ],
    tags: ["Uniswap v4", "Solidity", "DeFi", "Oracles", "Atrium Academy"],
    images: ["/achievements/uhi10-assay.jpg"],
    href: "https://www.youtube.com/live/t63rAO-5fdY",
  },
  {
    title: "Workshop Speaker",
    kind: "Speaking",
    event: "GDG on Campus VIT Chennai",
    location: "Chennai",
    date: "Sep 9, 2025",
    blurb:
      "Spoke at VIT Chennai's inaugural Blockchain Workshop for GDG on Campus, with 400+ registrations from students across multiple colleges. Designed it to go beyond theory: every participant left with something they had actually built on-chain.",
    highlights: [
      "400+ registrations from students across multiple colleges.",
      "Live MetaMask setup and a real Sepolia testnet transaction, verified on Etherscan.",
      "Deployed a smart contract live in Remix and called it on-chain during the session.",
      "Hands-on format: zero to working on-chain deploy in a single workshop.",
    ],
    tags: [
      "Public Speaking",
      "Ethereum",
      "Solidity",
      "Remix",
      "MetaMask",
      "GDG",
    ],
    images: ["/achievements/workshop-speaker.jpg"],
  },
  {
    title: "1st Place + 2 Inco Track Bounties at DEFY'26",
    kind: "Hackathon",
    event: "DEFY'26",
    date: "2026",
    blurb:
      "Built Azoth DAO, a privacy-first, agentic DAO powered by Inco & Nillion. Most DAOs default to radical transparency, which invites whale signaling, vote tracing, coercion, and bribery; Azoth removes those incentives entirely. Team: Naveen V, Vishal Prabhu, Kunal Singh Dadhwal, Frank Xavio.",
    highlights: [
      "Confidential governance on Inco: encrypted token balances & transfers, hidden proposal amounts, near-zero-signature UX via session-key delegation, and decryption + sensitive execution inside a TEE.",
      "Agentic intelligence on Nillion: proposal analysis with nilAI, blindfold-encrypted sharded metadata via nilDB, and agents built with ERC-8004 + x402 pay-per-inference access.",
      "Bonus build: a fully confidential UNO on Inco's Lightning SDK, with encrypted hands, cryptographically shuffled deck, and verifiable final state.",
    ],
    tags: [
      "Inco",
      "Nillion",
      "TEE",
      "ERC-8004",
      "x402",
      "Solidity",
      "Confidential Computing",
    ],
    images: ["/achievements/defy-2026.jpg"],
    imagePosition: "78% center",
  },
  {
    title: "DataChain at ETHGlobal New Delhi",
    kind: "Hackathon",
    event: "ETHGlobal New Delhi",
    date: "2025",
    blurb:
      "Built DataChain, an AI dataset marketplace that makes data sharing verifiable and privacy-preserving on Ethereum. Combined Filecoin and World ID under extreme time pressure and actually shipped it.",
    highlights: [
      "World ID: proved human ownership of datasets without exposing identity.",
      "zkTLS proofs: cryptographically hid transaction details from third parties.",
      "Verifiable NFTs: gave real on-chain ownership to datasets, no 'trust me, bro' deals.",
      "Filecoin integration for decentralized, censorship-resistant dataset storage.",
    ],
    tags: ["World ID", "zkTLS", "Filecoin", "NFT", "Ethereum", "Privacy"],
    images: ["/achievements/ethglobal-delhi.jpg"],
    href: "https://ethglobal.com/showcase/datachain-ai-ed1wn",
  },
];
