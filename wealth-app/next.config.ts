import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/ClaudeComp" : "",
  assetPrefix: isProd ? "/ClaudeComp/" : "",
  images: { unoptimized: true },
  // API routes are excluded from static export automatically
};

export default nextConfig;
