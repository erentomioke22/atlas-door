import PostPage from './postPage';
import { cache } from 'react';
import { prisma } from '@/utils/database';
import { getPostDataInclude } from '@/lib/types';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { PostLite } from '@/components/posts/postCard';
import { getServerSession } from "@/lib/get-session";

// Type definitions
interface PostParams {
  title: string;
}

interface PageProps {
  params: Promise<PostParams>;
}




const getPost = cache(async (slug: string, userId?: string | null): Promise<PostLite | null> => {
  try {
    return await prisma.post.findUnique({
      where: { slug: decodeURIComponent(slug), status: 'PUBLISHED' },
      include: getPostDataInclude(userId),
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
});


export const revalidate = 3600;

export async function generateStaticParams(): Promise<Array<{ title: string }>> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
      },
      take: 100
    });

    return posts.map((post) => ({
      title: post.slug,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { title } = await params;
    const post = await getPost(title);
    
    if (!post) return {
      title: 'مقاله یافت نشد',
      description: 'صفحه مورد نظر وجود ندارد',
      robots: { index: false, follow: false }
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const postUrl = `${baseUrl}/posts/${post.slug}`;
    
    const images = post.images?.map(img => ({
      url: img,
      width: 1200,
      height: 630,
      alt: post.title,
    })) || [];
  
    return {
      metadataBase: new URL(`${postUrl}`),
      title: `${post.title} | Atlas Door`,
      description: post.desc?.slice(0, 160) || '',
      keywords: post.tags?.map(t => t.name).join(', ') || '',
      alternates: {
        canonical: postUrl
      },
      openGraph: {
        title: post.title,
        description: post.desc || '',
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.user.displayName || post.user.name || 'نویسنده ناشناس'],
        tags: post.tags?.map(t => t.name) || [],
        url: postUrl,
        locale: 'fa_IR',
        siteName: 'Atlas Door',
        images,
      },
      twitter: {
        card: images.length > 0 ? 'summary_large_image' : 'summary',
        title: post.title,
        description: post.desc?.slice(0, 200) || '',
        images: images.length > 0 ? [images[0].url] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      },
    };

  } catch (error) {
    console.error('Error fetching post metadata:', error);
    return {};
  }
}

const Page = async ({ params }:PageProps) => {
  const { title } = await params;
  const session = await getServerSession();
  const post = await getPost(title,session?.user?.id);
  
  if (!post) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const postUrl = `${baseUrl}/posts/${post.slug}`;


  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.desc || '',
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.user.displayName || post.user.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Atlas Door',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo/atlasDoor.png`,
      }
    },
    image: post.images?.map(img => img),
    mainEntityOfPage: postUrl,
    keywords: post.tags?.map(tag => tag.name).join(', '),
    articleBody: post.content,
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'مقالات',
        item: `${baseUrl}/posts`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: postUrl
      }
    ]
  };



  return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData)
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      <article>
        <PostPage initialPost={post} session={session}/>
      </article>
    </>
  );
};

export default Page;
