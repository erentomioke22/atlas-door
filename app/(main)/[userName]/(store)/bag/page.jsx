"use client";

import React, { useEffect, useRef } from "react";
import { useCart } from "@hook/useCart";
import OrderCard from "@components/products/orderCard";
import { formatPriceFa } from "@lib/utils";
import LoadingOrder from "@components/ui/loading/loadingOrder";
import PaymentPanel from "@components/paymentPanel";
import { usePathname, useParams, notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function page() {
  const {
    items,
    totalPrice,
    originalTotalPrice,
    totalDiscount,
    hasHydrated,
    restoreFromServer,
  } = useCart();
  const path = usePathname();
  const router = useRouter();
  const { userName } = useParams();
  const { data: session, status } = useSession();
  const syncedOnceRef = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      notFound();
    }
    if (session && userName && session.user.name !== userName) {
      router.replace(`/${session.user.name}/bag`);
    }
  }, [session, userName, router]);

  if (session && userName && session.user.name !== userName) {
    return null;
  }

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      notFound();
    }
    if (session && userName && session.user.name !== userName) {
      router.replace(`/${session.user.name}/bag`);
    }
  }, [session, userName, router]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (status !== "authenticated") return;
    if (syncedOnceRef.current) return;
    syncedOnceRef.current = true;
    restoreFromServer();
  }, [hasHydrated, status, restoreFromServer]);

  if (!hasHydrated) {
    return (
      <div className="w-full   space-y-5 mx-auto pb-5 items-center  divide-y-2 divide-lcard dark:divide-dcard py-2">
        {Array(3)
          .fill({})
          .map((_, index) => {
            return <LoadingOrder key={index} />;
          })}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center ">
        سبد خرید شما خالی است !
      </p>
    );
  }
  return (
    <div>
      <div className="w-full   space-y-5 mx-auto pb-5 items-center  divide-y-2 divide-lcard dark:divide-dcard py-2">
        <div>
          <h1 className="text-3xl my-5">سبد خريد</h1>
          <div className="space-y-5 py-2 divide-y divide-lcard dark:divide-dcard">
            {items.map((item) => (
              <OrderCard
                item={item}
                key={`${item.productId}-${item.colorId}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5  ">
          <h1 className="text-3xl mt-5">خلاصه وضعيت</h1>
          <div className="py-2 space-y-5">
            {originalTotalPrice > totalPrice && (
              <div className="text-sm flex justify-between">
                <p>قیمت اصلی</p>
                <p className=" text-lfont line-through  decoration-2">
                  {formatPriceFa(originalTotalPrice)} تومان
                </p>
              </div>
            )}

            {totalDiscount > 0 && (
              <div className="text-sm flex justify-between ">
                <p>تخفیف (سود شما) </p>
                <p>{formatPriceFa(totalDiscount)} تومان -</p>
              </div>
            )}

            <div className="text-sm  flex justify-between">
              <p>مجموع كل</p>
              <p className="text-darkgreen">
                {formatPriceFa(totalPrice)} تومان{" "}
              </p>
            </div>

            <div className="text-sm flex justify-between">
              <p>ماليات</p>
              <p>-</p>
            </div>

            <div className="text-sm  flex justify-between">
              <p>هزينه تقریبی حمل و نقل</p>
              <p>تماس بگيريد</p>
            </div>

            <div className="mx-auto">
              {items.length >= 1 && <PaymentPanel status="success" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
