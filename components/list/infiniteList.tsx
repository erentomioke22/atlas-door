// components/list/infiniteList.tsx
'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Route } from 'next'
import { useInfiniteQuery } from '@tanstack/react-query'

import ListFilter from './listFilter'
import type { FilterItem, ListType } from '@/lib/types'

export interface LoadMoreResult<T> {
  items: T[]
  hasMore: boolean
  totalCount: number
}

interface InfiniteListProps<T extends { id: string }> {
  initialItems: T[]
  initialFilters: FilterItem[]
  initialTotalCount: number

  selectedFilter: string
  initialLimit: number
  loadMoreLimit: number

  listType: ListType
  filterKey: 'tag' | 'category'

  emptyIcon: string
  emptyTitle: string
  emptyMessage: string
  emptyActionLabel: string

  itemPrefix?: string
  showAllLabel?: string
  moreLabel?: (count: number) => string
  countLabel: (count: number) => string

  renderItem: (item: T) => React.ReactNode

  onLoadMore: (params: {
    filter: string
    page: number
    limit: number
  }) => Promise<LoadMoreResult<T>>
}

export default function InfiniteList<T extends { id: string }>({
  initialItems,
  initialFilters,
  initialTotalCount,
  selectedFilter,
  initialLimit,
  loadMoreLimit,
  listType,
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
  const router = useRouter()
  const pathname = usePathname()

  // ====== React Query ======
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    // queryKey شامل فیلتره → تغییر فیلتر = کوئری جدید، بدون ریلود صفحه
    queryKey: ['infinite-list', listType, filterKey, selectedFilter, loadMoreLimit],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      // صفحه ۱ از initialData میاد، پس فقط صفحات >= ۲ fetch می‌شن
      return onLoadMore({
        filter: selectedFilter,
        page: pageParam,
        limit: loadMoreLimit,
      })
    },

    initialData: {
      pages: [
        {
          items: initialItems,
          hasMore: initialItems.length < initialTotalCount,
          totalCount: initialTotalCount,
        },
      ],
      pageParams: [1],
    },

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      // صفحه بعدی = تعداد صفحات فعلی + ۱
      return allPages.length + 1
    },

    // با تغییر فیلتر، initialData جدید باید جایگزین بشه
    // (چون queryKey عوض شده، React Query خودش دیتای جدید رو از initialData می‌گیره)

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  // ====== دیتای مسطح‌شده ======
  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? initialItems,
    [data, initialItems]
  )

  // totalCount از آخرین صفحه خونده می‌شه (همیشه از سرور میاد)
  const totalCount = data?.pages[data.pages.length - 1]?.totalCount ?? initialTotalCount

  const remaining = Math.max(0, totalCount - items.length)
  const hasMore = Boolean(hasNextPage)

  // ====== تغییر فیلتر (بدون ریلود) ======
  const handleFilterChange = useCallback(
    (slug: string) => {
      if (slug === selectedFilter) return

      const params = new URLSearchParams()
      if (slug) params.set(filterKey, slug)

      const qs = params.toString()
      const target = (qs ? `${pathname}?${qs}` : pathname) as Route

      // scroll: false → صفحه نمی‌پره
      router.push(target, { scroll: false })
    },
    [selectedFilter, pathname, router, filterKey]
  )

  const clearFilter = useCallback(() => {
    if (!selectedFilter) return
    router.push(pathname as Route, { scroll: false })
  }, [selectedFilter, pathname, router])

  // ====== Load More ======
  const loadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return
    try {
      await fetchNextPage()
    } catch (err) {
      console.error('fetchNextPage error:', err)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // ====== رندر ======
  return (
    <div className="space-y-10">
      <ListFilter
        items={initialFilters}
        currentItem={selectedFilter}
        onSelect={handleFilterChange}
        onClear={clearFilter}
        isPending={false}
        itemPrefix={itemPrefix}
        showAllLabel={showAllLabel}
        moreLabel={moreLabel}
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {countLabel(totalCount)}
        </p>
        {selectedFilter && (
          <button
            onClick={clearFilter}
            className="px-2 py-1 rounded-full text-xs bg-transparent text-redorange border-2 border-redorange hover:text-red hover:border-red duration-200"
          >
            حذف فیلتر
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
        {items.length === 0 ? (
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
        ) : (
          items.map((item) => (
            <div key={item.id}>{renderItem(item)}</div>
          ))
        )}
      </div>

      {isError && (
        <div className="text-center">
          <p className="text-sm text-red-500 dark:text-red-400">
            {error instanceof Error ? error.message : 'خطا در بارگذاری'}
          </p>
          <button onClick={() => refetch()} className="mt-3 text-sm text-blue-600 hover:underline">
            تلاش مجدد
          </button>
        </div>
      )}

      {!isError && (
        <div className="flex flex-col items-center gap-4 pt-4">
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={isFetchingNextPage}
              className={`
                relative px-8 py-3 rounded-full font-medium transition-all duration-300
                bg-black dark:bg-white text-white dark:text-black
                hover:scale-105 active:scale-95
                ${isFetchingNextPage ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isFetchingNextPage ? (
                <span className="flex items-center gap-2">
                  <Spinner /> بارگذاری...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  بارگذاری بیشتر
                  <span className="text-sm opacity-60">({remaining} مورد باقی‌مانده)</span>
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
                <p className="mt-2 text-xs opacity-60">{totalCount} مورد موجود است</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-2.647-2.647z" />
    </svg>
  )
}