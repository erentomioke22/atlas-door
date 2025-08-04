import React from 'react';
import PostPage from './postPage';
import { cache } from 'react';
import { prisma } from '@utils/database';
import { getPostDataInclude } from '@lib/types';
import Head from 'next/head';
// import { notFound } from 'next/navigation';


const getPost = cache(async (title, loggedInUserId) => {
  try {
    const decodedTitle = decodeURIComponent(title);
    return await prisma.post.findFirst({
      where:{link:decodedTitle,status: 'PUBLISHED'},
      include: getPostDataInclude(loggedInUserId),
  }) 

  } catch (error) {
    console.error('Error fetching post:', error);
    return null; 
  }
});


export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        link: true,
      },
    });

    return posts.map((post) => ({
      title: post.link,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}





export async function generateMetadata({ params }) {
  try{
    const post = await getPost(params.title);
    if (!post) return {
      title: 'مقاله یافت نشد',
      description: 'صفحه مورد نظر وجود ندارد',
      robots: { index: false, follow: false }
    };

  const contentImages = post?.images?.map((contentImage)=>(
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${contentImage}`,
      width: 1200,
      height: 630,
      alt: post?.title,
    }
  ))

    return {
      metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${post.title}`),
      title: `${post?.title} - ${post?.desc?.slice(0, 50)}... | Atlas Door`,
      description: `${post?.desc}`,
      keywords: post.tags.map(tag => tag.name).join(', '),
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.link}`
      },
      openGraph: {
        title: post?.title,
        description: post?.desc,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.user.displayName],
        tags: post.tags.map(tag => tag.name),
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.link}`,
        locale: 'fa_IR',
        siteName: 'Atlas Door',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${post?.images[0]}`,
            width: 800,
            height: 600,
            alt: post?.title,
          },
          ...contentImages
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.desc,
        images: images[0].url,
      },
      robots: {
        index: true,
        follow: true,
      }
    };

  }
  catch(error){
    console.error('Error fetching post metadata:', error); 
    return {}; 
  }
}

export default async function Page({ params }) {
  const post = await getPost(params.title);
  // if (!post) return notFound();

  const  {title}  = await params;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post?.title,
    "description": post?.desc,
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.user.displayName,
      // "url": `${process.env.NEXT_PUBLIC_BASE_URL}/authors/${post.user.id}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Atlas Door",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/atlasDoor.png`,
        "width": 600,
        "height": 60
      }
    },
    "image": post.images.map(img => ({
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/${img}`,
      "width": 1200,
      "height": 630
    })),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.link}`
    },
    "keywords": post.tags.map(tag => tag.name).join(', '),
    "articleBody": post.content
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "مقالات",
        "item": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.title,
        "item": `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.link}`
      }
    ]
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Head>
      <article className='mt-16'>
        <PostPage title={title} />
      </article>
    </>
  );
}





