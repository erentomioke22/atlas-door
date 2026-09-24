'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BiSearchAlt, BiX } from 'react-icons/bi';
import { FaSpinner } from 'react-icons/fa6';
import ImageCom from './ui/Image';
import Offcanvas from './ui/offcanvas';
import { useSearch } from '@/hook/useSearch';
import { SEARCH_TABS, type SearchTab } from '@/lib/types';
import { formatPriceFa } from '@/lib/utils';
import type { Session } from '@/lib/auth';
import { IoClose } from "react-icons/io5";
import Button from './ui/button';

interface SearchProps {
  session: Session | null;
}

export default function Search({ session }: SearchProps) {
  // ✅ onClose برای بستن offcanvas وقتی لینک کلیک شد
  const [shouldClose, setShouldClose] = useState(false);

  return (
    <Offcanvas
      title={<BiSearchAlt />}
      btnStyle="bg-lcard dark:bg-dcard dark:text-white text-lg p-2 rounded-lg text-black"
      position="top-0 right-0"
      size="h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"
      openTransition="translate-x-0"
      closeTransition="translate-x-full"
      onClose={shouldClose}
    >
      <div className=" flex justify-between">
        <h1 className="text-xl ">جستجو</h1>

        <Button
          className={
            " text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "
          }
          onClick={() => setShouldClose(!shouldClose)}
          type="button"
          variant="close"
          title="close button"
        >
          <IoClose />
        </Button>
      </div>
      <SearchContent
        session={session}
        onClose={() => setShouldClose((prev) => !prev)}
      />
    </Offcanvas>
  );
}

// ============================================================
// SearchContent - محتوای داخل Offcanvas
// ============================================================
interface SearchContentProps {
  session: Session | null;
  onClose: () => void;
}

