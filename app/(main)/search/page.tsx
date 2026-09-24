// app/(main)/search/page.tsx
import { Metadata } from 'next';
import SearchResultsPage from '@/components/searchResultsPage';
import { client } from '@/sanity/lib/client';
import { transformProductToLite } from '@/lib/sanity/transformers';
import {
  SEARCH_POSTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'جستجو | اطلس در',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', type = 'all' } = await searchParams;

  if (q.length < 2) {
    return (
      <div className="container max-w-4xl mx-auto px-5 py-20 text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold">جستجو</h1>
        <p className="text-neutral-500">برای جستجو حداقل ۲ حرف وارد کنید</p>
      </div>
    );
  }

  // ✅ اجرای موازی
  const [posts, products] = await Promise.all([
    client.fetch(SEARCH_POSTS_QUERY, { q: q.toLowerCase(), limit: 20 }),
    client.fetch(SEARCH_PRODUCTS_QUERY, { q: q.toLowerCase(), limit: 20 }),
  ]);

  const transformedProducts = (products || []).map(transformProductToLite);

  return (
    <SearchResultsPage
      query={q}
      posts={posts || []}
      products={transformedProducts}
    />
  );
}