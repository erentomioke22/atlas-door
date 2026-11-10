// app/(main)/search/page.tsx
import { Metadata } from 'next';
import SearchResultsPage from '@/components/searchResultsPage';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { PostLite, ProductLite } from '@/lib/types';

export const metadata: Metadata = {
  title: 'جستجو | اطلس در',
  robots: { index: false, follow: false },
};

function mediaUrl(media: any): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return media;
  if (typeof media === 'object' && media.url) return media.url;
  return undefined;
}

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;

  if (q.length < 2) {
    return (
      <div className="container max-w-4xl mx-auto px-5 py-20 text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold">جستجو</h1>
        <p className="text-neutral-500">برای جستجو حداقل ۲ حرف وارد کنید</p>
      </div>
    );
  }

  const payload = await getPayload({ config: configPromise });

  const [postsRes, productsRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { title: { like: q } },
      limit: 20,
      depth: 2,
    }),
    payload.find({
      collection: 'products',
      where: { name: { like: q } },
      limit: 20,
      depth: 2,
    }),
  ]);

  const posts: PostLite[] = postsRes.docs.map((p: any) => ({
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

  const products: ProductLite[] = productsRes.docs.map((p: any) => {
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
        ? { id: String(p.category.id), title: p.category.title, slug: p.category.slug }
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

  return (
    <SearchResultsPage
      query={q}
      posts={posts}
      products={products}
    />
  );
}