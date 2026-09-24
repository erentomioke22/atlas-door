// lib/list/actions.ts
'use server';

import { sanityFetch } from '@/sanity/lib/server';
import {
  POSTS_LOAD_MORE_QUERY,
  PRODUCTS_QUERY,
} from '@/lib/sanity/queries';
import { transformProductToLite } from '@/lib/sanity/transformers';
import type { PostLite, ProductLite, SanityProduct } from '@/lib/types';

// ✅ لود بیشتر پست‌ها
export async function loadMorePosts({
  filter,
  start,
  end,
}: {
  filter: string;
  start: number;
  end: number;
}): Promise<PostLite[]> {
  try {
    const posts = await sanityFetch<PostLite[]>({
      query: POSTS_LOAD_MORE_QUERY,
      params: { tag: filter, start, end },
      tags: ['post', `tag-${filter}`],
      revalidate: 300,
    });
    return posts || [];
  } catch (error) {
    console.error('loadMorePosts error:', error);
    throw new Error('خطا در بارگذاری بیشتر');
  }
}

// ✅ لود بیشتر محصولات
export async function loadMoreProducts({
  filter,
  start,
  end,
}: {
  filter: string;
  start: number;
  end: number;
}): Promise<ProductLite[]> {
  try {
    const products = await sanityFetch<SanityProduct[]>({
      query: PRODUCTS_QUERY,
      params: { category: filter, start, end },
      tags: ['product', `category-${filter}`],
      revalidate: 300,
    });

    if (!products) return [];
    return products.map(transformProductToLite);
  } catch (error) {
    console.error('loadMoreProducts error:', error);
    return [];
  }
}