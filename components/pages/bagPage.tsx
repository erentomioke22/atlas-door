// "use client";

// import React, { useEffect, useRef } from "react";
// import { useCart } from "@/hook/useCart";
// import OrderCard from "@/components/products/orderCard";
// import { formatPriceFa } from "@/lib/utils";
// import LoadingOrder from "@/components/ui/loading/loadingOrder";
// import PaymentPanel from "@/components/paymentPanel";
// import type { Session } from "@/lib/auth";


// export default function BagPage({session}:{session:Session | null}) {
//   const {
//     items,
//     totalPrice,
//     originalTotalPrice,
//     totalDiscount,
//     hasHydrated,
//     restoreFromServer,
//   } = useCart();

//   const syncedOnceRef = useRef<boolean>(false);



//   useEffect(() => {
//     if (!hasHydrated) return;
//     if (syncedOnceRef.current) return;
//     syncedOnceRef.current = true;
//     restoreFromServer();
//   }, [hasHydrated, restoreFromServer]);

//   if (!hasHydrated) {
//     return (
//       <div className="w-full   space-y-5 mx-auto pb-5 items-center  divide-y-2 divide-lcard dark:divide-dcard py-2">
//         {Array(3)
//           .fill({})
//           .map((_, index: number) => {
//             return <LoadingOrder key={index} />;
//           })}
//       </div>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <p className="text-center text-destructive h-52 flex flex-col justify-center items-center ">
//         سبد خرید شما خالی است !
//       </p>
//     );
//   }

//   return (
//     <div>
//       <div className="w-full   space-y-5 mx-auto pb-5 items-center  divide-y-2 divide-lcard dark:divide-dcard py-2">
//         <div>
//           <h1 className="text-3xl my-5">سبد خريد</h1>
//           <div className="space-y-5 py-2 divide-y divide-lcard dark:divide-dcard">
//             {items.map((item: any) => (
//               <OrderCard
//                 item={item}
//                 key={`${item.productId}-${item.colorId}`}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="space-y-5  ">
//           <h1 className="text-3xl mt-5">خلاصه وضعيت</h1>
//           <div className="py-2 space-y-5">
//             {originalTotalPrice > totalPrice && (
//               <div className="text-sm flex justify-between">
//                 <p>قیمت اصلی</p>
//                 <p className=" text-lfont line-through  decoration-2">
//                   {formatPriceFa(originalTotalPrice)} تومان
//                 </p>
//               </div>
//             )}

//             {totalDiscount > 0 && (
//               <div className="text-sm flex justify-between ">
//                 <p>تخفیف (سود شما) </p>
//                 <p>{formatPriceFa(totalDiscount)} تومان -</p>
//               </div>
//             )}

//             <div className="text-sm  flex justify-between">
//               <p>مجموع كل</p>
//               <p className="text-darkgreen">
//                 {formatPriceFa(totalPrice)} تومان{" "}
//               </p>
//             </div>

//             <div className="text-sm flex justify-between">
//               <p>ماليات</p>
//               <p>-</p>
//             </div>

//             <div className="text-sm  flex justify-between">
//               <p>هزينه تقریبی حمل و نقل</p>
//               <p>تماس بگيريد</p>
//             </div>

//             <div className="mx-auto">
//               {items.length >= 1 && <PaymentPanel status="success" session={session}/>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/(main)/bag/bagPage.tsx
'use client';

import React from 'react';
import { useCart } from '@/hook/useCart';
import { useCartSync } from '@/hook/useCartSync';
import OrderCard from '@/components/products/orderCard';
import { formatPriceFa } from '@/lib/utils';
import LoadingOrder from '@/components/ui/loading/loadingOrder';
import PaymentPanel from '@/components/paymentPanel';
import type { Session } from '@/lib/auth';
import { IoTrashOutline } from 'react-icons/io5';
import { toast } from 'sonner';

export default function BagPage({ session }: { session: Session | null }) {
  const {
    items,
    totalPrice,
    originalTotalPrice,
    totalDiscount,
    totalItems,
    hasHydrated,
    clearCart,
  } = useCart();

  // ✅ Sync خودکار با Sanity وقتی وارد صفحه میشی
  useCartSync();

  // ====== Loading ======
  if (!hasHydrated) {
    return (
      <div className="w-full space-y-5 mx-auto pb-5 items-center divide-y-2 divide-lcard dark:divide-dcard py-2">
        {Array(3)
          .fill({})
          .map((_, index: number) => (
            <LoadingOrder key={index} />
          ))}
      </div>
    );
  }

  // ====== سبد خالی ======
  if (items.length === 0) {
    return (
      <div className="h-52 flex flex-col justify-center items-center space-y-3">
        <p className="text-center text-destructive text-lg">
          سبد خرید شما خالی است !
        </p>
        <a
          href="/products"
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm"
        >
          مشاهده محصولات
        </a>
      </div>
    );
  }

  // ====== حذف همه ======
  const handleClearCart = () => {
    if (confirm('آیا از حذف همه محصولات مطمئن هستید؟')) {
      clearCart();
      toast.success('سبد خرید خالی شد');
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-5">
      <div className="w-full space-y-5 mx-auto pb-5 items-center py-2">
        {/* ====== لیست محصولات ====== */}
        <div>
          <div className="flex justify-between items-center my-5">
            <h1 className="text-3xl">
              سبد خرید{' '}
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                ({totalItems} محصول)
              </span>
            </h1>
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <IoTrashOutline />
              حذف همه
            </button>
          </div>

          <div className="space-y-5 py-2 divide-y divide-lcard dark:divide-dcard">
            {items.map((item) => (
              <OrderCard
                item={item}
                key={`${item.productId}-${item.colorId}`}
              />
            ))}
          </div>
        </div>

        {/* ====== خلاصه ====== */}
        <div className="space-y-5">
          <h1 className="text-3xl mt-5">خلاصه وضعیت</h1>
          <div className="py-2 space-y-5">
            {originalTotalPrice > totalPrice && (
              <div className="text-sm flex justify-between">
                <p>قیمت اصلی</p>
                <p className="text-lfont line-through decoration-2">
                  {formatPriceFa(originalTotalPrice)} تومان
                </p>
              </div>
            )}

            {totalDiscount > 0 && (
              <div className="text-sm flex justify-between">
                <p>تخفیف (سود شما)</p>
                <p className="text-redorange">
                  {formatPriceFa(totalDiscount)} تومان -
                </p>
              </div>
            )}

            <div className="text-sm flex justify-between">
              <p>مجموع کل</p>
              <p className="text-darkgreen">
                {formatPriceFa(totalPrice)} تومان
              </p>
            </div>

            <div className="text-sm flex justify-between">
              <p>مالیات</p>
              <p>-</p>
            </div>

            <div className="text-sm flex justify-between">
              <p>هزینه تقریبی حمل و نقل</p>
              <p>تماس بگیرید</p>
            </div>

            <div className="mx-auto">
              {items.length >= 1 && (
                <PaymentPanel status="success" session={session} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}