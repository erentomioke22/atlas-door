// components/list/infiniteList.tsx
'use client';

import React, {
  useState,
  useTransition,
  useCallback,
  useEffect,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ListFilter from './listFilter';
import type { FilterItem, ListType } from '@/lib/types';

interface InfiniteListProps<T> {
  // داده‌های اولیه
  initialItems: T[];
  initialFilters: FilterItem[];
  selectedFilter: string;
  totalCount: number;
  hasMore: boolean;
  initialLimit: number;
  loadMoreLimit: number;

  // تنظیمات
  listType: ListType;
  filterKey: 'tag' | 'category';
  emptyIcon: string;
  emptyTitle: string;
  emptyMessage: string;
  emptyActionLabel: string;
  itemPrefix?: string;
  showAllLabel?: string;
  moreLabel?: (count: number) => string;
  countLabel: (count: number) => string;

  // رندر
  renderItem: (item: T) => React.ReactNode;

  // لود بیشتر
  onLoadMore: (params: {
    filter: string;
    start: number;
    end: number;
  }) => Promise<T[]>;
}

export default function InfiniteList<T extends { _id: string }>({
  initialItems,
  initialFilters,
  selectedFilter,
  totalCount,
  hasMore: initialHasMore,
  initialLimit,
  loadMoreLimit,
  filterKey,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  emptyActionLabel,
  itemPrefix = '',
  showAllLabel = 'همه',
  moreLabel,
  countLabel,
  renderItem,
  onLoadMore,
}: InfiniteListProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initialItems);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ فیلتر - تغییر URL
  const handleFilterChange = useCallback(
    (slug: string) => {
      startTransition(() => {
        const params = new URLSearchParams();
        if (slug) params.set(filterKey, slug);
        router.push(`${pathname}?${params.toString()}` as any);
      });
    },
    [pathname, router, filterKey]
  );

  const clearFilter = useCallback(() => {
    startTransition(() => {
      router.push(pathname as any);
    });
  }, [pathname, router]);

  // ✅ لود بیشتر
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const start = currentLimit;
      const end = currentLimit + loadMoreLimit;

      const newItems = await onLoadMore({
        filter: selectedFilter,
        start,
        end,
      });

      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setCurrentLimit(end);
        setHasMore(end < totalCount);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('خطا در بارگذاری بیشتر. لطفاً دوباره تلاش کنید.');
      console.error('Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    currentLimit,
    loadMoreLimit,
    hasMore,
    isLoadingMore,
    selectedFilter,
    totalCount,
    onLoadMore,
  ]);

  // ✅ وقتی فیلتر عوض شد، reset کن
  useEffect(() => {
    setItems(initialItems);
    setCurrentLimit(initialLimit);
    setHasMore(initialHasMore);
    setError(null);
  }, [selectedFilter, initialItems, initialLimit, initialHasMore]);

  const remaining = totalCount - items.length;

  return (
    <div className="space-y-10">
      {/* فیلتر */}
      <ListFilter
        items={initialFilters}
        currentItem={selectedFilter}
        onSelect={handleFilterChange}
        onClear={clearFilter}
        isPending={isPending}
        itemPrefix={itemPrefix}
        showAllLabel={showAllLabel}
        moreLabel={moreLabel}
      />

      {/* شمارنده */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {isPending
            ? 'در حال بارگذاری...'
            : countLabel(totalCount)}
        </p>
        {selectedFilter && (
          <button
            onClick={clearFilter}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            حذف فیلتر
          </button>
        )}
      </div>

      {/* گرید */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isPending
          ? Array(initialLimit)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-lcard dark:bg-dcard rounded-3xl h-64"
                />
              ))
          : items.length === 0
            ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">{emptyIcon}</div>
                  <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400">
                    {emptyTitle}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-500 mt-2">
                    {emptyMessage}
                  </p>
                  <button
                    onClick={clearFilter}
                    className="mt-4 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity"
                  >
                    {emptyActionLabel}
                  </button>
                </div>
              )
            : items.map((item) => renderItem(item))}
      </div>

      {/* دکمه بارگذاری بیشتر */}
      {!isPending && (
        <div className="flex flex-col items-center gap-4 pt-4">
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className={`
                relative px-8 py-3 rounded-full font-medium transition-all duration-300
                bg-black dark:bg-white text-white dark:text-black
                hover:scale-105 active:scale-95
                ${isLoadingMore ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  بارگذاری...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  بارگذاری بیشتر
                  <span className="text-sm opacity-60">
                    ({remaining} عدد باقی‌مانده)
                  </span>
                </span>
              )}
            </button>
          ) : (
            items.length > 0 &&
            totalCount > 0 && (
              <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 py-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-neutral-300 dark:bg-neutral-700" />
                  <span>همه موارد نمایش داده شد</span>
                  <div className="h-px w-8 bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <p className="mt-2 text-xs opacity-60">
                  {totalCount} مورد موجود است
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ====== Spinner ======
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}