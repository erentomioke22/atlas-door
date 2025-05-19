import React, { useState } from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import LoadingIcon from "@components/ui/loading/loadingIcon";
import { useEffect } from "react";
import Notification from "./notification";
import axios from "axios";
import { toast } from "sonner";
import LoadingNotifications from "./ui/loading/loadingNotifications";
import Dropdown from "./ui/dropdown";

function Notifications() {
  const [onClose, setOnClose] = useState(true);
  const queryClient = useQueryClient();
  const queryKey = ["notifications"];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await axios.get(
        "/api/notifications",
        pageParam ? { searchParams: { cursor: pageParam } } : {}
      );
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  // console.log(data);

  const { mutate } = useMutation({
    mutationFn: () => axios.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read");
    },
  });

  const deleteMutate = useMutation({
    mutationFn: () => axios.delete(`/api/notifications`),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Notifications Deleted");
    },
    onError(error, variables, context) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to create team. Please try again.");
      }
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  return (
    <Dropdown
      title={
        <>
          <IoNotificationsSharp
            className={`${
              data?.pages[0]?.unreadCount > 0 && "text-redorange animate-pulse"
            }`}
          />{" "}
        </>
      }
      btnStyle={`bg-lcard hover:bg-lbtn rounded-full px-3 py-1 duration-500 dark:bg-dcard dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn`}
      className={"-right-10 px-3 w-[22rem] max-h-96 overflow-y-scroll"}
      // position={"top-0 right-0"} size={"h-screen w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={onClose}
    >
      <div className="flex justify-between mb-5">
        {status === "success" && notifications.length > 0 && (
          <button
            onClick={() => {
              deleteMutate.mutate();
            }}
            className="  text-sm disabled:cursor-not-allowed"
            disabled={deleteMutate.isPending}
          >
            Delete All
          </button>
        )}
        <h1 className={" text-xl "}>Notifications</h1>
      </div>

      {status === "pending" && (
        <div className=" w-full px-3 space-y-3">
          {Array(7)
            .fill({})
            .map((_, index) => {
              return <LoadingNotifications key={index} />;
            })}
        </div>
      )}

      {status === "success" && !notifications.length && !hasNextPage && (
        <p className="text-center text-sm text-lfont">
          You don&apos;t have any notifications yet.
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-lfont">
          An error occurred while loading notifications.
        </p>
      )}
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        <div className=" divide-y-2 divide-lcard dark:divide-dcard">
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
        </div>
        {isFetchingNextPage && (
          <LoadingIcon color={"text-black fill-white mx-auto"} />
        )}
      </InfiniteScrollContainer>
    </Dropdown>
  );
}

export default Notifications;
