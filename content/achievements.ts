/**
 * Experience / achievements — hackathons, wins, speaking.
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
  href?: string;
}

export const achievements: Achievement[] = [
  {
    title: "1st Place + 2 Inco Track Bounties — DEFY'26",
    kind: "Hackathon",
    event: "DEFY'26",
    date: "2026",
    blurb:
      "Built Azoth DAO — a privacy-first, agentic DAO powered by Inco & Nillion. Most DAOs default to radical transparency, which invites whale signaling, vote tracing, coercion, and bribery; Azoth removes those incentives entirely. Team: Naveen V, Vishal Prabhu, Prazwal Ratti, Frank Xavio.",
    highlights: [
      "Confidential governance on Inco: encrypted token balances & transfers, hidden proposal amounts, near-zero-signature UX via session-key delegation, and decryption + sensitive execution inside a TEE.",
      "Agentic intelligence on Nillion: proposal analysis with nilAI, blindfold-encrypted sharded metadata via nilDB, and agents built with ERC-8004 + x402 pay-per-inference access.",
      "Bonus build: a fully confidential UNO on Inco's Lightning SDK — encrypted hands, cryptographically shuffled deck, and verifiable final state.",
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
  },
  {
    title: "ETHGlobal New Delhi",
    kind: "Hackathon",
    event: "ETHGlobal New Delhi",
    date: "2025",
    blurb:
      "Built and demoed at ETHGlobal New Delhi — one of the world's largest Ethereum hackathons — shipping a working project end-to-end over the event.",
    // TODO: expand with exact details from the tweet (build name, stack, prizes).
    highlights: [],
    tags: ["Ethereum", "Hackathon", "Web3"],
    images: ["/achievements/ethglobal-delhi.jpg"],
    href: "https://x.com/RattiPrazwal/status/1980570745324597605",
  },
  {
    title: "Web3 Workshop — Speaker",
    kind: "Speaking",
    event: "VIT Chennai",
    location: "Chennai",
    date: "Sep 2025",
    blurb:
      "Conducted my first workshop as a speaker — introducing the Web3 ecosystem to students at VIT Chennai and taking the room from zero to a live on-chain deploy.",
    highlights: [
      "Walked the room through the Web3 ecosystem: wallets, Ethereum, testnets, and the developer stack.",
      "Live MetaMask setup and a real Sepolia testnet transaction, verified on Etherscan.",
      "Wrote and deployed a smart contract live in Remix, then called it on-chain.",
      "Demystified gas, transactions, and contract interaction with hands-on demos.",
    ],
    tags: [
      "Public Speaking",
      "Ethereum",
      "Solidity",
      "Remix",
      "MetaMask",
      "Sepolia",
    ],
    images: [
      "/achievements/workshop-speaker.jpg",
      "/achievements/workshop-remix.jpg",
      "/achievements/workshop-sepolia.jpg",
    ],
  },
];
