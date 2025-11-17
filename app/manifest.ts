import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'اطلس در',
    short_name: 'اطلس در',
    description: 'نمایندگی شیشه سکوریت - فروش و انجام خدمات درب اتوماتیک درو پنجره ی و کرکره برقی',
    start_url: '/',
    icons: [
      {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    background_color: '#fff',
    theme_color: '#fff',
    display: 'standalone',
  }
}