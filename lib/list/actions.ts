// lib/list/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { PostLite } from '@/lib/types'
import type { Where } from 'payload'

export interface LoadMoreResult<T> {
  items: T[]
  hasMore: boolean
  totalCount: number
}

interface LoadMorePostsParams {
  filter: string
  page: number
  limit: number
}

export async function loadMorePosts({
  filter,
  page,
  limit,
}: LoadMorePostsParams): Promise<LoadMoreResult<PostLite>> {
  try {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      return { items: [], hasMore: false, totalCount: 0 }
    }

    const payload = await getPayload({ config })

    let where: Where | undefined

    if (filter) {
      const tagResult = await payload.find({
        collection: 'tags',
        where: { slug: { equals: filter } },
        limit: 1,
        depth: 0,
      })
      const tag = tagResult.docs[0]
      if (!tag) {
        return { items: [], hasMore: false, totalCount: 0 }
      }
      where = { tags: { in: [String(tag.id)] } }
    }

    const result = await payload.find({
      collection: 'posts',
      where,
      sort: '-publishedAt',
      page,
      limit,
      depth: 1,
    })

    return {
      items: result.docs as unknown as PostLite[],
      hasMore: result.hasNextPage,
      totalCount: result.totalDocs,
    }
  } catch (error) {
    console.error('loadMorePosts error:', error)
    throw new Error('خطا در بارگذاری بیشتر مقالات')
  }
}





// ✅ لود بیشتر محصولات
// export async function loadMoreProducts({
//   filter,
//   start,
//   end,
// }: {
//   filter: string;
//   start: number;
//   end: number;
// }): Promise<ProductLite[]> {
//   try {
//     const products = await sanityFetch<SanityProduct[]>({
//       query: PRODUCTS_QUERY,
//       params: { category: filter, start, end },
//       tags: ['product', `category-${filter}`],
//       revalidate: 300,
//     });

//     if (!products) return [];
//     return products.map(transformProductToLite);
//   } catch (error) {
//     console.error('loadMoreProducts error:', error);
//     return [];
//   }
// }