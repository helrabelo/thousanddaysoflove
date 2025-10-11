import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  experimental: {
    turbo: {
      // Disable devtools to avoid RSC bundler issues
      devtools: false,
    },
  },
};

export default nextConfig;
