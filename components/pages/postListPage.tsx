// // components/pages/postListPage.tsx

// 'use client'

// import InfiniteList from '@/components/list/infiniteList'
// import PostCard from '@/components/posts/postCard'

// import { loadMorePosts } from '@/lib/list/actions'

// import type {
//   PostLite,
//   TagLite,
// } from '@/lib/types'

// interface Props {
//   initialPosts: PostLite[]
//   initialTags: TagLite[]

//   selectedTag: string
//   totalCount: number

//   initialLimit: number
//   loadMoreLimit: number
// }

// export default function PostsListClient({
//   initialPosts,
//   initialTags,
//   selectedTag,
//   totalCount,
//   initialLimit,
//   loadMoreLimit,
// }: Props) {
//   return (
//     <InfiniteList<PostLite>
//       initialItems={initialPosts}

//       initialFilters={initialTags.map((tag) => ({
//         id: tag.id,
//         name: tag.name,
//         slug: tag.slug,
//         count: tag.count,
//       }))}

//       selectedFilter={selectedTag}
//       totalCount={totalCount}

//       initialLimit={initialLimit}
//       loadMoreLimit={loadMoreLimit}

//       listType="posts"
//       filterKey="tag"

//       emptyIcon="📝"
//       emptyTitle="هیچ مقاله‌ای پیدا نشد"
//       emptyMessage="با برچسب دیگری جستجو کنید"
//       emptyActionLabel="مشاهده همه مقالات"

//       itemPrefix="#"
//       showAllLabel="همه"

//       moreLabel={(count) => `+${count} تگ دیگر`}

//       countLabel={(count) => `${count} مقاله یافت شد`}

//       renderItem={(post) => (
//         <PostCard post={post} />
//       )}

//       onLoadMore={loadMorePosts}
//     />
//   )
// }


// components/pages/postListPage.tsx
'use client'

import InfiniteList from '@/components/list/infiniteList'
import PostCard from '@/components/posts/postCard'
import { loadMorePosts } from '@/lib/list/actions'
import type { PostLite, TagLite } from '@/lib/types'

interface Props {
  initialPosts: PostLite[]
  initialTags: TagLite[]
  selectedTag: string
  totalCount: number
  initialLimit: number
  loadMoreLimit: number
}

export default function PostsListClient({
  initialPosts,
  initialTags,
  selectedTag,
  totalCount,
  initialLimit,
  loadMoreLimit,
}: Props) {
  return (
    <InfiniteList<PostLite>
      initialItems={initialPosts}
      initialFilters={initialTags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        count: tag.count,
      }))}
      initialTotalCount={totalCount}
      selectedFilter={selectedTag}
      initialLimit={initialLimit}
      loadMoreLimit={loadMoreLimit}
      listType="posts"
      filterKey="tag"
      emptyIcon="📝"
      emptyTitle="هیچ مقاله‌ای پیدا نشد"
      emptyMessage="با برچسب دیگری جستجو کنید"
      emptyActionLabel="مشاهده همه مقالات"
      itemPrefix="#"
      showAllLabel="همه"
      moreLabel={(count) => `+${count} تگ دیگر`}
      countLabel={(count) => `${count} مقاله یافت شد`}
      renderItem={(post) => <PostCard post={post} />}
      onLoadMore={loadMorePosts}
    />
  )
}