import React from 'react';
import PostPage from '@components/posts/postPage';
import { cache } from 'react';
import NotFound from '@app/(main)/not-found';
import { prisma } from '@utils/database';
import { getPostDataInclude } from '@lib/types';
import Head from 'next/head';

const getPost = cache(async (title, loggedInUserId) => {
  try {
    // console.log('title 10101',title)
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
  const contentImages = post?.contentImages?.map((contentImage)=>(
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
    "image": post?.contentImages.map((img) => `${process.env.NEXT_PUBLIC_BASE_URL}/${img}`),
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
      <div>
        <PostPage params={params} />
      </div>
    </>
  );
}



    {/* <Head>
    <title>{post?.title} - {post?.desc.slice(0, 50)}...</title>
    <meta name="description" content={post?.desc} />
    <meta name="keywords" content={post?.tags.map(tag => tag.name).join(', ')} />
    <meta property="og:title" content={`${post?.title} - ${post?.desc?.slice(0, 50)}...`} />
    <meta property="og:description" content={post?.desc} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content={`https://www.atlasdoor.ir/posts/${post?.title}`} />
    <meta property="og:site_name" content="Atlas Door" />
    <meta property="og:image" content={`https://www.atlasdoor.ir/${post?.images[0]}`} />
    {post?.contentImages.map((contentImage, index) => (
      <meta key={index} property="og:image" content={`https://www.atlasdoor.ir/${contentImage}`} />
    ))}
  </Head> */}




