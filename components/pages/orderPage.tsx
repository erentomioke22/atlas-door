// // app/(main)/orders/orderPage.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatPriceFa } from '@/lib/utils';
import LoadingOrder from '@/components/ui/loading/loadingOrder';
import Link from 'next/link';
import ImageCom from '@/components/ui/Image';
import Accordion from '@/components/ui/Accordion';
import { FaCreditCard, FaLocationDot, FaTruckFast, FaHandshakeSimple, FaForwardStep } from 'react-icons/fa6';
import { IoClose, IoSearchOutline } from 'react-icons/io5';
import type { Session } from '@/lib/auth';
import type { OrderResponse, OrderLite, OrderTab } from '@/lib/types';
import { ORDER_TABS, ORDER_STATUS_MAP } from '@/lib/types';
import { useDebounce } from 'use-debounce';
import moment from 'moment-jalaali';

moment.loadPersian({ usePersianDigits: true });

interface OrderPageProps {
  session: Session | null;
}

export default function OrderPage({ session }: OrderPageProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  // ✅ ساخت status filter بر اساس تب فعال
  const activeStatuses = useMemo(() => {
    const tab = ORDER_TABS.find((t) => t.key === activeTab);
    if (!tab || tab.key === 'ALL') return null;
    return tab.statuses;
  }, [activeTab]);

  const { data, status, error, refetch } = useQuery<OrderResponse>({
    queryKey: ['orders', activeTab, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.set('status', activeTab);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await axios.get(`/api/orders?${params.toString()}`);
      return res.data;
    },
    enabled: !!session,
  });

  // ====== فیلتر سمت کلاینت (برای گروه‌های status) ======
  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    if (!activeStatuses) return data.orders;

    return data.orders.filter((order) =>
      activeStatuses.includes(order.status as any)
    );
  }, [data?.orders, activeStatuses]);

  // ====== Loading ======
  if (status === 'pending') {
    return (
      <div className="space-y-5 mt-20">
        {Array(3)
          .fill({})
          .map((_, i) => (
            <LoadingOrder key={i} />
          ))}
      </div>
    );
  }

  if (status === 'error' || error) {
    return (
      <div className="text-center text-destructive h-52 flex flex-col justify-center items-center gap-3">
        <p>مشکلی در برقراری ارتباط وجود دارد</p>
        <button
          onClick={() => refetch()}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-5 py-20 space-y-8">
      {/* ====== هدر ====== */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">سفارشات من</h1>

        {/* ====== جستجو ====== */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در سفارشات..."
            className="bg-lcard dark:bg-dcard rounded-full py-2 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all w-64"
          />
          <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>
      </div>

      {/* ====== تب‌ها ====== */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {ORDER_TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          // ✅ شمارش سفارشات هر تب
          const count = data?.orders
            ? tab.key === 'ALL'
              ? data.orders.length
              : data.orders.filter((o) =>
                  tab.statuses.includes(o.status as any)
                ).length
            : 0;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap
                transition-all duration-300
                ${
                  isActive
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
                    text-xs px-2 py-0.5 rounded-full
                    ${
                      isActive
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

      {/* ====== لیست سفارشات ====== */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-6xl">📦</div>
          <p className="text-lg text-neutral-500">
            {search
              ? 'نتیجه‌ای برای جستجوی شما یافت نشد'
              : 'هیچ سفارشی در این بخش وجود ندارد'}
          </p>
          {activeTab !== 'ALL' && (
            <button
              onClick={() => setActiveTab('ALL')}
              className="text-blue-500 hover:underline text-sm"
            >
              مشاهده همه سفارشات
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// OrderCard Component
// ============================================================
function OrderCard({ order }: { order: OrderLite }) {
  const statusInfo = ORDER_STATUS_MAP[order.status];

  const formattedDate = moment(order.createdAt)
    .locale('fa')
    .format('jYYYY/jMM/jDD - HH:mm');

  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-lcard dark:border-dcard rounded-2xl p-4 space-y-4 hover:shadow-md transition-shadow">
      {/* ====== هدر کارت ====== */}
      <div className="flex flex-wrap justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">شناسه سفارش:</span>
            <span className="font-mono text-sm font-medium">
              {order.orderCode}
            </span>
          </div>
          <div className="text-xs text-neutral-500">{formattedDate}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`flex items-center gap-1 text-sm font-medium ${statusInfo.color}`}
          >
            <span>{statusInfo.label}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-40 h-2 bg-lcard dark:bg-dcard rounded-full overflow-hidden">
            <div
              className={`h-full ${statusInfo.bgColor} transition-all duration-500`}
              style={{ width: `${statusInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ====== محصولات ====== */}
      <div className="space-y-3 divide-y divide-dashed divide-lcard dark:divide-dcard">
        {order.items.map((item) => {
          const itemTotal = item.price * item.quantity;

          return (
            <div key={item.id} className="pt-3 first:pt-0">
              <div className="flex gap-3">
                {item.productImage && (
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="flex-none"
                  >
                    <ImageCom
                      className="w-20 h-20 rounded-2xl object-cover"
                      alt={item.productName || ''}
                      src={item.productImage}
                    />
                  </Link>
                )}

                <Link
                  href={`/products/${item.productSlug}`}
                  className="flex-1 space-y-2 min-w-0"
                >
                  <h3 className="line-clamp-2 hover:underline">
                    {item.productName}
                  </h3>

                  <div className="flex items-center gap-2">
                    {item.colorHex && (
                      <div
                        className="h-4 w-4 rounded-md border border-lcard dark:border-dcard"
                        style={{ backgroundColor: item.colorHex }}
                      />
                    )}
                    <p className="text-sm text-neutral-500">
                      {item.colorName} • تعداد: {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {formatPriceFa(itemTotal)} تومان
                    </span>
                    {item.discount && item.discount > 0 && (
                      <>
                        <span className="text-xs text-redorange">
                          {item.discount}% تخفیف
                        </span>
                        <span className="text-xs text-neutral-500 line-through">
                          {formatPriceFa(
                            (item.originalPrice || item.price) * item.quantity
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====== مجموع ====== */}
      <div className="flex justify-between items-center pt-3 border-t border-lcard dark:border-dcard">
        <div className="text-sm text-neutral-500">
          {order.items.length} محصول
        </div>
        <div className="text-lg font-bold">
          مجموع: {formatPriceFa(order.total)} تومان
        </div>
      </div>

      {/* ====== اطلاعات تحویل ====== */}
      <Accordion
        menuStyle="p-4 text-sm bg-lcard dark:bg-dcard mt-2 rounded-xl"
        btnStyle="bg-lcard dark:bg-dcard rounded-xl"
        title="مشخصات دریافت‌کننده"
      >
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">نام و نام خانوادگی</span>
            <span>{order.recipient}</span>
          </div>
          {order.phone && (
            <div className="flex justify-between">
              <span className="text-neutral-500">شماره تماس</span>
              <span dir="ltr">{order.phone}</span>
            </div>
          )}
          {order.address && (
            <div className="flex justify-between gap-3">
              <span className="text-neutral-500">آدرس</span>
              <span className="text-left">{order.address}</span>
            </div>
          )}
          {order.notes && (
            <div className="flex justify-between gap-3">
              <span className="text-neutral-500">یادداشت</span>
              <span className="text-left">{order.notes}</span>
            </div>
          )}
        </div>
      </Accordion>

      {/* ====== دکمه‌های عملیات ====== */}
      {order.status === 'PENDING' && (
        <div className="flex justify-end gap-2 pt-2">
          <CancelOrderButton orderId={order.id} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// CancelOrderButton
// ============================================================
function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCancel = async () => {
    if (!confirm('آیا از لغو این سفارش مطمئن هستید؟')) return;

    setIsLoading(true);
    try {
      await axios.patch(`/api/orders/${orderId}`, {
        reason: 'لغو توسط کاربر',
      });
      window.location.reload();
    } catch (err) {
      alert('خطا در لغو سفارش');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="text-sm text-red-500 hover:text-red-600 border border-red-500 rounded-full px-4 py-1.5 disabled:opacity-50"
    >
      {isLoading ? 'در حال لغو...' : 'لغو سفارش'}
    </button>
  );
}
