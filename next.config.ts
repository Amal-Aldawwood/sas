import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true, // For development purposes
  },
  typescript: {
    ignoreBuildErrors: true, // For development purposes
  },
};

export default nextConfig;
