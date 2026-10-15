// components/admin/ordersManager.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import ImageCom from '@/components/ui/Image';
import {
  IoSearchOutline,
  IoTrashOutline,
  IoChevronDown,
  IoClose,
  IoCalendarOutline,
} from 'react-icons/io5';
import moment from 'moment-jalaali';
import { ORDER_STATUS_MAP } from '@/lib/types';
import type { OrderStatus } from '@prisma/client';

moment.loadPersian({ usePersianDigits: true });

// ============================================================
// Tabs
// ============================================================
const TABS: Array<{ key: string; label: string; statuses: OrderStatus[] }> = [
  { key: 'ALL', label: 'همه', statuses: [] },
  { key: 'PENDING', label: 'در انتظار', statuses: ['PENDING'] },
  { key: 'PAID', label: 'پرداخت شده', statuses: ['PAID', 'PROCESSING'] },
  { key: 'SENT_TO_FACTORY', label: 'ارسال به کارخانه', statuses: ['SENT_TO_FACTORY'] },
  { key: 'IN_PRODUCTION', label: 'در حال تولید', statuses: ['IN_PRODUCTION'] },
  { key: 'READY', label: 'آماده تحویل', statuses: ['READY'] },
  { key: 'SHIPPED', label: 'ارسال شده', statuses: ['SHIPPED'] },
  { key: 'DELIVERED', label: 'تحویل داده شده', statuses: ['DELIVERED'] },
  { key: 'CANCELLED', label: 'لغو شده', statuses: ['CANCELLED'] },
];

