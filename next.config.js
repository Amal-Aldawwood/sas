/** @type {import('next').NextConfig} */
module.exports = {
  // Essential Next.js configuration
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  
  // Ignore TypeScript errors during build (for development)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors during build (for development)
  eslint: {
    ignoreDuringBuilds: true,
  }
};
