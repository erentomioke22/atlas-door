import { getSinglePost } from '@/lib/payload/queries';
import { getPayload } from 'payload';
import config from '@payload-config';
import PostPage from '@/components/pages/postPage';
import { PostFull } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession , type ServerSession } from '@/lib/get-session';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      select: { slug: true },
    });

    return posts.docs
      .filter((post) => post.slug)
      .map((post) => ({ slug: post.slug as string }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getSinglePost(slug);
    if (!post) {
      return {
        title: 'مقاله یافت نشد | اطلس در',
        robots: { index: false, follow: false },
      };
    }
    const metaTitle = post.meta?.title || post.title;
    const metaDescription =
      post.meta?.description || post.desc?.slice(0, 160) || '';

    const metaImage =
      typeof post.meta?.image === 'object'
        ? post.meta.image?.url
        : typeof post.mainImage === 'object'
          ? post.mainImage?.url
          : null;

    const authorName = typeof post.author === 'object' ? post.author?.name : null;
    
    const tagNames = Array.isArray(post.tags)
      ? post.tags
          .map((t: any) => (typeof t === 'object' ? t.name : null))
          .filter((name): name is string => typeof name === 'string')
      : [];


    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.atlasdoor.ir";
    const postUrl = `${baseUrl}/posts/${slug}`;

    return {
      metadataBase: new URL(baseUrl),
      title: `${metaTitle} | اطلس در`,
      description: metaDescription,
      keywords: tagNames.join(', '),
      authors: authorName ? [{ name: authorName }] : [],
      alternates: { canonical: postUrl },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: metaImage ? [{ url: metaImage, width: 1200, height: 630 }] : [],
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: authorName ? [authorName] : [],
        tags: tagNames,
        url: postUrl,
        locale: 'fa_IR',
        siteName: 'Atlas Door',
      },
      twitter: {
        card: metaImage ? 'summary_large_image' : 'summary',
        title: metaTitle,
        description: metaDescription,
        images: metaImage ? [{ url: metaImage, width: 1200, height: 630 }] : [],
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const session : ServerSession = await getServerSession();
  
  const post = await getSinglePost(slug);
  if (!post) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/posts/${slug}`;

  const authorName =
    typeof post.author === 'object' ? post.author?.name : null;

  const mainImageUrl =
    typeof post.mainImage === 'object' ? post.mainImage?.url : null;

  const metaImageUrl =
    typeof post.meta?.image === 'object'
      ? post.meta.image?.url
      : mainImageUrl;

  const tagsArray = Array.isArray(post.tags)
    ? post.tags
        .map((t: any) => (typeof t === 'object' ? t.name : t))
        .filter((name): name is string => typeof name === 'string')
    : [];

    const articleStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.meta?.title || post.title,
      description: post.meta?.description || post.desc || '',
      image: metaImageUrl ? [metaImageUrl] : [],
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        name: authorName || 'اطلس در',
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
      keywords: tagsArray.join(', '),
      articleSection: tagsArray[0] || 'عمومی',
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
        {
          '@type': 'ListItem',
          position: 3,
          name: post.meta?.title || post.title,
          item: postUrl,
        },
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
      <PostPage initialPost={post as unknown as PostFull} session={session} />
    </>
  );
}