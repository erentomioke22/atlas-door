"use client";

import React from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import OrderCard from "@components/products/orderCard";
import { formatPrice } from "@lib/utils";
import LoadingOrder from "@components/ui/loading/loadingOrder";
import PaymentPanel from "@components/paymentPanel";




export default function page() {

  const {
    data,
    // fetchNextPage,
    // hasNextPage,
    // isFetching,
    // isFetchingNextPage,
    status,
  } = useQuery({
    queryKey: ["product-feed", "bag"],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get("/api/product/bag");
      return response.data;
    },
    // initialPageParam: null,
    // getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  


  






  const totalPrice = data?.orders?.reduce((sum, order) => {
    const quantity = order?.quantity || 1;
    return sum + (order.color?.price - (order.color?.price * order.color?.discount)/100* quantity);
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
        <div className="w-full px-5 sm:w-2/3 md:w-2/3 space-y-5 mx-auto pb-5  items-center mt-20 divide-y divide-lbtn dark:divide-dbtn py-2">
          {status === "pending" &&
            Array(3)
              .fill({})
              .map(() => {
                return <LoadingOrder />;
              })}

          {data?.orders.map((order) => (
              <OrderCard order={order} key={order?.id} />
          ))}
    <div className="  py-2">
      {data?.orders.length > 0 && (
          <div className="text-sm sm:text-lg flex justify-between">
            <p>مجموع</p>
            <p>{formatPrice(totalPrice)}</p>
          </div>
      )}
 {data?.orders.length >= 1 && status !== "pending" && 
     <PaymentPanel status={status}/>
 }
      </div>


    </div>

        {/* {isFetchingNextPage && (
          <LoadingIcon color={"bg-white dark:bg-black"} />
        )}
      </InfiniteScrollContainer> */}
    </div>
  );
}
