// components/admin/commentsManager.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import ImageCom from '@/components/ui/Image';
import { IoSearchOutline, IoTrashOutline } from 'react-icons/io5';
import moment from 'moment-jalaali';

moment.loadPersian({ usePersianDigits: true });

export default function CommentsManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [targetType, setTargetType] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments', page, debouncedSearch, targetType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (targetType) params.set('targetType', targetType);

      const res = await axios.get(`/api/admin/comments?${params}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/admin/comments?id=${id}`),
    onSuccess: () => {
      toast.success('کامنت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
    },
    onError: () => toast.error('خطا در حذف کامنت'),
  });

  return (
    <div className="space-y-6">
      {/* فیلترها */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در کامنت‌ها..."
            className="w-full bg-lcard dark:bg-dcard rounded-full py-2 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>

        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="bg-lcard dark:bg-dcard rounded-full px-4 py-2 text-sm outline-none"
        >
          <option value="">همه</option>
          <option value="post">مقالات</option>
          <option value="product">محصولات</option>
        </select>
      </div>

      {/* لیست */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-lcard dark:bg-dcard rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.comments.map((comment: any) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border-2 border-lcard dark:border-dcard"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3 flex-1 min-w-0">
                  {comment.user?.image ? (
                    <ImageCom
                      src={comment.user.image}
                      alt={comment.user.name || ''}
                      className="w-10 h-10 rounded-xl flex-none"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-redorange to-yellow flex-none" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.user?.displayName || comment.user?.name || 'ناشناس'}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {moment(comment.createdAt).fromNow()}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-lcard dark:bg-dcard">
                        {comment.targetType === 'post' ? 'مقاله' : 'محصول'}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-line break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('آیا از حذف این کامنت مطمئن هستید؟')) {
                      deleteMutation.mutate(comment.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 flex-none"
                  aria-label="حذف"
                >
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-lcard dark:bg-dcard disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-4 py-2 text-sm">
            {page} از {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 rounded-lg bg-lcard dark:bg-dcard disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}