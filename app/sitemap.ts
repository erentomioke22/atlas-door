// // app/sitemap.ts
import type { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function formatDateISO(date: string | Date): string {
  return new Date(date).toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ✅ کوئری‌های موازی برای پست‌ها و محصولات
  const [posts, products] = await Promise.all([
    client.fetch<
      Array<{
        slug: string;
        _updatedAt: string;
        mainImage: string | null;
      }>
    >(
      groq`*[_type == "post" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        "mainImage": mainImage.asset->url
      } | order(publishedAt desc)`
    ),

    client.fetch<
      Array<{
        slug: string;
        _updatedAt: string;
        images: string[];
      }>
    >(
      groq`*[_type == "product" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        "images": images[].asset->url
      } | order(_createdAt desc)`
    ),
  ]);

  // ✅ ورودی پست‌ها
  const postEntries: MetadataRoute.Sitemap = posts.map(
    ({ slug, _updatedAt, mainImage }) => ({
      url: `${BASE_URL}/posts/${slug}`,
      lastModified: formatDateISO(_updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
      ...(mainImage && { images: [mainImage] }),
    })
  );

  // ✅ ورودی محصولات
  const productEntries: MetadataRoute.Sitemap = products.map(
    ({ slug, _updatedAt, images }) => ({
      url: `${BASE_URL}/products/${slug}`,
      lastModified: formatDateISO(_updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
      ...(images?.length > 0 && { images }),
    })
  );

  // ✅ صفحات ثابت
  const routes = [
    { path: 'about-us', priority: 0.5 },
    { path: 'privacy-policy', priority: 0.3 },
    { path: 'posts', priority: 0.8 },
    { path: 'products', priority: 0.9 },
    { path: 'bag', priority: 0.5 },
    { path: 'orders', priority: 0.5 },
  ] as const;

  const routeEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE_URL}/${route.path}`,
    lastModified: formatDateISO(new Date()),
    changeFrequency: 'weekly',
    priority: route.priority,
  }));

  // ✅ صفحه اصلی
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    lastModified: formatDateISO(new Date()),
    changeFrequency: 'daily',
    priority: 1,
  };

  return [
    homeEntry,
    ...routeEntries,
    ...postEntries,
    ...productEntries,
  ];
}