import React from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Notification, { NotificationItem } from "./notification";
import axios from "axios";
import { toast } from "sonner";
import LoadingNotifications from "./ui/loading/loadingNotifications";
import DropDrawer from "./ui/dropdrawer";

interface NotificationsPage {
  notifications: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
}

function Notifications() {
  const queryClient = useQueryClient();
  const queryKey = ["notifications"] as const;

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
      const response = await axios.get<NotificationsPage>("/api/notifications", pageParam ? { params: { cursor: pageParam } } : {});
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { mutate } = useMutation({
    mutationFn: () => axios.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], { unreadCount: 0 });
    },
    onError: (error) => {
      console.error("Failed to mark notifications as read", error);
    },
  });

  const deleteMutate = useMutation({
    mutationFn: () => axios.delete(`/api/notifications`),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey });
      toast.success("پیام ها با موفقیت حذف شدند");
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("مشکلی در برقراری ارتباط وجود دارد");
      }
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  return (
    <DropDrawer
      title={<IoNotificationsSharp className={(data?.pages[0]?.unreadCount ?? 0) > 0 ? "text-redorange animate-pulse" : ""}  />}
      btnStyle={`  bg-lcard dark:bg-dcard dark:text-white text-lg p-2  rounded-lg text-black`}
      className={"-right-12 px-3 w-88 max-h-96 overflow-y-scroll"}
    >
      <div className="flex justify-between mb-5">
        <h1 className={" text-xl "}>پيام ها</h1>
        {status === "success" && notifications.length > 0 && (
          <button
            onClick={() => deleteMutate.mutate()}
            className="  text-sm disabled:cursor-not-allowed bg-lcard dark:bg-dcard disabled:bg-lbtn dark:disabled:bg-dbtn px-2 py-2 rounded-lg"
            disabled={deleteMutate.isPending}
          >
            حذف همه 
          </button>
        )}
      </div>

      <InfiniteScrollContainer onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        <div className=" divide-y-2 divide-lcard dark:divide-dcard">
          {status === "pending" && (
            <div className=" w-full space-y-5">
              {Array(5).fill({}).map((_, index) => <LoadingNotifications key={index} />)}
            </div>
          )}

          {status === "success" && !notifications.length && !hasNextPage && (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-300"> پيام جديدی نداريد .</p>
          )}

          {status === "error" && (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-300"> مشكلی در برقراری ارتباط وجود دارد</p>
          )}

          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}

          {isFetchingNextPage && Array(3).fill({}).map((_, index) => <LoadingNotifications key={index} />)}
        </div>
      </InfiniteScrollContainer>
    </DropDrawer>
  );
}

export default Notifications;