// components/posts/RelatedPosts.tsx
'use client';

import PostCard from '@/components/posts/postCard';
import EmblaCarousel from '@/components/ui/carousel/carousel';
import { PostLite } from '@/lib/types';

interface RelatedPostsProps {
  posts: PostLite[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-neutral-500 dark:text-neutral-400 h-52 flex flex-col justify-center items-center">
        هیچ مقاله مرتبطی یافت نشد
      </p>
    );
  }

  return (
    <EmblaCarousel
      options={{ loop: false, dragFree: true, direction: 'rtl' }}
      dot={false}
      autoScroll={false}
    >
      {posts.map((post) => (
        <div
          className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] sm:basis-auto min-w-0 pl-4 sm:pr-2 my-2"
          key={post._id}
        >
          <PostCard post={post} />
        </div>
      ))}
    </EmblaCarousel>
  );
}