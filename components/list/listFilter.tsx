
'use client'

import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

import type { FilterItem } from '@/lib/types'

interface ListFilterProps {
  items: FilterItem[]
  currentItem: string

  onSelect: (slug: string) => void
  onClear: () => void

  isPending?: boolean

  itemPrefix?: string
  showAllLabel?: string
  moreLabel?: (count: number) => string
}

export default function ListFilter({
  items,
  currentItem,
  onSelect,
  onClear,
  isPending = false,
  itemPrefix = '',
  showAllLabel = 'همه',
  moreLabel = (count) => `+${count} مورد دیگر`,
}: ListFilterProps) {
  const [showAll, setShowAll] = useState(false)

  const visibleItems = showAll
    ? items
    : items.slice(0, 8)

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">

      <div className="flex flex-wrap gap-2">

        {/* همه */}

        <button
          onClick={onClear}
          disabled={isPending}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${
              !currentItem
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
            }
            ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {showAllLabel}
        </button>

        {/* تگ‌ها */}

        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.slug)}
            disabled={isPending}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              flex items-center gap-1.5
              ${
                currentItem === item.slug
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
              }
              ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {itemPrefix}

            {item.name}

            <span
              className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${
                  currentItem === item.slug
                    ? 'bg-white dark:bg-black text-black dark:text-white'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }
              `}
            >
              {item.count}
            </span>

          </button>
        ))}

        {/* نمایش بیشتر */}

        {items.length > 8 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-transparent border-2 border-lbtn dark:border-dbtn hover:border-black/10 dark:hover:border-white/10 transition-colors"
          >
            {showAll
              ? 'نمایش کمتر'
              : moreLabel(items.length - 8)}
          </button>
        )}

        {/* تگ فعال */}

        {currentItem && (
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-full text-sm font-medium bg-transparent  text-redorange  flex items-center gap-1 border-2 border-redorange hover:text-red hover:border-red duration-200"
          >
            <IoClose className="text-lg" />

            {itemPrefix}
            {currentItem}
          </button>
        )}

      </div>

    </div>
  )
}
