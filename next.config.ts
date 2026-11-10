import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    domains: ['example.com'],
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '**',
        port: '',        
        pathname: '/**', 
      },
    ],
  },
  typedRoutes: true,
};

export default withPayload(nextConfig);