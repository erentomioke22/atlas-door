import { prisma } from '@utils/database';

function formatDateISO(date) {
  return new Date(date).toISOString();
}

export default async function sitemap() {
  const posts = await prisma.post.findMany({
    where: {},
  });

  const postEntries = posts.map(({ link, updatedAt, images, contentImages }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority: 1,
    images: [
      // `${process.env.NEXT_PUBLIC_BASE_URL}/${images[0]}`,
      ...contentImages.map(contentImage => `${process.env.NEXT_PUBLIC_BASE_URL}/${contentImage}`),
    ],
                // alternates: {
            //     languages: {
            //       fa: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
            //     },
            //   },
  }));

  const routes = ['automatic-door', 'balcony-glass', 'partition-glass', 'roller-shutter', 'tempered-glass', 'posts'];
  const routeEntries = routes.map(route => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
    lastModified: formatDateISO(new Date()),
    changeFrequency: 'yearly',
    priority: 1,
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
  ];
}
