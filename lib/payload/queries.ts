// lib/payload/queries.ts
import { getPayload } from 'payload';
import config from '@payload-config';
import type { PostLite, TagLite } from '@/lib/types'
import type { Where } from 'payload'
import { unstable_cache } from 'next/cache'

async function getPayloadClient() {
  return await getPayload({ config });
}

export async function getHomePageData() {
  const payload = await getPayloadClient();

  const [posts, products] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 10,
      sort: '-publishedAt',
      depth: 2, // برای گرفتن author و tags
      where: {
        slug: { exists: true },
      },
    }),
    payload.find({
      collection: 'products',
      limit: 6,
      sort: '-createdAt',
      depth: 2,
      where: {
        slug: { exists: true },
      },
    }),
  ]);

  return {
    posts: posts.docs,
    products: products.docs,
  };
}


export async function getSinglePost(slug: string) {
  const payload = await getPayloadClient();

  // ✅ decode کردن slug (چون ممکن است شامل %20 یا کاراکترهای encode شده باشد)
  const decodedSlug = decodeURIComponent(slug).trim();


  // ====== ۱. جستجوی دقیق ======
  let result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: decodedSlug },
    },
    limit: 1,
    depth: 2, // ✅ کاهش از 3 به 2
  });

  // ====== ۲. اگر پیدا نشد، fallback با like ======
  if (result.docs.length === 0) {
    console.log('⚠️ exact match failed, trying like...');
    result = await payload.find({
      collection: 'posts',
      where: {
        slug: { like: decodedSlug },
      },
      limit: 1,
      depth: 2,
    });
  }

  // ====== ۳. اگر هنوز پیدا نشد، با trim یا بدون فاصله ======
  if (result.docs.length === 0 && decodedSlug.includes(' ')) {
    const noSpaceSlug = decodedSlug.replace(/\s+/g, ' ');
    console.log('⚠️ trying with normalized spaces:', noSpaceSlug);
    result = await payload.find({
      collection: 'posts',
      where: {
        slug: { like: noSpaceSlug },
      },
      limit: 1,
      depth: 2,
    });
  }

  const post = result.docs[0];
  if (!post) {
    console.log('❌ Post not found for slug:', decodedSlug);
    return null;
  }


  // ====== پست‌های مرتبط ======
  const tagIds = Array.isArray(post.tags)
    ? post.tags
        .map((t: any) => (typeof t === 'object' ? t.id : t))
        .filter(Boolean)
    : [];

  let related: any = { docs: [] };
  try {
    related = await payload.find({
      collection: 'posts',
      where: {
        slug: { not_equals: decodedSlug },
        ...(tagIds.length > 0 ? { tags: { in: tagIds } } : {}),
      },
      limit: 6,
      sort: '-publishedAt',
      depth: 1, // ✅ کاهش depth برای related
    });
  } catch (err) {
    console.error('⚠️ related posts fetch failed:', err);
    // اگر with tags fail کرد، بدون tags امتحان کن
    try {
      related = await payload.find({
        collection: 'posts',
        where: { slug: { not_equals: decodedSlug } },
        limit: 6,
        sort: '-publishedAt',
        depth: 1,
      });
    } catch {}
  }

  // ====== زمان خواندن ======
  const readingTime = estimateReadingTime(post.content);

  return {
    ...post,
    relatedPosts: related.docs,
    readingTime,
  };
}

function estimateReadingTime(content: any): number {
  try {
    const text = extractTextFromRichText(content);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 180));
  } catch {
    return 1;
  }
}

function extractTextFromRichText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractTextFromRichText).join(' ');
  if (typeof node === 'object') {
    let out = '';
    if (node.text) out += node.text + ' ';
    if (node.children) out += extractTextFromRichText(node.children);
    return out;
  }
  return '';
}






export const DEFAULT_POST_LIMIT = 9


// lib/payload/queries.ts (بخش getPostsListData)

