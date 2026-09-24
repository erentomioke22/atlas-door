// app/(main)/products/page.tsx
import { sanityFetch } from '@/sanity/lib/server';
import {
  PRODUCTS_QUERY,
  PRODUCTS_TOTAL_COUNT_QUERY,
  ALL_CATEGORIES_QUERY,
} from '@/lib/sanity/queries';
import ProductsListClient from '@/components/pages/productListPage';
import { Metadata } from 'next';
import { Suspense } from 'react';
import PostsSkeleton from '@/components/ui/loading/postsSkeleton';
import { ProductLite, CategoryLite, SanityProduct } from '@/lib/types';
import { transformProductToLite } from '@/lib/sanity/transformers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    absolute: 'محصولات - فروش لوازم و یراق های شیشه سکوریت و درب های اتوماتیک | اطلس در',
  },
  description: 'فروش تخصصی لوازم و ابزار و یراق های شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت',
  keywords: [
    'درب اتوماتیک',
    'شیشه سکوریت',
    'کرکره برقی',
    'جام بالکن',
    'پارتیشن شیشه ای',
    'فروش لوازم درب اتوماتیک',
    'خرید یراق آلات',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
  },
  openGraph: {
    title: 'محصولات - فروش لوازم و یراق های شیشه سکوریت و درب های اتوماتیک | اطلس در',
    description: 'فروش تخصصی لوازم و ابزار و یراق های شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    siteName: 'Atlas Door',
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محصولات - فروش شیشه سکوریت و درب های اتوماتیک | اطلس در',
    description: 'فروش تخصصی شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export const revalidate = 120;
export const dynamic = 'auto';

const INITIAL_PRODUCTS_LIMIT = 9;
const LOAD_MORE_LIMIT = 6;

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || '';

  // ====== دریافت داده‌های اولیه ======
  const [initialProducts, totalCount, allCategories] = await Promise.all([
    sanityFetch<SanityProduct[]>({
      query: PRODUCTS_QUERY,
      params: {
        category: selectedCategory,
        start: 0,
        end: INITIAL_PRODUCTS_LIMIT,
      },
      tags: ['product', `category-${selectedCategory}`],
      revalidate: 120,
    }),
    sanityFetch<number>({
      query: PRODUCTS_TOTAL_COUNT_QUERY,
      params: { category: selectedCategory },
      tags: ['product'],
      revalidate: 120,
    }),
    sanityFetch<CategoryLite[]>({
      query: ALL_CATEGORIES_QUERY,
      tags: ['category'],
      revalidate: 120,
    }),
  ]);

  const transformedProducts = (initialProducts || []).map(transformProductToLite);
  const hasMore = transformedProducts.length < (totalCount || 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'محصولات - فروش شیشه سکوریت و درب های اتوماتیک | اطلس در',
    description: 'فروش تخصصی لوازم و ابزار و یراق های شیشه سکوریت، لمینت و درب های اتوماتیک',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    publisher: {
      '@type': 'Organization',
      name: 'اطلس در',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container max-w-7xl px-5 py-20 mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {selectedCategory ? (
              <>
                محصولات{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  {selectedCategory}
                </span>
              </>
            ) : (
              'همه محصولات'
            )}
          </h1>
          {selectedCategory && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {totalCount || 0} محصول در این دسته‌بندی
            </p>
          )}
        </div>

        <Suspense fallback={<PostsSkeleton count={INITIAL_PRODUCTS_LIMIT} />}>
          <ProductsListClient
            initialProducts={transformedProducts}
            initialCategories={allCategories || []}
            selectedCategory={selectedCategory}
            totalCount={totalCount || 0}
            hasMore={hasMore}
            initialLimit={INITIAL_PRODUCTS_LIMIT}
            loadMoreLimit={LOAD_MORE_LIMIT}
          />
        </Suspense>
      </div>
    </>
  );
}