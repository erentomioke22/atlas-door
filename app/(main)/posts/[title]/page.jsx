import React from 'react';
import PostPage from './postPage';
import { cache } from 'react';
import NotFound from '@app/(main)/not-found';
import { prisma } from '@utils/database';
import { getPostDataInclude } from '@lib/types';
import Head from 'next/head';

const getPost = cache(async (title, loggedInUserId) => {
  try {
    const decodedTitle = decodeURIComponent(title);
    const post = await prisma.post.findFirst({
      where:{link:decodedTitle},
      include: getPostDataInclude(loggedInUserId),
  }) 

  
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null; 
  }
});


export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
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
    if (!post) { return {}; }
  const contentImages = post?.images?.map((contentImage)=>(
    {
      url: `https://www.atlasdoor.ir/${contentImage}`,
      width: 800,
      height: 600,
      alt: post?.title,
    }
  ))

    return {
      metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${post.title}`),
      title: `${post?.title} - ${post?.desc?.slice(0, 50)}...`,
      description: `${post?.desc}`,
      keywords: `${post?.tags?.map((tag) => `${tag.name}`)}`,
      twitter: {
        card: 'summary_large_image',
        title: `${post.title}`,
        description: `${post?.desc}`,
      },
      openGraph: {
        title: `${post?.title} - ${post?.desc?.slice(0, 50)}...`,
        description: `${post?.desc}`,
        type: 'website',
        locale: 'fa_IR',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?.title}`,
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
    };

  }
  catch(error){
    console.error('Error fetching post metadata:', error); 
    return {}; 
  }
}

export default async function Page({ params }) {
  const post = await getPost(params.title);
  const  {title}  = await params;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post?.title,
    "description": post?.desc,
    "datePublished": post?.createdAt,
    "dateModified": post?.updatedAt,
    "author": {
      "@type": "Person",
      "name": post?.user?.displayName,
    },
    "image": post?.images.map((img) => `${process.env.NEXT_PUBLIC_BASE_URL}/${img}`),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?.title}`,
    },
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <div className='mt-16'>
        <PostPage title={title} />
      </div>
    </>
  );
}






