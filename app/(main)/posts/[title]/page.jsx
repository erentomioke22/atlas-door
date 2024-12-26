import React from 'react';
import PostPage from '@components/posts/postPage';
import { cache } from 'react';
import NotFound from '@app/(main)/not-found';
import { prisma } from '@utils/database';
import { getPostDataInclude } from '@lib/types';
// import Head from 'next/head';

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
    return null; // Handle error case
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
    return []; // Return an empty array or handle it as necessary
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
  // console.log('hchgjg jchcj',post)
  
    return {
      metadataBase: new URL(`https://www.atlasdoor.ir/posts/${post.title}`),
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
        locale: 'en_US',
        url: `https://www.atlasdoor.ir/posts/${post?.title}`,
        siteName: 'Atlas Door',
        images: [
          {
            url: `https://www.atlasdoor.ir/${post?.images[0]}`,
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
  // const post = await getPost(params.title);
  // if (!post) {
  //   return NotFound();
  // }

  return (
    <>
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
    <div>
      <PostPage params={params}
      //  post={post} 
       />
    </div>
    </>
  );
}

