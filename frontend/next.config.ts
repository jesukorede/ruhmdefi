import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // allow production builds to successfully complete even if
    // there are ESLint errors (useful for automated deployments)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
