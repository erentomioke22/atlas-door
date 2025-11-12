import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  images: {
    domains: ['example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'media.atlasdoors.ir',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'uploadthing.com',
        pathname: '/**',
      },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/media/**', },
      { protocol: 'https', hostname: 'api2.zoomg.ir', port: '', pathname: '/media/**', },
      { protocol: 'https', hostname: 'cdn.atlasdoor.ir', port: '', pathname: '/**', }, 
      { protocol: 'https', hostname: 'utfs.io', port: '', pathname: '/**', }, 
      { protocol: 'https', hostname: 'tailwindui.com', port: '', pathname: '/**', }, 
    ],
  },
  typedRoutes: true,
}
 
export default nextConfig;