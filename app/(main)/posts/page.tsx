// app/(main)/posts/page.tsx
import { sanityFetch } from '@/sanity/lib/server';
import { 
  POSTS_QUERY, 
  POSTS_TOTAL_COUNT_QUERY,
  ALL_TAGS_QUERY 
} from '@/lib/sanity/queries';
import PostsListClient from '@/components/pages/postListPage';
import { Metadata } from 'next';
import { Suspense } from 'react';
import PostsSkeleton from '@/components/ui/loading/postsSkeleton';
import { PostLite, TagLite } from '@/lib/types';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    absolute: 'مقالات تخصصی شیشه سکوریت، درب اتوماتیک و کرکره برقی | اطلس در',
  },
  description: 'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک، کرکره‌های برقی، جام بالکن و پارتیشن شیشه‌ای با راهنمای جامع و تصویری',
  keywords: [
    'آموزش درب اتوماتیک',
    'قیمت درب اتوماتیک',
    'قیمت شیشه سکوریت',
    'تعمیر کرکره برقی',
    'جام بالکن',
    'پارتیشن شیشه ای',
    'آموزش نصب درب اتوماتیک',
    'شیشه سکوریت',
    'مشاوره درب اتوماتیک',
    'خدمات درب اتوماتیک',
    'نرده شیشه ای',
    'کرتین وال',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
  },
  openGraph: {
    title: 'مقالات تخصصی شیشه سکوریت، درب اتوماتیک و کرکره برقی | اطلس در',
    description: 'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک، کرکره‌های برقی، جام بالکن و پارتیشن شیشه‌ای',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    siteName: 'Atlas Door',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-posts.jpg`,
        width: 1200,
        height: 630,
        alt: 'مقالات تخصصی اطلس در',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مقالات تخصصی شیشه سکوریت و درب‌های اتوماتیک | اطلس در',
    description: 'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک و کرکره‌های برقی',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-posts.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const revalidate = 300;
export const dynamic = 'auto';

// ====== تعداد پست در هر بار بارگذاری ======
const INITIAL_POSTS_LIMIT = 9;
const LOAD_MORE_LIMIT = 6;

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

function PostsJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'مقالات تخصصی شیشه سکوریت، درب اتوماتیک و کرکره برقی | اطلس در',
    description: 'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک، کرکره‌های برقی، جام بالکن و پارتیشن شیشه‌ای',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    publisher: {
      '@type': 'Organization',
      name: 'اطلس در',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedTag = params.tag || '';

  // ====== دریافت داده‌های اولیه ======
  const [initialPosts, totalCount, allTags] = await Promise.all([
    sanityFetch<PostLite[]>({
      query: POSTS_QUERY,
      params: { 
        tag: selectedTag, 
        limit: INITIAL_POSTS_LIMIT 
      },
      tags: ['post', `tag-${selectedTag}`],
      revalidate: 300,
    }),
    sanityFetch<number>({
      query: POSTS_TOTAL_COUNT_QUERY,
      params: { tag: selectedTag },
      tags: ['post'],
      revalidate: 300,
    }),
    sanityFetch<TagLite[]>({
      query: ALL_TAGS_QUERY,
      tags: ['tag'],
      revalidate: 600,
    }),
  ]);

  const hasMore = (initialPosts?.length || 0) < (totalCount || 0);

  return (
    <>
      <PostsJsonLd />
      
      <div className="container max-w-7xl px-5 py-20 mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {selectedTag ? (
              <>
                مقالات <span className="text-blue-600 dark:text-blue-400">#{selectedTag}</span>
              </>
            ) : (
              'همه مقالات'
            )}
          </h1>
          {selectedTag && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {totalCount || 0} مقاله با برچسب #{selectedTag}
            </p>
          )}
        </div>

        <Suspense fallback={<PostsSkeleton count={INITIAL_POSTS_LIMIT} />}>
          <PostsListClient
            initialPosts={initialPosts || []}
            initialTags={allTags || []}
            selectedTag={selectedTag}
            totalCount={totalCount || 0}
            hasMore={hasMore}
            initialLimit={INITIAL_POSTS_LIMIT}
            loadMoreLimit={LOAD_MORE_LIMIT}
          />
        </Suspense>
      </div>
    </>
  );
}

