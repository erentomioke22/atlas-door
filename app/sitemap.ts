// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const posts = await prisma.post.findMany({
//     where: {status: "PUBLISHED",},
//     select: { slug: true, updatedAt: true, images: true },
//   });
//   const products = await prisma.product.findMany({
//     select: { slug: true, updatedAt: true, images: true },
//   });

//   const postEntries: MetadataRoute.Sitemap = posts.map(({ slug, updatedAt, images }) => ({
//     url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`,
//     lastModified: formatDateISO(updatedAt),
//     changeFrequency: 'yearly',
//     priority: 0.8,
//     images: images.map((image: string) => `${image}`),
//   }));

//   const productEntries: MetadataRoute.Sitemap = products.map(({ slug, updatedAt, images }) => ({
//     url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
//     lastModified: formatDateISO(updatedAt),
//     changeFrequency: 'yearly',
//     priority: 0.8,
//     images: images.map((image: string) => `${image}`),
//   }));

//   const routes = ['about-us', 'privacy-policy', 'posts', 'products'] as const;
//   const routeEntries: MetadataRoute.Sitemap = routes.map((route) => ({
//     url: `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
//     lastModified: formatDateISO(new Date()),
//     changeFrequency: 'yearly',
//     priority: 0.8,
//   }));


// }
import type { MetadataRoute } from 'next';
import { prisma } from '@/utils/database';

function formatDateISO(date: Date | string | number): string {
  return new Date(date).toISOString();
}

type EntryWithMeta = {
  slug: string;
  updatedAt: Date | string;
  images: string[] | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: EntryWithMeta[] = [];
  let products: EntryWithMeta[] = [];

  try {
    // @ts-ignore - مدل ممکنه با نسخه‌ی قدیمی schema فرق داشته باشه
    posts = (await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, images: true },
    })) as EntryWithMeta[];
  } catch (error) {
    console.error('Sitemap: failed to fetch posts', error);
  }

  try {
    // @ts-ignore
    products = (await prisma.product.findMany({
      select: { slug: true, updatedAt: true, images: true },
    })) as EntryWithMeta[];
  } catch (error) {
    console.error('Sitemap: failed to fetch products', error);
  }

  const postEntries: MetadataRoute.Sitemap = posts.map(({ slug, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority: 0.8,
    images: (images ?? []).map((image: string) => `${image}`),
  }));

  const productEntries: MetadataRoute.Sitemap = products.map(({ slug, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority: 0.8,
    images: (images ?? []).map((image: string) => `${image}`),
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