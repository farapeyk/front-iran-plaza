import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep resolution/scanning inside this app, including isolated QA snapshots.
  turbopack: { root: process.cwd() },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  allowedDevOrigins: ['45.149.77.64'],
};

export default nextConfig;
