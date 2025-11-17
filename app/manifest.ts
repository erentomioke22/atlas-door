import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'اطلس در',
    short_name: 'اطلس در',
    description: 'نمايندگی شيشه سكوريت و خام - فروش و ارائه خدمات انواع شيشه های سكوريت ، كركره برقی ، انواع درب های اتوماتيک  ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شيشه ای و جام بالكن ها',
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