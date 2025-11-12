import type { MetadataRoute } from 'next';
import { prisma } from '@/utils/database';

function formatDateISO(date: Date | string | number): string {
  return new Date(date).toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true, images: true },
  });
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true, images: true },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map(({ slug, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority: 0.8,
    images: images.map((image: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/${image}`),
  }));

  const productEntries: MetadataRoute.Sitemap = products.map(({ slug, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority: 0.8,
    images: images.map((image: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/${image}`),
  }));

  const routes = ['about-us', 'privacy-policy', 'posts', 'products'] as const;
  const routeEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
    lastModified: formatDateISO(new Date()),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: formatDateISO(new Date()),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...routeEntries,
    ...postEntries,
    ...productEntries,
  ];
}