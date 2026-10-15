import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Legacy WordPress article/category URLs end in a slash and must remain exact.
  skipTrailingSlashRedirect: true,
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
