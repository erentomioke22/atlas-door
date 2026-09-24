// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import {
  SEARCH_POSTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  SEARCH_CATEGORIES_QUERY,
  SEARCH_TAGS_QUERY,
  SEARCH_COUNT_QUERY,
} from '@/lib/sanity/queries';
import { transformProductToLite } from '@/lib/sanity/transformers';
import type { SearchResponse } from '@/lib/types';

export const revalidate = 60; // کش ۶۰ ثانیه‌ای

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q')?.trim() || '';
    const type = searchParams.get('type') || 'all'; // all | posts | products | categories | tags

    // ✅ حداقل ۲ کاراکتر
    if (q.length < 2) {
      return NextResponse.json<SearchResponse>({
        results: { posts: [], products: [], categories: [], tags: [] },
        counts: { posts: 0, products: 0, categories: 0, tags: 0 },
        query: q,
      });
    }

    // ✅ نرمال‌سازی query
    const normalizedQ = q.toLowerCase();

    // ✅ تعداد نتایج بر اساس نوع
    const LIMITS = {
      all: { posts: 6, products: 6, categories: 4, tags: 4 },
      posts: { posts: 20, products: 0, categories: 0, tags: 0 },
      products: { posts: 0, products: 20, categories: 0, tags: 0 },
      categories: { posts: 0, products: 0, categories: 20, tags: 0 },
      tags: { posts: 0, products: 0, categories: 0, tags: 20 },
    };

    const limits = LIMITS[type as keyof typeof LIMITS] || LIMITS.all;

    // ✅ اجرای همزمان کوئری‌ها
    const [posts, products, categories, tags, counts] = await Promise.all([
      limits.posts > 0
        ? client.fetch(SEARCH_POSTS_QUERY, { q: normalizedQ, limit: limits.posts })
        : Promise.resolve([]),

      limits.products > 0
        ? client.fetch(SEARCH_PRODUCTS_QUERY, { q: normalizedQ, limit: limits.products })
        : Promise.resolve([]),

      limits.categories > 0
        ? client.fetch(SEARCH_CATEGORIES_QUERY, { q: normalizedQ, limit: limits.categories })
        : Promise.resolve([]),

      limits.tags > 0
        ? client.fetch(SEARCH_TAGS_QUERY, { q: normalizedQ, limit: limits.tags })
        : Promise.resolve([]),

      client.fetch(SEARCH_COUNT_QUERY, { q: normalizedQ }),
    ]);

    // ✅ تبدیل محصولات به فرمت ProductLite
    const transformedProducts = (products || []).map(transformProductToLite);

    // ✅ مرتب‌سازی بر اساس relevance
    const sortByRelevance = <T extends { title?: string; name?: string }>(
      items: T[],
      query: string
    ): T[] => {
      return items.sort((a, b) => {
        const aTitle = (a.title || a.name || '').toLowerCase();
        const bTitle = (b.title || b.name || '').toLowerCase();

        // ۱. تطابق دقیق
        const aExact = aTitle === query ? 0 : 1;
        const bExact = bTitle === query ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;

        // ۲. شروع با query
        const aStarts = aTitle.startsWith(query) ? 0 : 1;
        const bStarts = bTitle.startsWith(query) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;

        // ۳. طول عنوان (کوتاه‌تر = مرتبط‌تر)
        return aTitle.length - bTitle.length;
      });
    };

    const response: SearchResponse = {
      results: {
        posts: sortByRelevance(posts || [], normalizedQ),
        products: sortByRelevance(transformedProducts, normalizedQ),
        categories: sortByRelevance(categories || [], normalizedQ),
        tags: sortByRelevance(tags || [], normalizedQ),
      },
      counts: counts || { posts: 0, products: 0, categories: 0, tags: 0 },
      query: q,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
