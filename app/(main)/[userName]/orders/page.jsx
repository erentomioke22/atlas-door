"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "@components/ui/loading/loadingCard";
import InfiniteScrollContainer from "@components/InfiniteScrollContainer";
import { useInfiniteQuery, useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";
import OrderCard from "@components/products/orderCard";
import { useSession } from 'next-auth/react';
import { formatPrice } from "@lib/utils";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';





export default function page() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data,
    // fetchNextPage,
    // hasNextPage,
    isFetching,
    // isFetchingNextPage,
    status,
  } = useQuery({
    queryKey: ["product-feed", "orders"],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get("/api/product/orders");
      return response.data;
    },
    // initialPageParam: null,
    // getNextPageParam: (lastPage) => lastPage.nextCursor,
  });



  
  // ... existing code ...

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/payment');
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error('Failed to initialize payment');
      }
    },
    onError: (error) => {
      toast.error('Payment failed. Please try again.');
    }
  });


  // const orders = data?.pages.flatMap((page) => page.orders) || [];

  console.log(data?.orders);

  const totalPrice = data?.orders?.reduce((sum, order) => {
    const quantity = order.product?.cartItems?.find(
      (cartItem) => cartItem.userId === session?.user?.id
    )?.quantity || 1;
    return sum + (order.product?.price * quantity);
  }, 0) || 0;

  return (
    <div>
      {status === "error" && (
        <p className="text-center text-lfont ">
          An error occurred while loading products.
        </p>
      )}

      {status === "success" && !data?.orders.length &&  (
        <p className="text-center text-lfont ">
          No one has producted anything yet.
        </p>
      )}

      {/* <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      > */}
        <div className="w-full px-5 sm:w-2/3 md:w-2/3 space-y-5 mx-auto pb-5 border-b-2 border-lfont items-center mt-20">
          {status === "pending" &&
            Array(3)
              .fill({})
              .map(() => {
                return <LoadingPage />;
              })}

          {data?.orders.map((order) => (
              <OrderCard order={order?.product} key={order?.id} />
          ))}
        </div>

        {data?.orders.length > 0 && (
          <div className="flex justify-end mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold">
              Total: {formatPrice(totalPrice)} 
            </div>
          </div>
        )}


<button
            onClick={()=>{paymentMutation.mutate()}}
            disabled={paymentMutation.isPending}
            className={`px-6 py-2 rounded-lg transition-colors ${
              paymentMutation.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {paymentMutation.isPending ? 'Processing...' : 'Pay Now'}
          </button>
        {/* {isFetchingNextPage && (
          <LoadingIcon color={"bg-white dark:bg-black"} />
        )}
      </InfiniteScrollContainer> */}
    </div>
  );
}
// import { auth } from "@auth";
// import { notFound } from "next/navigation";
// import {  getUserDataSelect } from "@/lib/types";
// import { prisma } from "@utils/database";
// import List from "@components/ui/list";
// import { getUser } from "../(profile)/layout";


// export async function generateMetadata({ params }) {
//   try{
//     const {userName} = await params;
//     const  session  = await auth();
//     if (!session) return {};
//     const user = await getUser(userName, session?.user.id);

//     return {
//       metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${user.name}`),
//       title: `Bookmarks - ${user?.displayName !== null && user?.displayName} (@${user?.name})`,
//       // title : {
//       //   default:`${user?.displayName !== null && user?.displayName} (@${user?.name})`,
//       //   template:`%s - ${user?.displayName !== null && user?.displayName}`
//       // },
//       description: `${user?.bio}`,
//       keywords: `${user?.skills?.map((skill) => `${skill}`)}`,
//       twitter: {
//         card: 'summary_large_image',
//         title: `${user.title}`,
//         description: `${user?.bio}`,
//       },
//       openGraph: {
//         title: `${user?.displayName !== null && user?.displayName} (@${user?.name})`,
//         description: `${user?.bio}`,
//         type: 'website',
//         locale: 'en_US',
//         url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${user?.title}`,
//         siteName: 'trader comunity',
//         images: [
//           {
//             url: `${process.env.NEXT_PUBLIC_BASE_URL}/${user?.image}`,
//             width: 800,
//             height: 600,
//             alt: user?.displayName,
//           },
//         ],
//       },
//     };

//   }
//   catch(error){
//     console.error('Error fetching user metadata:', error); 
//     return {}; 
//   }
// }

// export default async function userProfile({ params }) {
//   const  session  = await auth();
//   const  {userName}  = await params;


//   if (!session) return {};
// const user = await getUser(userName,session?.user.id)

//    return (
//     <List apiUrl={`users/${user?.id}/posts/bookmarked`} className={"w-full  flex flex-wrap justify-center  gap-3"} postCount={6} draft={true}/>
//    );
// }

// ... existing imports ...
