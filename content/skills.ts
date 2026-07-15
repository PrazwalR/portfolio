/** Skills grouped as in the CV. Rendered as Tag/Chip clusters. */
export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "Rust",
      "Go",
      "Solidity",
      "TypeScript",
      "JavaScript",
      "Python",
      "C",
      "C++",
      "Noir",
      "Circom",
      "SQL",
      "Bash",
    ],
  },
  {
    label: "Blockchain / Web3",
    items: [
      "Ethereum",
      "Solana",
      "Foundry",
      "Ethers.js",
      "Wagmi",
      "Chainlink",
      "The Graph",
      "OpenZeppelin",
      "IPFS",
      "zkSync",
      "Arbitrum",
      "Optimism",
      "Sui",
      "ZK Proofs",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express",
      "Flask",
      "REST",
      "gRPC",
      "GraphQL",
      "WebSockets",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Kafka",
      "Microservices",
    ],
  },
  {
    label: "DevOps & Tools",
    items: [
      "Docker",
      "Kubernetes",
      "AWS (ECR)",
      "GitHub Actions",
      "CI/CD",
      "OpenTelemetry",
      "Linux",
      "Git",
      "Remix",
      "Foundry",
    ],
  },
];
