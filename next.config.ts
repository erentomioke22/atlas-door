// import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      // { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**', },
      // { protocol: 'https', hostname: 'utfs.io', port: '', pathname: '/**', }, 
    ],
  },
  typedRoutes: true,
}
 
export default withPayload(nextConfig) 