function SearchContent({ session, onClose }: SearchContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isFetching } = useSearch({
    query,
    type: activeTab,
    enabled: true, // ✅ همیشه فعاله چون فقط وقتی Offcanvas بازه لود میشه
  });

  // ✅ focus روی input وقتی باز شد
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const hasResults =
    data &&
    (data.results.posts.length > 0 ||
      data.results.products.length > 0 ||
      data.results.categories.length > 0 ||
      data.results.tags.length > 0);

  const totalCount = data
    ? data.counts.posts +
      data.counts.products +
      data.counts.categories +
      data.counts.tags
    : 0;

  return (
    <div className="flex flex-col h-full">
      {/* ====== Input ====== */}
      <div className="flex items-center gap-3 p-3 border-b border-lcard dark:border-dcard flex-none">
        <BiSearchAlt className="text-xl text-neutral-500 flex-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو..."
          className="flex-1 bg-transparent outline-none text-base placeholder:text-neutral-400"
          autoComplete="off"
        />
        {isFetching && (
          <FaSpinner className="animate-spin text-neutral-400 flex-none" />
        )}
        {query && !isFetching && (
          <button
            onClick={() => setQuery('')}
            aria-label="پاک کردن"
            className="text-neutral-400 hover:text-red-500 transition-colors flex-none"
          >
            <BiX className="text-xl" />
          </button>
        )}
      </div>

      {/* ====== Tabs ====== */}
      {query.length >= 2 && data && (
        <div className="flex gap-1 px-3 py-2 border-b border-lcard dark:border-dcard overflow-x-auto flex-none">
          {SEARCH_TABS.map((tab) => {
            const count = tab.countKey
              ? data.counts[tab.countKey]
              : totalCount;

            if (count === 0 && tab.key !== 'all') return null;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap
                  transition-all duration-200
                  ${
                    activeTab === tab.key
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`
                      text-[10px] px-1.5 rounded-full
                      ${
                        activeTab === tab.key
                          ? 'bg-white/20 dark:bg-black/20'
                          : 'bg-neutral-200 dark:bg-neutral-700'
                      }
                    `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ====== Content (قابل اسکرول) ====== */}
      <div className="flex-1 overflow-y-auto">
        {/* حالت اولیه */}
        {query.length < 2 && (
          <div className="p-8 text-center space-y-3">
            <div className="text-5xl">🔍</div>
            <p className="text-sm text-neutral-500">
              برای جستجو حداقل ۲ حرف وارد کنید
            </p>
            <div className="flex gap-2 justify-center flex-wrap pt-2">
              <span className="text-xs text-neutral-400">پیشنهاد:</span>
              {['درب اتوماتیک', 'شیشه سکوریت', 'پارتیشن'].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs px-2 py-1 rounded-full bg-lcard dark:bg-dcard hover:bg-black/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && query.length >= 2 && (
          <div className="p-8 text-center space-y-3">
            <FaSpinner className="animate-spin text-2xl text-neutral-400 mx-auto" />
            <p className="text-sm text-neutral-500">در حال جستجو...</p>
          </div>
        )}

        {/* بدون نتیجه */}
        {!isLoading && query.length >= 2 && !hasResults && (
          <div className="p-8 text-center space-y-3">
            <div className="text-5xl">😕</div>
            <p className="text-sm text-neutral-500">
              نتیجه‌ای برای "{query}" پیدا نشد
            </p>
            <p className="text-xs text-neutral-400">
              کلمات دیگری را امتحان کنید
            </p>
          </div>
        )}

        {/* نتایج */}
        {!isLoading && hasResults && (
          <div className="divide-y divide-lcard dark:divide-dcard">
            {/* محصولات */}
            {(activeTab === 'all' || activeTab === 'products') &&
              data.results.products.map((product) => (
                <SearchResultItem
                  key={product._id}
                  href={`/products/${product.slug}`}
                  title={product.name}
                  subtitle={product.seller?.name || 'فروشنده'}
                  image={product.images?.[0]}
                  badge="محصول"
                  badgeColor="text-blue-500"
                  query={query}
                  onClose={onClose}
                  extra={
                    product.colors?.[0] && (
                      <span className="text-xs text-darkgreen">
                        {formatPriceFa(product.colors[0].price)} تومان
                      </span>
                    )
                  }
                />
              ))}

            {/* پست‌ها */}
            {(activeTab === 'all' || activeTab === 'posts') &&
              data.results.posts.map((post) => (
                <SearchResultItem
                  key={post._id}
                  href={`/posts/${post.slug}`}
                  title={post.title}
                  subtitle={post.author?.name || 'ناشناس'}
                  image={post.mainImage}
                  badge="مقاله"
                  badgeColor="text-redorange"
                  query={query}
                  onClose={onClose}
                />
              ))}

            {/* دسته‌بندی‌ها */}
            {(activeTab === 'all' || activeTab === 'categories') &&
              data.results.categories.map((category) => (
                <SearchResultItem
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  title={category.title}
                  subtitle="دسته‌بندی"
                  image={category.image}
                  badge="دسته"
                  badgeColor="text-purple"
                  query={query}
                  onClose={onClose}
                  extra={
                    <span className="text-xs text-neutral-500">
                      {category.count} محصول
                    </span>
                  }
                />
              ))}

            {/* تگ‌ها */}
            {(activeTab === 'all' || activeTab === 'tags') &&
              data.results.tags.map((tag) => (
                <SearchResultItem
                  key={tag._id}
                  href={`/posts?tag=${tag.slug}`}
                  title={`#${tag.name}`}
                  subtitle="برچسب"
                  image={undefined}
                  badge="تگ"
                  badgeColor="text-green-500"
                  query={query}
                  onClose={onClose}
                  extra={
                    <span className="text-xs text-neutral-500">
                      {tag.count} مقاله
                    </span>
                  }
                />
              ))}
          </div>
        )}
      </div>

      {/* ====== Footer ====== */}
      {query.length >= 2 && hasResults && activeTab === 'all' && (
        <div className="p-3 border-t border-lcard dark:border-dcard flex justify-between items-center text-xs text-neutral-500 flex-none">
          <span>{totalCount} نتیجه یافت شد</span>
          <button
            onClick={() => {
              router.push(`/search?q=${encodeURIComponent(query)}`);
              onClose();
            }}
            className="text-blue-500 hover:underline"
          >
            مشاهده همه نتایج →
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SearchResultItem
// ============================================================
interface SearchResultItemProps {
  href: string;
  title: string;
  subtitle: string;
  image?: string;
  badge: string;
  badgeColor: string;
  query: string;
  onClose: () => void;
  extra?: React.ReactNode;
}

function SearchResultItem({
  href,
  title,
  subtitle,
  image,
  badge,
  badgeColor,
  query,
  onClose,
  extra,
}: SearchResultItemProps) {
  return (
    <Link
      href={href as any}
      onClick={onClose}
      className="flex items-center gap-3 p-3 hover:bg-lcard dark:hover:bg-dcard transition-colors"
    >
      {image ? (
        <ImageCom
          src={image}
          className="w-12 h-12 rounded-lg flex-none object-cover"
          alt={title}
        />
      ) : (
        <div className="w-12 h-12 rounded-lg flex-none bg-lcard dark:bg-dcard flex items-center justify-center text-lg">
          {badge[0]}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${badgeColor}`}>{badge}</span>
          <span className="text-[10px] text-neutral-400">•</span>
          <span className="text-[10px] text-neutral-400 truncate">
            {subtitle}
          </span>
        </div>
        <p className="text-sm truncate mt-0.5">
          <HighlightText text={title} query={query} />
        </p>
      </div>

      {extra && <div className="flex-none">{extra}</div>}
    </Link>
  );
}

// ============================================================
// HighlightText
// ============================================================
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-700/50 text-inherit rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}