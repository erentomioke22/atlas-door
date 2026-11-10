// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });

  const [posts, products] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 0, 
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'products',
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.docs
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${BASE_URL}/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  const productEntries: MetadataRoute.Sitemap = products.docs
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

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
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route.priority,
  }));

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  };

  return [homeEntry, ...routeEntries, ...postEntries, ...productEntries];
}