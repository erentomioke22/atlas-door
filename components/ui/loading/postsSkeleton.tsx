// components/ui/loading/postsSkeleton.tsx
'use client';

import React from 'react';

interface PostsSkeletonProps {
  count?: number;
}

export default function PostsSkeleton({ count = 9 }: PostsSkeletonProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-lcard dark:bg-dcard rounded-3xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-12" />
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-12" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}