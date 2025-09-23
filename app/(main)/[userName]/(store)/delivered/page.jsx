"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatPriceFa } from "@lib/utils";
import LoadingOrder from "@components/ui/loading/loadingOrder";
import Link from "next/link";
import ImageCom from "@components/ui/Image";
import Accordion from "@components/ui/Accordion";
import { IoClose } from "react-icons/io5";
import { FaCreditCard } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaTruckFast } from "react-icons/fa6";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaForwardStep } from "react-icons/fa6";
import { usePathname, useParams, notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function page() {
  const path = usePathname();
  const router = useRouter();
  const { userName } = useParams();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    if (session?.user?.name && userName && session.user.name !== userName) {
      router.replace(`/${session.user.name}/delivered`);
    }
  }, [session, userName, router]);

  const {
    data,
    // fetchNextPage,
    // hasNextPage,
    // isFetching,
    // isFetchingNextPage,
    status,
    error,
  } = useQuery({
    queryKey: ["product-feed", "delivered"],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get("/api/product/delivered");
      return response.data;
    },
    enabled:
      sessionStatus === "authenticated" && session?.user?.name === userName,
    // initialPageParam: null,
    // getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "success" && data?.orders.length <= 0) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        تاکنون سفارشی تحویل نگرفته اید !
      </p>
    );
  }

  if (status === "error" || data?.error || error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        مشکلی در برقراری ارتباط وجود دارد
      </p>
    );
  }

  const orderTypeMap = {
    PENDING: {
      message: <span className="text-yellow">در حال پردازش</span>,
      icon: <FaForwardStep className="text-[14px]  text-yellow" />,
      chart: (
        <div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full">
          <div className="w-1/4 bg-yellow h-full rounded-full"></div>
        </div>
      ),
      // href: `/users/`,
    },
    PAID: {
      message: <span className="text-blue">پرداخت شده</span>,
      icon: <FaCreditCard className="text-[12px]  text-blue" />,
      chart: (
        <div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full">
          <div className="w-2/4 bg-blue h-full rounded-full"></div>
        </div>
      ),

      // href: `/posts/${notification.postId}`,
    },
    SHIPPED: {
      message: <span className="text-lightgreen">ارسال شده</span>,
      icon: <FaTruckFast className="text-[14px]  text-lightgreen" />,
      chart: (
        <div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full">
          <div className="w-3/4 bg-lightgreen h-full rounded-full"></div>
        </div>
      ),

      // href: `/posts/${notification.postId}`,
    },
    DELIVERED: {
      message: <span className="text-green">تحويل داده شده</span>,
      icon: <FaHandshakeSimple className="text-[14px] text-green" />,
      chart: (
        <div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full">
          <div className="w-full bg-green h-full rounded-full"></div>
        </div>
      ),

      // href: `/posts/${notification.postId}`,
    },
    CANCELLED: {
      message: <span className="text-red">لغو شده</span>,
      icon: <IoClose className="text-[14px] text-red" />,
      chart: (
        <div className="bg-lcard dark:bg-dcard rounded-full w-36 h-3 max-w-full">
          <div className="w-full bg-red h-full rounded-full"></div>
        </div>
      ),

      // href: `/team/${notification.teamId}`,
    },
  };

  if (sessionStatus !== "loading" && !session) {
    notFound();
  }

  if (
    sessionStatus === "authenticated" &&
    session &&
    userName &&
    session.user.name !== userName
  ) {
    return null;
  }

  return (
    <div className="w-full   space-y-5 mx-auto pb-5  items-center mt-20 divide-y-2 divide-lcard dark:divide-dcard py-2">
      {status === "pending" &&
        Array(3)
          .fill({})
          .map((_, index) => {
            return <LoadingOrder key={index} />;
          })}

      {data?.orders.map((order) => {
        const { message, icon, chart } = orderTypeMap[order.status];
        return (
          <div className="  w-full   p-3 space-y-1   " key={order?.id}>
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="text-xs text-lfont">
                  شناسه سفارش: {order?.orderCode}
                </div>

                <div>
                  {order?.paymentId && order.paymentDate ? (
                    <div className="flex gap-2 text-sm text-lightgreen">
                      <div className=" w-5 h-5 rounded-full"></div>
                      <FaCreditCard className="my-auto" />
                      <p>پرداخت شده</p>
                    </div>
                  ) : (
                    <div>
                      <div className="  py-2">
                        {data?.orders.length > 0 && (
                          <div className="text-sm sm:text-lg ">
                            <p>مجموع</p>
                            <p>{formatPriceFa(order?.total)} تومان</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 text-sm text-green">
                        <FaLocationDot className="my-auto" />
                        <p>پرداخت در محل</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <p>{message}</p>
                  <span className="my-auto">{icon}</span>
                </div>
                <div>{chart}</div>
              </div>
            </div>
            <div className="divide-y divide-dashed divide-lcard dark:divide-dcard gap-2">
              {order?.items.map((item) => (
                <div key={item.id}>
                  <div className="flex gap-2 py-3">
                    {item?.product?.images[0] && (
                      <div className="relative  w-20 h-20  rounded-2xl ">
                        <ImageCom
                          className={"object-cover  rounded-xl w-full"}
                          alt={item?.product?.name}
                          src={item?.product?.images[0]}
                          size={"h-36 md:h-40"}
                        />
                      </div>
                    )}

                    <Link
                      href={`/products/${item?.product.name}`}
                      className="flex flex-col justify-between h-full space-y-1"
                    >
                      <div className="space-y-1 text-wrap">
                        <h1 className="text-wrap line-clamp-3  hover:underline duration-150 decoration-2">
                          {item?.product.name}
                        </h1>
                      </div>

                      <div className="flex gap-2">
                        <div
                          className="h-5 w-5 rounded-md border border-lcard dark:border-dcard"
                          style={{ backgroundColor: item?.color?.hexCode }}
                        ></div>
                        <p className="text-sm">
                          {item?.color?.name} - تعداد : {item?.quantity}{" "}
                        </p>
                      </div>

                      {/* <div>
                     <p className='text-sm'>  قیمت هر واحد {formatPriceFa(item?.color?.price)}</p>
                   </div> */}
                      <div>
                        {item.price && (
                          <h1>{formatPriceFa(item?.price)} تومان</h1>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Accordion
              menuStyle={"p-4  text-sm bg-lcard mt-2 rounded-xl"}
              btnStyle={" bg-lcard rounded-xl"}
              title="مشخصات دريافت كننده"
            >
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
        );
      })}
    </div>
  );
}
