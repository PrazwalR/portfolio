import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM; keep it server-safe by transpiling here.
  transpilePackages: ["three"],
  // Pin the workspace root so stray parent lockfiles don't skew file tracing.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
