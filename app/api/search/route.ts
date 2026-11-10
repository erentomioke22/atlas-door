import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type {
  SearchResponse,
  PostLite,
  ProductLite,
  CategoryLite,
  TagLite,
} from '@/lib/types';

export const revalidate = 60;

// helper: media → string url
function mediaUrl(media: any): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return media;
  if (typeof media === 'object' && media.url) return media.url;
  return undefined;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q')?.trim() || '';
    const type = searchParams.get('type') || 'all';

    if (q.length < 2) {
      return NextResponse.json<SearchResponse>({
        results: { posts: [], products: [], categories: [], tags: [] },
        counts: { posts: 0, products: 0, categories: 0, tags: 0 },
        query: q,
      });
    }

    const payload = await getPayload({ config: configPromise });

    // محدودیت‌ها بر اساس type
    const LIMITS = {
      all: { posts: 6, products: 6, categories: 4, tags: 4 },
      posts: { posts: 20, products: 0, categories: 0, tags: 0 },
      products: { posts: 0, products: 20, categories: 0, tags: 0 },
      categories: { posts: 0, products: 0, categories: 20, tags: 0 },
      tags: { posts: 0, products: 0, categories: 0, tags: 20 },
    } as const;

    const limits = LIMITS[type as keyof typeof LIMITS] ?? LIMITS.all;

    // ====== کوئری‌ها ======
    const [
      postsRes,
      productsRes,
      categoriesRes,
      tagsRes,
      postsCount,
      productsCount,
      categoriesCount,
      tagsCount,
    ] = await Promise.all([
      limits.posts > 0
        ? payload.find({
            collection: 'posts',
            where: { title: { like: q } },
            limit: limits.posts,
            depth: 2,
          })
        : null,

      limits.products > 0
        ? payload.find({
            collection: 'products',
            where: { name: { like: q } },
            limit: limits.products,
            depth: 2,
          })
        : null,

      limits.categories > 0
        ? payload.find({
            collection: 'categories',
            where: { title: { like: q } },
            limit: limits.categories,
            depth: 1,
          })
        : null,

      limits.tags > 0
        ? payload.find({
            collection: 'tags',
            where: { name: { like: q } },
            limit: limits.tags,
            depth: 0,
          })
        : null,

      payload.count({ collection: 'posts', where: { title: { like: q } } }),
      payload.count({ collection: 'products', where: { name: { like: q } } }),
      payload.count({ collection: 'categories', where: { title: { like: q } } }),
      payload.count({ collection: 'tags', where: { name: { like: q } } }),
    ]);

    // ====== نگاشت به تایپ‌های سمت کلاینت ======
    const posts: PostLite[] = (postsRes?.docs || []).map((p: any) => ({
      id: String(p.id),
      title: p.title,
      slug: p.slug,
      desc: p.desc,
      mainImage: mediaUrl(p.mainImage),
      publishedAt: p.publishedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      discussions: p.discussions,
      author: p.author
        ? {
            id: String(p.author.id),
            name: p.author.name ?? p.author.displayName ?? 'ناشناس',
            displayName: p.author.displayName ?? p.author.name ?? 'ناشناس', 
            image: mediaUrl(p.author.image),
          }
        : undefined,
      tags: (p.tags || []).map((t: any) => ({
        id: String(t.id),
        name: t.name,
        slug: t.slug,
      })),
    }));

    const products: ProductLite[] = (productsRes?.docs || []).map((p: any) => {
      const images = (p.images || [])
        .map((row: any) => mediaUrl(row?.image))
        .filter(Boolean) as string[];

      return {
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        desc: p.desc ?? '',
        content: p.content,
        images,
        mainImage: images[0] || '',
        category: p.category
          ? {
              id: String(p.category.id),
              title: p.category.title,
              slug: p.category.slug,
            }
          : undefined,
        sellerId: p.seller ? String(p.seller.id ?? p.seller) : undefined,
        seller: p.seller && typeof p.seller === 'object'
          ? {
              id: String(p.seller.id),
              name: p.seller.name ?? p.seller.displayName ?? 'فروشنده',
              image: mediaUrl(p.seller.image) ?? null,
            }
          : undefined,
        colors: (p.colors || []).map((c: any) => ({
          id: c.id ? String(c.id) : undefined,
          color: c.color,
          hexCode: c.hexCode,
          price: Number(c.price) || 0,
          discount: c.discount ?? 0,
          stock: c.stock ?? 0,
          stocks: c.stock ?? 0,
          name: c.color,
          status: (c.stock ?? 0) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
        })),
        material: p.material,
        dimensions: p.dimensions,
        assemblyRequired: p.assemblyRequired,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    const categories: CategoryLite[] = (categoriesRes?.docs || []).map((c: any) => ({
      id: String(c.id),
      title: c.title,
      slug: c.slug,
      image: mediaUrl(c.image),
      count: 0, // در صورت نیاز با count جداگانه پر شود
    }));

    const tags: TagLite[] = (tagsRes?.docs || []).map((t: any) => ({
      id: String(t.id),
      name: t.name,
      slug: t.slug,
      count: 0,
    }));

    // ====== مرتب‌سازی relevance ======
    const sortByRelevance = <T extends { title?: string; name?: string }>(
      items: T[],
      query: string,
    ): T[] =>
      items.sort((a, b) => {
        const aT = (a.title || a.name || '').toLowerCase();
        const bT = (b.title || b.name || '').toLowerCase();
        const aExact = aT === query ? 0 : 1;
        const bExact = bT === query ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        const aStart = aT.startsWith(query) ? 0 : 1;
        const bStart = bT.startsWith(query) ? 0 : 1;
        if (aStart !== bStart) return aStart - bStart;
        return aT.length - bT.length;
      });

    const response: SearchResponse = {
      results: {
        posts: sortByRelevance(posts, q.toLowerCase()),
        products: sortByRelevance(products, q.toLowerCase()),
        categories: sortByRelevance(categories, q.toLowerCase()),
        tags: sortByRelevance(tags, q.toLowerCase()),
      },
      counts: {
        posts: postsCount.totalDocs,
        products: productsCount.totalDocs,
        categories: categoriesCount.totalDocs,
        tags: tagsCount.totalDocs,
      },
      query: q,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}