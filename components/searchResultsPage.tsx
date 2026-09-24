// components/searchResultsPage.tsx
'use client';

import React, { useState } from 'react';
import PostCard from '@/components/posts/postCard';
import ProductCard from '@/components/products/productCard';
import type { PostLite, ProductLite } from '@/lib/types';

interface Props {
  query: string;
  posts: PostLite[];
  products: ProductLite[];
}

type Tab = 'all' | 'posts' | 'products';

export default function SearchResultsPage({ query, posts, products }: Props) {
  const [tab, setTab] = useState<Tab>('all');

  const totalCount = posts.length + products.length;

  return (
    <div className="container max-w-7xl mx-auto px-5 py-20 space-y-10">
      {/* هدر */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">
          نتایج جستجو برای "{query}"
        </h1>
        <p className="text-neutral-500">
          {totalCount} نتیجه یافت شد
        </p>
      </div>

      {/* تب‌ها */}
      <div className="flex gap-2 justify-center">
        {[
          { key: 'all' as Tab, label: 'همه', count: totalCount },
          { key: 'products' as Tab, label: 'محصولات', count: products.length },
          { key: 'posts' as Tab, label: 'مقالات', count: posts.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              px-4 py-2 rounded-full text-sm transition-all
              ${
                tab === t.key
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-lcard dark:bg-dcard'
              }
            `}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* نتایج */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(tab === 'all' || tab === 'products') &&
          products.map((p) => <ProductCard key={p._id} product={p} />)}

        {(tab === 'all' || tab === 'posts') &&
          posts.map((p) => <PostCard key={p._id} post={p} />)}
      </div>

      {totalCount === 0 && (
        <div className="text-center py-20 space-y-3">
          <div className="text-6xl">😕</div>
          <p className="text-lg text-neutral-500">
            نتیجه‌ای برای "{query}" پیدا نشد
          </p>
        </div>
      )}
    </div>
  );
}