"use client";

import React, { useState, useEffect } from "react";
import InfiniteScrollContainer from "@components/InfiniteScrollContainer";
import { useInfiniteQuery, useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";
import OrderCard from "@components/products/orderCard";
import { formatPrice } from "@lib/utils";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoadingOrder from "@components/ui/loading/loadingOrder";
import PaymentPanel from "@components/paymentPanel";
import Link from 'next/link';
import ImageCom from '@components/ui/Image';
import Accordion from "@components/ui/Accordion";
import { FaUserPlus } from "react-icons/fa";
import { IoPencil,IoClose } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import moment from "moment";
import { PiHeartFill } from "react-icons/pi";
import { FaUserGroup } from "react-icons/fa6";
import { FaCreditCard ,FaArrowUp  } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaTruckFast } from "react-icons/fa6";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaForwardStep } from "react-icons/fa6";

export default function page() {

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
  
  
  
  
  
  
  const orderTypeMap = {
    PENDING: {
      message: (
          <span className="text-yellow">در حال پردازش</span>
      ),
      icon: <FaForwardStep className="text-[14px]  text-yellow" />,
      chart:<div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full"><div className="w-1/4 bg-yellow h-full rounded-full"></div></div>
      // href: `/users/`,
    },
    PAID: {
      message: (
          <span className="text-blue">پرداخت شده</span>
      ),
      icon: <FaCreditCard className="text-[12px]  text-blue" />,
      chart:<div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full"><div className="w-2/4 bg-blue h-full rounded-full"></div></div>

      // href: `/posts/${notification.postId}`,
    },
    SHIPPED: {
      message: (
          <span className="text-lightgreen">ارسال شده</span>
      ),
      icon: <FaTruckFast className="text-[14px]  text-lightgreen" />,
      chart:<div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full"><div className="w-3/4 bg-lightgreen h-full rounded-full"></div></div>

      // href: `/posts/${notification.postId}`,
    },
    DELIVERED: {
      message: (
        <span className="text-green">تحويل داده شده</span>
      ),
      icon: <FaHandshakeSimple className="text-[14px] text-green" />,
      chart:<div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full"><div className="w-full bg-green h-full rounded-full"></div></div>

      // href: `/posts/${notification.postId}`,
    },
    CANCELLED: {
      message: (
        <span className="text-red">لغو شده</span>
      ),
      icon: <IoClose className="text-[14px] text-red" />,
      chart:<div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full"><div className="w-full bg-red h-full rounded-full"></div></div>

      // href: `/team/${notification.teamId}`,
    },
  };

  console.log(data);

  // const totalPrice = data?.orders?.reduce((sum, order) => {
  //   const quantity = order?.quantity || 1;
  //   return sum + (order.color?.price - (order.color?.price * order.color?.discount)/100* quantity);
  // }, 0) || 0;

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

{data?.orders.map((order) =>{
  const { message, icon ,chart } = orderTypeMap[order.status];
return(
                  <div className="  w-full   p-3 space-y-1   " key={order?.id}>
                   
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>{order?.paymentId && order.paymentDate ? 
                       <div className="flex gap-2 text-sm text-lightgreen">
                          <div className=" w-5 h-5 rounded-full"></div>
                          <FaCreditCard className="my-auto"/>
                          <p>پرداخت شده</p>
                        </div>
              
                       : 
                       <div>
                            <div className="  py-2">
                                {data?.orders.length > 0 && (
                                    <div className="text-sm sm:text-lg ">
                                      <p>مجموع</p>
                                      <p>{formatPrice(order?.total)} تومان</p>
                                    </div>
                                )}
                                </div>
                                <div className="flex gap-2 text-sm text-yellow">
                                <FaLocationDot className="my-auto"/>
                                <p>پرداخت در محل</p>
                           </div>
                        </div>
                       }
                       </div>

                       <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between">
                         <p>{message}</p>
                         <span>{icon}</span>
                        </div>
                         <div>{chart}</div>
                       </div>

                    </div>
                  <div className="divide-y divide-lbtn dark:divide-dbtn gap-2">
                   {order?.items.map((item)=>(
                    <div key={item.id} >
                  <div className='flex gap-2 py-3'>
                   {item?.product?.images[0] && 
                     <div className='relative  w-20 h-20  rounded-2xl '>
                   <ImageCom 
                    className={'object-cover  rounded-xl w-full'}
                    alt={item?.product?.name} 
                   //  src={product?.images[0].startsWith('https://') ?  `${product?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${product?.images[0]}`}
                    src={item?.product?.images[0]}
                    size={'h-36 md:h-40'} />
                   </div>
                    }
     
                <Link href={`/products/${item?.product.name}`} className='flex flex-col justify-between h-full space-y-1'>
                   
                   <div className="space-y-1 text-wrap">
                     <h1 className='text-wrap line-clamp-3  hover:underline duration-150 decoration-2'>{item?.product.name}</h1>
                   </div>
     
                   <div className='flex gap-2'>
                     <div className='h-5 w-5 rounded-md border border-lcard dark:border-dcard' style={{backgroundColor:item?.color?.hexCode}}></div>
                     <p className='text-sm'>{item?.color?.name} - تعداد : {item?.quantity} </p> 
                   </div>
     
                   {/* <div>
                     <p className='text-sm'>  قیمت هر واحد {formatPrice(item?.color?.price)}</p>
                   </div> */}
                     <div>
                           {item.price && <h1>{formatPrice(item?.price - (item?.price * item?.color.discount)/100* item?.quantity)} تومان</h1>}
                     </div>
                </Link>
     
             
     
                   </div>
                    </div>
                   )
                   )}
                  </div>
     

      <Accordion menuStyle={"p-4  text-sm bg-lcard mt-2 rounded-xl"} btnStyle={" bg-lcard rounded-xl"} title="مشخصات دريافت كننده">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between truncate">
          <p>نام و نام خانوادگي</p>
          <p>{order?.recipient}</p> 
        </div>
        <div className="flex justify-between truncate">
          <p>شماره تماس</p>
          <p>{order?.phone}</p>
        </div>
        <div className="flex justify-between truncate">
          <p>آدرس</p>
          <p>{order?.address}</p>
        </div>
      </div>
      </Accordion>
               </div>
          )})}



    </div>

        {/* {isFetchingNextPage && (
          <LoadingIcon color={"bg-white dark:bg-black"} />
        )}
      </InfiniteScrollContainer> */}
    </div>
  );
}
