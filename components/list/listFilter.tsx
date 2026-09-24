// components/list/listFilter.tsx
'use client';

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import type { FilterItem } from '@/lib/types';

interface ListFilterProps {
  items: FilterItem[];
  currentItem: string;
  onSelect: (slug: string) => void;
  onClear: () => void;
  isPending?: boolean;
  // ✅ برای نمایش درست اسم
  itemPrefix?: string;      // "#" برای تگ، "" برای دسته
  showAllLabel?: string;    // "همه" یا "همه محصولات"
  moreLabel?: (count: number) => string; // "+8 تگ دیگر"
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
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* دکمه همه */}
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

        {/* آیتم‌ها */}
        {visibleItems.map((item) => (
          <button
            key={item._id}
            onClick={() => onSelect(item.slug)}
            disabled={isPending}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              flex items-center gap-1.5
              ${
                currentItem === item.slug
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
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
                    ? 'bg-blue-500 text-white'
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
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            {showAll ? 'نمایش کمتر' : moreLabel(items.length - 8)}
          </button>
        )}

        {/* آیتم فعال */}
        {currentItem && (
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
          >
            <IoClose className="text-lg" />
            {itemPrefix}
            {currentItem}
          </button>
        )}
      </div>
    </div>
  );
}