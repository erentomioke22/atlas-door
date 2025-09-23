"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { formatPriceFa } from "@lib/utils";
import { toast } from "sonner";
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
import { useSession } from "next-auth/react";
import Input from "@components/ui/input";
import useDebounce from "@hook/useDebounce";
import InfiniteScrollContainer from "@components/InfiniteScrollContainer";
import Dropdown from "@components/ui/dropdown";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { usePathname, useParams, notFound } from "next/navigation";
import { useRouter } from "next/navigation";

export default function page() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [dropdownCloseTick, setDropdownCloseTick] = useState(0);
  const { data: session, status: sessionStatus } = useSession();
  const path = usePathname();
  const router = useRouter();
  const { userName } = useParams();

  if (
    (sessionStatus !== "loading" && !session) ||
    session?.user?.role !== "admin"
  ) {
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["product-feed", "admin", debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get("/api/product/admin", {
        params: {
          ...(pageParam ? { cursor: pageParam } : {}),
          ...(debouncedSearch ? { q: debouncedSearch } : {}),
        },
      });
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
  });

  const queryClient = useQueryClient();

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await axios.patch("/api/product/update-order-status", {
        orderId,
        status,
      });
      return response.data;
    },
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries(["product-feed", "admin"]);

      const previous = queryClient.getQueryData([
        "product-feed",
        "admin",
        debouncedSearch,
      ]);

      queryClient.setQueryData(
        ["product-feed", "admin", debouncedSearch],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              orders: page.orders.map((order) =>
                order.id === orderId ? { ...order, status } : order
              ),
            })),
          };
        }
      );

      return { previous };
    },
    onError: (err, _newOrder, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["product-feed", "admin", debouncedSearch],
          context.previous
        );
      }
      toast.error(
        err?.response?.data?.error || "Failed to update order status"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["product-feed", "admin", debouncedSearch]);
    },
  });

  const orders = useMemo(
    () => data?.pages?.flatMap((p) => p.orders) ?? [],
    [data]
  );

  const deleteOrder = useMutation({
    mutationFn: async ({ orderId }) => {
      const res = await axios.delete(`/api/product/order/${orderId}`);
      return res.data;
    },
    onMutate: async ({ orderId }) => {
      await queryClient.cancelQueries({ queryKey: ["product-feed"] });
      const snapshot = queryClient.getQueriesData({
        queryKey: ["product-feed"],
      });

      // Remove from admin infinite lists
      queryClient.setQueriesData(
        { queryKey: ["product-feed", "admin"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              orders: page.orders.filter((o) => o.id !== orderId),
            })),
          };
        }
      );

      // Remove from user lists if present
      queryClient.setQueryData(["product-feed", "orders"], (old) => {
        if (!old?.orders) return old;
        return { ...old, orders: old.orders.filter((o) => o.id !== orderId) };
      });
      queryClient.setQueryData(["product-feed", "delivered"], (old) => {
        if (!old?.orders) return old;
        return { ...old, orders: old.orders.filter((o) => o.id !== orderId) };
      });

      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) {
        for (const [key, data] of ctx.snapshot) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("حذف سفارش ناموفق بود");
    },
    onSuccess: () => {
      toast.success("سفارش حذف شد");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product-feed"] });
    },
  });

  if (status === "error" || error) {
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

  return (
    <InfiniteScrollContainer
      className={""}
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="pb-3 space-y-2 w-full md:w-2/3 lg:w-2/4">
        <h1 className="text-2xl">جستجو</h1>
        <Input
          placeholder={"جستجو بر اساس شناسه سفارش"}
          name={"orderCodeSearch"}
          type={"text"}
          label={false}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={
            "bg-lcard dark:bg-dcard rounded-lg text-sm p-2 outline-none"
          }
        />
      </div>
      <div className="w-full  space-y-5 mx-auto pb-5  items-center mt-20  divide-y-2 divide-lcard dark:divide-dcard py-2">
        {status === "pending" &&
          Array(3)
            .fill({})
            .map((_, index) => {
              return <LoadingOrder key={index} />;
            })}

        {status === "success" && orders.length <= 0 && (
          <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
            هیچ سفارش در حال پردازشی یافت نشد !
          </p>
        )}

        {orders.map((order) => {
          const { message, icon, chart } = orderTypeMap[order.status];
          return (
            <div className="  w-full   p-3 space-y-1   " key={order?.id}>
              <button
                onClick={() => {
                  if (confirm("آیا از حذف این سفارش مطمئن هستید؟")) {
                    deleteOrder.mutate({ orderId: order.id });
                  }
                }}
                title="حذف سفارش"
                className="px-3 py-1 text-redorange border-2 rounded-full bg-transparent text-sm "
                disabled={deleteOrder.isPending}
              >
                {deleteOrder.isPending ? (
                  <LoadingIcon color={"bg-redorange"} />
                ) : (
                  "حذف سفارش"
                )}
              </button>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <div className="text-xs text-lfont">
                    شناسه سفارش: {order?.orderCode}
                  </div>
                  {order?.paymentId && order.paymentDate ? (
                    <div className="flex gap-2 text-sm text-lightgreen">
                      <div className=" w-5 h-5 rounded-full"></div>
                      <FaCreditCard className="my-auto" />
                      <p>پرداخت شده</p>
                    </div>
                  ) : (
                    <div>
                      <div className="  py-2">
                        {orders.length > 0 && (
                          <div className="text-sm sm:text-lg ">
                            <p>مجموع</p>
                            <p>{formatPriceFa(order?.total)} تومان</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 text-sm text-yellow">
                        <FaLocationDot className="my-auto" />
                        <p>پرداخت در محل</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    {/* <select
                      value={order.status}
                      onChange={(e) => {
                        updateOrderStatus.mutate({
                          orderId: order.id,
                          status: e.target.value
                        });
                      }}
                      className="bg-lcard dark:bg-dcard border border-lbtn dark:border-dbtn rounded-lg px-2 py-1 duration-200"
                    >
                      {Object.keys(orderTypeMap).map((status) => (
                        <option key={status} value={status} className="bg-lcard p-1 rounded-lg">
                          {orderTypeMap[status].message.props.children}
                        </option>
                      ))}
                    </select> */}
                    <Dropdown
                      title={
                        <div className="flex justify-between gap-1">
                          <span>{orderTypeMap[order.status].message}</span>
                          <span className="my-auto">
                            {orderTypeMap[order.status].icon}
                          </span>
                        </div>
                      }
                      btnStyle="bg-lcard dark:bg-dcard  rounded-lg text-right px-2 py-1 duration-200 w-36 text-black dark:text-white"
                      className="min-w-48 px-2"
                      close={dropdownCloseTick}
                    >
                      <div className="flex flex-col">
                        {Object.keys(orderTypeMap).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              updateOrderStatus.mutate({
                                orderId: order.id,
                                status,
                              });
                              setDropdownCloseTick((c) => c + 1);
                            }}
                            className="flex items-center justify-between w-full text-right px-3 py-2 hover:bg-lcard dark:hover:bg-dcard rounded-lg duration-200"
                          >
                            <span className="flex items-center gap-2">
                              {orderTypeMap[status].icon}
                              {orderTypeMap[status].message}
                            </span>
                          </button>
                        ))}
                      </div>
                    </Dropdown>
                    {/* <p>{message}</p>
                         <span>{icon}</span> */}
                  </div>
                  <div>{chart}</div>
                  {/* <p className="text-[10px]">{order.orderCode}</p> */}
                </div>
              </div>
              <div className="divide-y divide-dashed divide-lbtn dark:divide-dbtn gap-2">
                {order?.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-2 py-3">
                      {item?.product?.images[0] && (
                        <div className="relative  w-20 h-20  rounded-2xl ">
                          <ImageCom
                            className={"object-cover  rounded-xl w-full"}
                            alt={item?.product?.name}
                            //  src={product?.images[0].startsWith('https://') ?  `${product?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${product?.images[0]}`}
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
                            <h1>
                              {formatPriceFa(
                                item?.price -
                                  ((item?.price * item?.color.discount) / 100) *
                                    item?.quantity
                              )}{" "}
                              تومان
                            </h1>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <Accordion
                menuStyle={
                  "p-4  text-sm bg-lcard dark:bg-dcard mt-2 rounded-xl"
                }
                btnStyle={" bg-lcard dark:bg-dcard rounded-xl"}
                title="مشخصات دريافت كننده"
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between truncate">
                    <p>نام و نام خانوادگي</p>
                    <p>{order?.recipient}</p>
                  </div>
                  <div className="flex justify_between truncate">
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

        {isFetchingNextPage &&
          Array(3)
            .fill({})
            .map((_, index) => {
              return <LoadingOrder key={index} />;
            })}
      </div>
    </InfiniteScrollContainer>
  );
}
