import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output so the runtime can use .next/standalone without needing the Next CLI
  output: 'standalone',
  // External packages for server components
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
  // Configure for Azure Web Service
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
