import type { Metadata } from 'next'
import { Suspense } from 'react'

import { getPostsListData } from '@/lib/payload/queries'

import PostsListClient from '@/components/pages/postListPage'

import PostsSkeleton from '@/components/ui/loading/postsSkeleton'

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.atlasdoor.ir"
).replace(/\/$/, '')

// تعداد مقالات در هر صفحه
const INITIAL_POSTS_LIMIT = 9
const LOAD_MORE_LIMIT = 9

interface PageProps {
  searchParams: Promise<{
    tag?: string
  }>
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    absolute:
      'مقالات تخصصی شیشه سکوریت، درب اتوماتیک و کرکره برقی | اطلس در',
  },

  description:
    'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک، کرکره‌های برقی، جام بالکن و پارتیشن شیشه‌ای با راهنمای جامع و تصویری',

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
    canonical: `${BASE_URL}/posts`,
  },

  openGraph: {
    title:
      'مقالات تخصصی شیشه سکوریت، درب اتوماتیک و کرکره برقی | اطلس در',

    description:
      'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک، کرکره‌های برقی، جام بالکن و پارتیشن شیشه‌ای',

    url: `${BASE_URL}/posts`,
    siteName: 'Atlas Door',
    locale: 'fa_IR',
    type: 'website',

    images: [
      {
        url: `${BASE_URL}/images/og-posts.jpg`,
        width: 1200,
        height: 630,
        alt: 'مقالات تخصصی اطلس در',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'مقالات تخصصی شیشه سکوریت و درب‌های اتوماتیک | اطلس در',

    description:
      'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک و کرکره‌های برقی',

    images: [`${BASE_URL}/images/og-posts.jpg`],
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
}


function PostsJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',

    name:
      'مقالات تخصصی شیشه سکوریت، درب اتوماتیک و کرکره برقی | اطلس در',

    description:
      'آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب‌های اتوماتیک، کرکره‌های برقی، جام بالکن و پارتیشن شیشه‌ای',

    url: `${BASE_URL}/posts`,

    publisher: {
      '@type': 'Organization',
      name: 'اطلس در',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}



export default async function PostsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams

  const selectedTag = params.tag || ''

  const {
    posts: initialPosts,
    totalCount,
    tags: allTags,
  } = await getPostsListData(selectedTag)

  return (
    <>
      <PostsJsonLd />

      <main className="container max-w-7xl px-5 py-20 mx-auto space-y-10">

        {/* عنوان صفحه */}

        <div className=" space-y-4">

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">

            {selectedTag ? (
              <>
                مقالات{' '}

                <span className="text-neutral-500 dark:text-neutral-400">
                  #{selectedTag}
                </span>
              </>
            ) : (
              'همه مقالات'
            )}

          </h1>

          {selectedTag && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {totalCount} مقاله با برچسب #{selectedTag}
            </p>
          )}

        </div>

        {/* لیست مقالات */}

        <Suspense
key={selectedTag} fallback={<PostsSkeleton count={INITIAL_POSTS_LIMIT} />}
        >

          <PostsListClient
            initialPosts={initialPosts}
            initialTags={allTags}
            selectedTag={selectedTag}
            totalCount={totalCount}
            initialLimit={INITIAL_POSTS_LIMIT}
            loadMoreLimit={LOAD_MORE_LIMIT}
          />

        </Suspense>

      </main>
    </>
  )
}
