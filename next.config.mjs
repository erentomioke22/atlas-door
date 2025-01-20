// /** @type {import('next').NextConfig} */
// const nextConfig = {};
// module.exports = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'encrypted-tbn0.gstatic.com',
//           port: '',
//           pathname: '/images/**',
//         },
//       ],
//     },
//   };
  

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
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
        { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/media/**', },
        { protocol: 'https', hostname: 'api2.zoomg.ir', port: '', pathname: '/media/**', },
        { protocol: 'https', hostname: 'cdn.atlasdoor.ir', port: '', pathname: '/**', }, 
        { protocol: 'https', hostname: 'utfs.io', port: '', pathname: '/**', }, 
        { protocol: 'https', hostname: 'tailwindui.com', port: '', pathname: '/**', }, 
      ],
    },
  };
  
//   module.exports = nextConfig;
export default nextConfig;
  