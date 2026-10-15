// components/admin/usersManager.tsx
'use client';

import React, { useState } from 'react';
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
  IoCheckmarkCircle,
  IoCloseCircle,
  IoShieldCheckmark,
  IoPersonOutline,
} from 'react-icons/io5';
import moment from 'moment-jalaali';

moment.loadPersian({ usePersianDigits: true });

// ============================================================
// Tabs
// ============================================================
const ROLE_TABS = [
  { key: '', label: 'همه', icon: IoPersonOutline },
  { key: 'user', label: 'کاربر عادی' },
  { key: 'admin', label: 'ادمین', icon: IoShieldCheckmark },
  { key: 'moderator', label: 'ناظر' },
];

const STATUS_TABS = [
  { key: '', label: 'همه' },
  { key: 'active', label: 'فعال' },
  { key: 'inactive', label: 'غیرفعال' },
  { key: 'banned', label: 'مسدود' },
];

const VALID_ROLES = ['user', 'admin', 'moderator'];
const VALID_STATUSES = ['active', 'inactive', 'banned'];

// ============================================================
// Component
// ============================================================
export default function UsersManager() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [verified, setVerified] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // ====== Query ======
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-users', page, debouncedSearch, role, status, verified],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (role) params.set('role', role);
      if (status) params.set('status', status);
      if (verified) params.set('verified', verified);

      const res = await axios.get(`/api/admin/users?${params}`);
      return res.data;
    },
    placeholderData: (prev: any) => prev,
  });

  // ====== Update ======
  const updateMutation = useMutation({
    mutationFn: (payload: { userId: string; role?: string; status?: string }) =>
      axios.patch('/api/admin/users', payload),
    onSuccess: () => {
      toast.success('اطلاعات کاربر تغییر کرد');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.error || 'خطا در تغییر'),
  });

  // ====== Delete ======
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/admin/users?id=${id}`),
    onSuccess: () => {
      toast.success('کاربر حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.error || 'خطا در حذف'),
  });

  // ====== Reset ======
  const handleReset = () => {
    setSearch('');
    setRole('');
    setStatus('');
    setVerified('');
    setPage(1);
  };

  const hasActiveFilters = search || role || status || verified;

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
              placeholder="جستجو در نام، ایمیل، تلفن..."
              className="w-full bg-lcard dark:bg-dcard rounded-full py-2 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>

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

        {/* Tabs - نقش */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ROLE_TABS.map((tab) => {
            const isActive = role === tab.key;
            const Icon = (tab as any).icon;
            const count = data?.roleCounts
              ? tab.key === ''
                ? Object.values(data.roleCounts).reduce(
                    (a: any, b: any) => a + b,
                    0
                  )
                : data.roleCounts[tab.key] || 0
              : 0;

            return (
              <button
                key={tab.key || 'all-roles'}
                onClick={() => {
                  setRole(tab.key);
                  setPage(1);
                }}
                className={`
                  flex items-center gap-2 px-4 py-1.5 rounded-full text-xs whitespace-nowrap
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
                  }
                `}
              >
                {Icon && <Icon />}
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`
                      text-[10px] px-1.5 rounded-full
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

        {/* Tabs - وضعیت + تایید */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => {
            const isActive = status === tab.key;
            const count = data?.statusCounts
              ? tab.key === ''
                ? Object.values(data.statusCounts).reduce(
                    (a: any, b: any) => a + b,
                    0
                  )
                : data.statusCounts[tab.key] || 0
              : 0;

            return (
              <button
                key={`status-${tab.key || 'all'}`}
                onClick={() => {
                  setStatus(tab.key);
                  setPage(1);
                }}
                className={`
                  px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
                  ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
                  }
                `}
              >
                {tab.label}
                {count > 0 && <span className="mr-1 text-[10px]">({count})</span>}
              </button>
            );
          })}

          <span className="w-px bg-lcard dark:bg-dcard mx-1" />

          <button
            onClick={() => {
              setVerified(verified === 'true' ? '' : 'true');
              setPage(1);
            }}
            className={`
              px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
              ${
                verified === 'true'
                  ? 'bg-green-500 text-white'
                  : 'bg-lcard dark:bg-dcard hover:bg-black/10'
              }
            `}
          >
            ✓ تایید شده
          </button>

          <button
            onClick={() => {
              setVerified(verified === 'false' ? '' : 'false');
              setPage(1);
            }}
            className={`
              px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
              ${
                verified === 'false'
                  ? 'bg-orange-500 text-white'
                  : 'bg-lcard dark:bg-dcard hover:bg-black/10'
              }
            `}
          >
            ✗ تایید نشده
          </button>
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
                className="h-24 bg-lcard dark:bg-dcard rounded-2xl animate-pulse"
              />
            ))}
        </div>
      ) : data?.users?.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-6xl">👥</div>
          <p className="text-lg text-neutral-500">کاربری یافت نشد</p>
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
        <div
          className={`space-y-3 transition-opacity ${
            isFetching ? 'opacity-50' : ''
          }`}
        >
          {data?.users.map((user: any) => (
            <UserRow
              key={user.id}
              user={user}
              isEditing={editingUserId === user.id}
              onEdit={() =>
                setEditingUserId(editingUserId === user.id ? null : user.id)
              }
              onUpdate={(payload) =>
                updateMutation.mutate({ userId: user.id, ...payload })
              }
              onDelete={() => {
                if (confirm(`آیا از حذف "${user.displayName || user.name}" مطمئن هستید؟`)) {
                  deleteMutation.mutate(user.id);
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
// UserRow
// ============================================================
interface UserRowProps {
  user: any;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (payload: { role?: string; status?: string }) => void;
  onDelete: () => void;
  isPending: boolean;
  isDeleting: boolean;
}

function UserRow({
  user,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  isPending,
  isDeleting,
}: UserRowProps) {
  const formattedDate = moment(user.createdAt).locale('fa').format('jYYYY/jMM/jDD');

  // نقش
  const roleInfo = {
    admin: { label: 'ادمین', color: 'text-purple-500 bg-purple-500/10' },
    moderator: { label: 'ناظر', color: 'text-blue-500 bg-blue-500/10' },
    user: { label: 'کاربر', color: 'text-neutral-500 bg-neutral-500/10' },
  }[user.role as string] || { label: user.role, color: 'text-neutral-500' };

  // وضعیت
  const statusInfo = {
    active: { label: 'فعال', color: 'text-green-500 bg-green-500/10' },
    inactive: { label: 'غیرفعال', color: 'text-orange-500 bg-orange-500/10' },
    banned: { label: 'مسدود', color: 'text-red-500 bg-red-500/10' },
  }[user.status as string] || { label: user.status, color: 'text-neutral-500' };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-lcard dark:border-dcard overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap justify-between gap-3">
          {/* اطلاعات کاربر */}
          <div className="flex gap-3 flex-1 min-w-0">
            {user.image ? (
              <ImageCom
                src={user.image}
                alt={user.name}
                className="w-12 h-12 rounded-xl flex-none"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-redorange to-yellow flex-none" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium truncate">
                  {user.displayName || user.name}
                </span>
                {/* نقش */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${roleInfo.color}`}
                >
                  {roleInfo.label}
                </span>
                {/* وضعیت */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                {/* تایید ایمیل */}
                {user.emailVerified ? (
                  <IoCheckmarkCircle
                    className="text-green-500"
                    title="ایمیل تایید شده"
                  />
                ) : (
                  <IoCloseCircle
                    className="text-orange-500"
                    title="ایمیل تایید نشده"
                  />
                )}
              </div>

              <div className="text-xs text-neutral-500 flex items-center gap-2 flex-wrap">
                <span dir="ltr" className="truncate">
                  {user.email}
                </span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <span dir="ltr">{user.phone}</span>
                  </>
                )}
                <span>•</span>
                <span>عضویت: {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* آمار + عملیات */}
          <div className="flex items-center gap-2 flex-none">
            <div className="text-left text-xs space-y-1">
              <div>
                <span className="font-bold">{user._count.orders}</span>{' '}
                <span className="text-neutral-500">سفارش</span>
              </div>
              <div>
                <span className="font-bold">{user._count.comments}</span>{' '}
                <span className="text-neutral-500">کامنت</span>
              </div>
            </div>

            <button
              onClick={onEdit}
              className={`
                p-2 rounded-lg transition-colors
                ${
                  isEditing
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-lcard dark:bg-dcard hover:bg-black/10 dark:hover:bg-white/10'
                }
              `}
              title="عملیات"
            >
              <IoChevronDown
                className={`transition-transform ${
                  isEditing ? 'rotate-180' : ''
                }`}
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
      </div>

      {/* ====== پنل عملیات ====== */}
      {isEditing && (
        <div className="border-t-2 border-lcard dark:border-dcard p-4 bg-lcard/50 dark:bg-dcard/50 space-y-3">
          {/* تغییر نقش */}
          <div>
            <p className="text-xs text-neutral-500 mb-2">نقش کاربر:</p>
            <div className="flex flex-wrap gap-2">
              {VALID_ROLES.map((r) => {
                const isCurrent = user.role === r;
                const labels: any = {
                  user: 'کاربر',
                  admin: 'ادمین',
                  moderator: 'ناظر',
                };
                return (
                  <button
                    key={r}
                    onClick={() => !isCurrent && onUpdate({ role: r })}
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
                    {labels[r]}
                    {isCurrent && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* تغییر وضعیت */}
          <div>
            <p className="text-xs text-neutral-500 mb-2">وضعیت حساب:</p>
            <div className="flex flex-wrap gap-2">
              {VALID_STATUSES.map((s) => {
                const isCurrent = user.status === s;
                const labels: any = {
                  active: 'فعال',
                  inactive: 'غیرفعال',
                  banned: 'مسدود',
                };
                return (
                  <button
                    key={s}
                    onClick={() => !isCurrent && onUpdate({ status: s })}
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
                    {labels[s]}
                    {isCurrent && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}