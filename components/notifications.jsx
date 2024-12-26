import React, { useState } from 'react'
import Offcanvas from './ui/offcanvas'
import { IoClose } from "react-icons/io5";
import { IoNotificationsSharp} from "react-icons/io5";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import {useInfiniteQuery,useMutation,useQueryClient,} from "@tanstack/react-query";
import LoadingSpinner from "@components/ui/loading/loadingSpinner";
import { useEffect } from "react";
import Notification from './notification';
import axios from "axios";
import {  toast } from 'sonner'
import LoadingNotifications from './ui/loading/loadingNotifications';

function Notifications() {
const[onClose,setOnClose]=useState(true)
const queryClient = useQueryClient();
const queryKey = ["notifications"]

  const {data,fetchNextPage,hasNextPage,isFetching,isFetchingNextPage,status,} = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async({ pageParam }) =>{
        const response = await axios.get("/api/notifications",pageParam ? { searchParams: { cursor: pageParam } } : {},);return response.data;},
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
//  console.log(data)

  const { mutate } = useMutation({
    mutationFn: () => axios.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  const  deleteMutate  = useMutation({
    mutationFn: () => axios.delete(`/api/notifications`),
    onSuccess: async () => {
      await queryClient.cancelQueries({queryKey});
      await queryClient.invalidateQueries({queryKey});
      toast.success("Notifications Deleted");
    },
    onError(error, variables, context) {
      if (error.response?.data?.error) { toast.error(error.response.data.error); } 
      else { toast.error("Failed to create team. Please try again."); }
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);



  const notifications = data?.pages.flatMap((page) => page.notifications) || [];



  return (
  <Offcanvas       
  title={<><IoNotificationsSharp  className={`text-lg  ${data?.pages[0]?.unreadCount > 0 && "text-redorange animate-pulse"}`}/> <span>Notifications</span></>}
  btnStyle={"py-2 w-full text-start px-3 flex justify-between rounded-lg  hover:text-purple hover:bg-lbtn dark:hover:bg-dbtn text-lfont duration-500"}
  position={"top-0 right-0"} size={"h-screen w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={onClose}>
  


<div className='flex justify-between'>
  <div>
    <button
      className={"bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-3 py-1 text-sm "}
      onClick={() => setOnClose(!onClose)}
    >
      <IoClose />
    </button>
  </div>
<div>
    <h1 className={" text-xl mb-5"}>
      Notifications
    </h1>
  </div>

</div>


  {status === "pending" && 
    <div className=" w-full px-3 space-y-3">
    {Array(7).fill({}).map((_,index)=>{
      return <LoadingNotifications key={index}/>         
    })}
   </div>
  }

  {status === "success" && !notifications.length && !hasNextPage && 
      <p className="text-center text-muted-foreground">
      You don&apos;t have any notifications yet.
     </p>
  }

  {status === "error" && 
    <p className="text-center text-destructive">
      An error occurred while loading notifications.
    </p>
  }
   <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification 
        key={notification.id} 
        notification={notification} />
      ))}
      {isFetchingNextPage && <LoadingSpinner color={"text-purple fill-white mx-auto"} />}
    </InfiniteScrollContainer>
      {status === "success" && notifications.length !== 0 && 
      <button 
      onClick={()=>{deleteMutate.mutate()}}
      className='bg-transparent border-2 border-black rounded-lg  w-full py-2 mt-2 mb-5 disabled:cursor-not-allowed' disabled={deleteMutate.isPending}>Delete All Notification</button>} 

  </Offcanvas>
  )
}
 
export default Notifications;