export const getPostsListData = unstable_cache(
  async (selectedTag = '') => {
    const payload = await getPayloadClient()

    // 1. پیدا کردن ID تگ (بدون تغییر)
    let selectedTagId: string | null = null
    if (selectedTag) {
      const tagResult = await payload.find({
        collection: 'tags',
        where: { slug: { equals: selectedTag } },
        limit: 1,
        depth: 0,
      })
      selectedTagId = tagResult.docs[0]?.id ? String(tagResult.docs[0].id) : null
    }

    // 2. ساخت شرط (بدون تغییر)
    let postsWhere: Where | undefined
    if (selectedTag) {
      postsWhere = selectedTagId
        ? { tags: { in: [selectedTagId] } }
        : { id: { equals: '__no_matching_tag__' } }
    }

    // 3. دریافت پست‌ها، تگ‌ها و همه پست‌های سبک (فقط با فیلد tags) به صورت همزمان
    const [postsResult, tagsResult, allPostsLight] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: postsWhere,
        sort: '-publishedAt',
        limit: DEFAULT_POST_LIMIT,
        page: 1,
        depth: 1,
      }),
      payload.find({
        collection: 'tags',
        sort: 'name',
        limit: 1000,
        depth: 0,
      }),
      // ✅ این کوئری فقط فیلد tags را از دیتابیس می‌خواند (بسیار سبک‌تر از قبل)
      payload.find({
        collection: 'posts',
        select: { tags: true },
        limit: 10000,
        depth: 0,
      }),
    ])

    // 4. شمارش تگ‌ها در حافظه (بدون کوئری اضافه)
    const tagCounts = new Map<string, number>()
    allPostsLight.docs.forEach((post: any) => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tagRef: any) => {
          const id = typeof tagRef === 'object' ? tagRef.id : tagRef
          if (id) {
            tagCounts.set(String(id), (tagCounts.get(String(id)) || 0) + 1)
          }
        })
      }
    })

    const tagsWithCount: TagLite[] = tagsResult.docs
      .map((tag) => ({
        id: String(tag.id),
        name: tag.name,
        slug: tag.slug,
        count: tagCounts.get(String(tag.id)) || 0,
      }))
      .filter((tag) => tag.count > 0)
      .sort((a, b) => b.count - a.count)

    return {
      posts: postsResult.docs as unknown as PostLite[],
      totalCount: postsResult.totalDocs,
      tags: tagsWithCount,
    }
  },
  ['posts-list'],
  {
    revalidate: 120,
    tags: ['posts'],
  }
)








// ====== ۶. کوئری محصولات با پیجینیشن و فیلتر ======
export async function getProductsList({
  category,
  start = 0,
  limit = 12,
}: {
  category?: string;
  start?: number;
  limit?: number;
}) {
  const payload = await getPayloadClient();

  const where: any = {
    slug: { exists: true },
  };

  if (category && category !== '') {
    where['category.slug'] = { equals: category };
  }

  const result = await payload.find({
    collection: 'products',
    limit,
    page: Math.floor(start / limit) + 1,
    sort: '-createdAt',
    depth: 2,
    where,
  });

  return result.docs;
}

export async function getProductsTotalCount({ category }: { category?: string }) {
  const payload = await getPayloadClient();

  const where: any = {
    slug: { exists: true },
  };

  if (category && category !== '') {
    where['category.slug'] = { equals: category };
  }

  const result = await payload.count({
    collection: 'products',
    where,
  });

  return result.totalDocs;
}

// ====== ۷. کوئری تمام دسته‌بندی‌ها ======
export async function getAllCategories() {
  const payload = await getPayloadClient();

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    sort: 'title',
    depth: 1,
  });

  const withCounts = await Promise.all(
    categories.docs.map(async (cat) => {
      const countResult = await payload.count({
        collection: 'products',
        where: {
          'category.id': { equals: cat.id },
        },
      });
      return { ...cat, count: countResult.totalDocs };
    }),
  );

  return withCounts;
}

// ====== ۸. کوئری صفحه جزئیات محصول ======
export async function getSingleProduct(slug: string) {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
  });

  const product = result.docs[0];
  if (!product) return null;

  const categoryId =
    typeof product.category === 'object' ? product.category?.id : product.category;

  const related = await payload.find({
    collection: 'products',
    where: {
      slug: { not_equals: slug },
      ...(categoryId ? { 'category.id': { equals: categoryId } } : {}),
    },
    limit: 6,
    sort: '-createdAt',
    depth: 2,
  });

  return {
    ...product,
    relatedProducts: related.docs,
  };
}

// ====== ۹. کوئری متا تگ‌های محصول ======
export async function getProductMeta(slug: string) {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });

  const product = result.docs[0];
  if (!product) return null;

  const firstImage =
    Array.isArray(product.images) && product.images[0]?.image
      ? product.images[0].image
      : null;

  return {
    name: product.name,
    desc: product.desc,
    image: typeof firstImage === 'object' ? firstImage?.url : null,
    imageAlt: typeof firstImage === 'object' ? firstImage?.alt : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryName:
      typeof product.category === 'object' ? product.category?.title : null,
    categorySlug:
      typeof product.category === 'object' ? product.category?.slug : null,
    colors: product.colors,
  };
}







