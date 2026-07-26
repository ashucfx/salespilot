import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.salespilot.theripplenexus.com' }],
        destination: 'https://salespilot.theripplenexus.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
