import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce the minimal server bundle consumed by the production Docker image.
  output: "standalone",
  // Legacy WordPress article/category URLs end in a slash and must remain exact.
  skipTrailingSlashRedirect: true,
  // Keep resolution/scanning inside this app, including isolated QA snapshots.
  turbopack: { root: process.cwd() },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    // Keep responsive variants in the same format used by the upload pipeline.
    formats: ["image/webp"],
    qualities: [90],
  },
  allowedDevOrigins: ["45.149.77.64", "192.168.1.196"],
};

export default nextConfig;
