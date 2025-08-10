import type { NextConfig } from "next";

const nextConfig = {
  // Enable standalone output so the runtime can use .next/standalone without needing the Next CLI
  output: 'standalone',
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
};

export default nextConfig;