// ============================================================
// Component
// ============================================================
export default function OrdersManager() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // ====== Query ======
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-orders', page, debouncedSearch, status, fromDate, toDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        status,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);

      const res = await axios.get(`/api/admin/orders?${params}`);
      return res.data;
    },
    placeholderData: (prev: any) => prev,
  });

  // ====== Update Status ======
  const updateMutation = useMutation({
    mutationFn: (payload: { orderId: string; status: OrderStatus }) =>
      axios.patch('/api/admin/orders', payload),
    onSuccess: () => {
      toast.success('وضعیت سفارش تغییر کرد');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setEditingOrderId(null);
    },
    onError: () => toast.error('خطا در تغییر وضعیت'),
  });

  // ====== Delete ======
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/admin/orders?id=${id}`),
    onSuccess: () => {
      toast.success('سفارش حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => toast.error('خطا در حذف سفارش'),
  });

  // ====== Reset ======
  const handleReset = () => {
    setSearch('');
    setStatus('ALL');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasActiveFilters =
    search || status !== 'ALL' || fromDate || toDate;

  return (
    <div className="space-y-6">
      {/* ====== فیلترها ====== */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {/* جستجو */}
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="جستجو در شناسه سفارش، نام، تلفن..."
              className="w-full bg-lcard dark:bg-dcard rounded-full py-2 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* دکمه فیلتر تاریخ */}
          <button
            onClick={() => setShowDateFilter((p) => !p)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors
              ${
                fromDate || toDate
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
              }
            `}
          >
            <IoCalendarOutline />
            <span>فیلتر تاریخ</span>
            {(fromDate || toDate) && (
              <span className="text-xs">●</span>
            )}
          </button>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <IoClose />
              <span>پاک کردن</span>
            </button>
          )}
        </div>

        {/* فیلتر تاریخ */}
        {showDateFilter && (
          <div className="flex flex-wrap gap-3 p-3 bg-lcard dark:bg-dcard rounded-2xl">
            <div className="flex items-center gap-2">
              <label className="text-sm whitespace-nowrap">از:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="bg-white dark:bg-neutral-900 rounded-lg px-3 py-1.5 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm whitespace-nowrap">تا:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="bg-white dark:bg-neutral-900 rounded-lg px-3 py-1.5 text-sm outline-none"
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const isActive = status === tab.key;
            const count = data?.statusCounts
              ? tab.key === 'ALL'
                ? Object.values(data.statusCounts).reduce(
                    (a: any, b: any) => a + b,
                    0
                  )
                : tab.statuses.reduce(
                    (sum, s) => sum + (data.statusCounts[s] || 0),
                    0
                  )
              : 0;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setStatus(tab.key);
                  setPage(1);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
                  }
                `}
              >
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
      </div>

      {/* ====== لیست ====== */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-32 bg-lcard dark:bg-dcard rounded-2xl animate-pulse"
              />
            ))}
        </div>
      ) : data?.orders?.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-6xl">📦</div>
          <p className="text-lg text-neutral-500">سفارشی یافت نشد</p>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-blue-500 hover:underline text-sm"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      ) : (
        <div className={`space-y-3 transition-opacity ${isFetching ? 'opacity-50' : ''}`}>
          {data?.orders.map((order: any) => (
            <OrderRow
              key={order.id}
              order={order}
              isEditing={editingOrderId === order.id}
              onEdit={() =>
                setEditingOrderId(
                  editingOrderId === order.id ? null : order.id
                )
              }
              onStatusChange={(newStatus) =>
                updateMutation.mutate({ orderId: order.id, status: newStatus })
              }
              onDelete={() => {
                if (confirm('آیا از حذف این سفارش مطمئن هستید؟')) {
                  deleteMutation.mutate(order.id);
                }
              }}
              isPending={updateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* ====== Pagination ====== */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-lcard dark:bg-dcard disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            قبلی
          </button>
          <span className="px-4 py-2 text-sm text-neutral-500">
            صفحه {page} از {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 rounded-lg bg-lcard dark:bg-dcard disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// OrderRow — یک ردیف سفارش
// ============================================================
interface OrderRowProps {
  order: any;
  isEditing: boolean;
  onEdit: () => void;
  onStatusChange: (status: OrderStatus) => void;
  onDelete: () => void;
  isPending: boolean;
  isDeleting: boolean;
}

function OrderRow({
  order,
  isEditing,
  onEdit,
  onStatusChange,
  onDelete,
  isPending,
  isDeleting,
}: OrderRowProps) {
  const statusInfo = ORDER_STATUS_MAP[order.status as OrderStatus] || {
    label: order.status,
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-500',
    progress: 0,
  };

  const formattedDate = moment(order.createdAt)
    .locale('fa')
    .format('jYYYY/jMM/jDD - HH:mm');

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-lcard dark:border-dcard overflow-hidden">
      {/* ====== هدر ====== */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap justify-between gap-3">
          {/* شناسه + تاریخ + کاربر */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold">
                {order.orderCode}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color} bg-current/10`}>
                {statusInfo.label}
              </span>
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-2 flex-wrap">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>
                {order.user?.displayName || order.user?.name || 'مهمان'}
              </span>
              {order.user?.email && (
                <>
                  <span>•</span>
                  <span dir="ltr">{order.user.email}</span>
                </>
              )}
            </div>
          </div>

          {/* مبلغ + عملیات */}
          <div className="flex items-center gap-2 flex-none">
            <div className="text-left">
              <div className="text-sm font-bold">
                {order.total.toLocaleString('fa-IR')} تومان
              </div>
              <div className="text-xs text-neutral-500">
                {order.items.length} محصول
              </div>
            </div>
            <button
              onClick={onEdit}
              className={`
                p-2 rounded-lg transition-colors
                ${isEditing
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
                }
              `}
              title="تغییر وضعیت"
            >
              <IoChevronDown
                className={`transition-transform ${isEditing ? 'rotate-180' : ''}`}
              />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
              title="حذف"
            >
              <IoTrashOutline />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-lcard dark:bg-dcard rounded-full overflow-hidden">
          <div
            className={`h-full ${statusInfo.bgColor} transition-all duration-500`}
            style={{ width: `${statusInfo.progress}%` }}
          />
        </div>

        {/* محصولات خلاصه */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {order.items.slice(0, 5).map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-2 py-1 rounded-lg bg-lcard dark:bg-dcard flex-none"
              title={item.productName}
            >
              {item.productImage && (
                <ImageCom
                  src={item.productImage}
                  alt={item.productName || ''}
                  className="w-6 h-6 rounded"
                />
              )}
              <span className="text-xs truncate max-w-24">
                {item.productName}
              </span>
              <span className="text-xs text-neutral-500">×{item.quantity}</span>
            </div>
          ))}
          {order.items.length > 5 && (
            <span className="text-xs text-neutral-500 flex-none">
              +{order.items.length - 5} مورد
            </span>
          )}
        </div>
      </div>

      {/* ====== پنل تغییر وضعیت ====== */}
      {isEditing && (
        <div className="border-t-2 border-lcard dark:border-dcard p-4 bg-lcard/50 dark:bg-dcard/50">
          <p className="text-xs text-neutral-500 mb-2">تغییر وضعیت به:</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ORDER_STATUS_MAP) as OrderStatus[]).map((s) => {
              const info = ORDER_STATUS_MAP[s];
              const isCurrent = order.status === s;
              return (
                <button
                  key={s}
                  onClick={() => !isCurrent && onStatusChange(s)}
                  disabled={isPending || isCurrent}
                  className={`
                    px-3 py-1.5 rounded-full text-xs transition-all
                    ${
                      isCurrent
                        ? 'bg-black dark:bg-white text-white dark:text-black cursor-not-allowed'
                        : 'bg-white dark:bg-neutral-800 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50'
                    }
                  `}
                >
                  {info.label}
                  {isCurrent && ' ✓'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}