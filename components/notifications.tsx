// components/notifications.tsx
'use client';

import React, { useEffect } from 'react';
import { IoNotificationsSharp } from 'react-icons/io5';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Notification, { NotificationItem } from './notification';
import axios from 'axios';
import { toast } from 'sonner';
import LoadingNotifications from './ui/loading/loadingNotifications';
import DropDrawer from './ui/dropdrawer';

interface NotificationsPage {
  notifications: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
}

function Notifications() {
  const queryClient = useQueryClient();
  const queryKey = ['notifications'] as const;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<NotificationsPage>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await axios.get<NotificationsPage>('/api/notifications', {
        params: pageParam ? { cursor: pageParam } : {},
      });
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // ✅ Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: () => axios.patch('/api/notifications/mark-as-read'),
    onSuccess: () => {
      queryClient.setQueryData(['unread-notification-count'], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error('Failed to mark notifications as read', error);
    },
  });

  // ✅ Delete all
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete('/api/notifications'),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey });
      toast.success('پیام‌ها با موفقیت حذف شدند');
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('مشکلی در برقراری ارتباط وجود دارد');
      }
    },
  });

  // ✅ وقتی drawer باز شد، همه رو read کن
  useEffect(() => {
    if (status === 'success' && (data?.pages[0]?.unreadCount ?? 0) > 0) {
      markAsReadMutation.mutate();
    }
  }, [status, data?.pages, markAsReadMutation]);

  const notifications =
    data?.pages.flatMap((page) => page.notifications) || [];

  const unreadCount = data?.pages[0]?.unreadCount ?? 0;

  return (
    <DropDrawer
      title={
        <IoNotificationsSharp
          className={unreadCount > 0 ? 'text-redorange animate-pulse' : ''}
        />
      }
      btnStyle="bg-lcard dark:bg-dcard dark:text-white text-lg p-2 rounded-lg text-black relative"
      className="-right-12 px-3 w-88 max-h-96 overflow-y-scroll"
    >
      {/* ✅ Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-redorange text-white text-[10px] rounded-full min-w-5 h-5 flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      <div className="flex justify-between mb-5">
        <h1 className="text-xl">پیام‌ها</h1>
        {status === 'success' && notifications.length > 0 && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="text-sm disabled:cursor-not-allowed bg-lcard dark:bg-dcard disabled:bg-lbtn dark:disabled:bg-dbtn px-2 py-2 rounded-lg"
          >
            {deleteMutation.isPending ? 'در حال حذف...' : 'حذف همه'}
          </button>
        )}
      </div>

      <InfiniteScrollContainer
        onBottomReached={() =>
          hasNextPage && !isFetching && fetchNextPage()
        }
      >
        <div className="divide-y-2 divide-lcard dark:divide-dcard">
          {status === 'pending' && (
            <div className="w-full space-y-5">
              {Array(5)
                .fill({})
                .map((_, index) => (
                  <LoadingNotifications key={index} />
                ))}
            </div>
          )}

          {status === 'success' && !notifications.length && !hasNextPage && (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-300 py-10">
              پیام جدیدی ندارید.
            </p>
          )}

          {status === 'error' && (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-300 py-10">
              مشکلی در برقراری ارتباط وجود دارد
            </p>
          )}

          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}

          {isFetchingNextPage &&
            Array(3)
              .fill({})
              .map((_, index) => <LoadingNotifications key={index} />)}
        </div>
      </InfiniteScrollContainer>
    </DropDrawer>
  );
}

export default Notifications;