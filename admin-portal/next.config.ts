import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [],
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
