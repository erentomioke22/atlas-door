// app/(main)/posts/[slug]/page.tsx
import { sanityFetch } from '@/sanity/lib/server';
import { client } from '@/sanity/lib/client'; // ✅ اضافه کن
import {
  SINGLE_POST_QUERY,
  POST_META_QUERY,
} from '@/lib/sanity/queries';
import PostPage from '@/components/pages/postPage';
import { PostFull } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from '@/lib/get-session';
import { groq } from 'next-sanity';

export const revalidate = 3600;
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await client.fetch<Array<{ slug: string }>>(
      groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ['post'],
        },
      }
    );

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}

// ====== متادیتا ======
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await sanityFetch<{
      title: string;
      desc?: string;
      image?: string;
      imageAlt?: string;
      publishedAt?: string;
      _updatedAt?: string;
      authorName?: string;
      tags?: string[];
    }>({
      query: POST_META_QUERY,
      params: { slug },
      tags: [`post-${slug}`],
      revalidate: 3600,
    });

    if (!post) {
      return {
        title: 'مقاله یافت نشد | اطلس در',
        robots: { index: false, follow: false },
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const postUrl = `${baseUrl}/posts/${slug}`;

    return {
      metadataBase: new URL(baseUrl),
      title: `${post.title} | اطلس در`,
      description: post.desc?.slice(0, 160) || '',
      keywords: post.tags?.join(', ') || '',
      authors: post.authorName ? [{ name: post.authorName }] : [],
      alternates: { canonical: postUrl },
      openGraph: {
        title: post.title,
        description: post.desc?.slice(0, 200) || '',
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post._updatedAt,
        authors: post.authorName ? [post.authorName] : [],
        tags: post.tags || [],
        url: postUrl,
        locale: 'fa_IR',
        siteName: 'Atlas Door',
        images: post.image
          ? [
              {
                url: post.image,
                width: 1200,
                height: 630,
                alt: post.imageAlt || post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: post.image ? 'summary_large_image' : 'summary',
        title: post.title,
        description: post.desc?.slice(0, 200) || '',
        images: post.image ? [post.image] : [],
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
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'خطا | اطلس در' };
  }
}

// ====== صفحه ======
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const session = await getServerSession();

  const post = await sanityFetch<PostFull>({
    query: SINGLE_POST_QUERY,
    params: { slug },
    tags: [`post-${slug}`, 'post', 'related-posts'],
    revalidate: 3600,
  });

  if (!post) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/posts/${slug}`;

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.desc || '',
    image: post.mainImage ? [post.mainImage] : [],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'اطلس در',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'اطلس در',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo/atlasDoor.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.tags?.map((tag) => tag.name).join(', ') || '',
    articleSection: post.tags?.[0]?.name || 'عمومی',
    inLanguage: 'fa-IR',
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: baseUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'مقالات',
        item: `${baseUrl}/posts`,
      },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <PostPage initialPost={post} session={session} />
    </>
  );
}