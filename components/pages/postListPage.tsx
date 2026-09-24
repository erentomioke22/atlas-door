// app/(main)/posts/postsListClient.tsx
'use client';

import InfiniteList from '@/components/list/infiniteList';
import PostCard from '@/components/posts/postCard';
import { loadMorePosts } from '@/lib/list/actions';
import type { PostLite, TagLite } from '@/lib/types';

interface Props {
  initialPosts: PostLite[];
  initialTags: TagLite[];
  selectedTag: string;
  totalCount: number;
  hasMore: boolean;
  initialLimit: number;
  loadMoreLimit: number;
}

export default function PostsListClient(props: Props) {
  return (
    <InfiniteList<PostLite>
      initialItems={props.initialPosts}
      initialFilters={props.initialTags.map((t) => ({
        _id: t._id,
        name: t.name,
        slug: t.slug,
        count: t.count,
      }))}
      selectedFilter={props.selectedTag}
      totalCount={props.totalCount}
      hasMore={props.hasMore}
      initialLimit={props.initialLimit}
      loadMoreLimit={props.loadMoreLimit}
      // ✅ تنظیمات
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
      // ✅ رندر
      renderItem={(post) => <PostCard key={post._id} post={post} />}
      // ✅ لود بیشتر
      onLoadMore={loadMorePosts}
    />
  );
}
