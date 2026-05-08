/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. REMOVE 'standalone' - it's bloat for Cloudflare
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // 2. Add these to help trim the bundle
  typescript: {
    ignoreBuildErrors: true, // Speeds up and slims down the build
  },
  eslint: {
    ignoreDuringBuilds: true, // Same here
  },
};

export default nextConfig;
