import type { NextConfig } from "next";

// Set STATIC_EXPORT=true in GitHub Actions for GitHub Pages deployment.
// Vercel deployments leave this unset so API routes (AI features) work.
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    basePath: "/ClaudeComp",
    assetPrefix: "/ClaudeComp/",
  }),
  images: { unoptimized: true },
};

export default nextConfig;
