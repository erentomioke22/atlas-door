import type { MetadataRoute } from 'next';
import { prisma } from '@/utils/database';

function formatDateISO(date: Date | string | number): string {
  return new Date(date).toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    select: { link: true, updatedAt: true, images: true },
  });
  const products = await prisma.product.findMany({
    select: { name: true, updatedAt: true, images: true },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map(({ link, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority: 0.8,
    images: images.map((image: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/${image}`),
  }));

  const productEntries: MetadataRoute.Sitemap = products.map(({ name, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${name}`,
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