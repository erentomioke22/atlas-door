import { prisma } from '@utils/database';

function formatDateISO(date) {
  return new Date(date).toISOString();
}

export default async function sitemap() {
  const posts = await prisma.post.findMany();
  const products = await prisma.product.findMany();
  const tags = await prisma.tag.findMany();

  const postEntries = posts.map(({ link, updatedAt, images, contentImages }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority:0.8,
    images: [
      ...contentImages.map(contentImage => `${process.env.NEXT_PUBLIC_BASE_URL}/${contentImage}`),
    ],
                // alternates: {
            //     languages: {
            //       fa: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
            //     },
            //   },
  }));

  const productEntries = products.map(({ name, updatedAt, images }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${name}`,
    lastModified: formatDateISO(updatedAt),
    changeFrequency: 'yearly',
    priority:0.8,
    images: [
      ...images.map(image => `${process.env.NEXT_PUBLIC_BASE_URL}/${image}`),
    ],
  }));

  // const tagEntries = tags.map(({createdAt,name}) => ({
  //   url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${link}`,
  //   lastModified: formatDateISO(createdAt),
  //   changeFrequency: 'yearly',
  //   priority:0.8,
  // }));

  const routes = ['automatic-door', 'balcony-glass', 'partition-glass', 'roller-shutter', 'tempered-glass', 'posts'];
  const routeEntries = routes.map(route => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${route}`,
    lastModified: formatDateISO(new Date()),
    changeFrequency: 'yearly',
    priority:0.8,
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
