// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { formatNumberFa, formatPriceFa } from "@/lib/utils";
// import ImageCom from "@/components/ui/Image";
// import moment from "moment-jalaali";
// import AddToCartButton from "./AddToCartButtonRoot";
// import { ProductColorLite, ProductLite } from "./productCard";

// moment.loadPersian({ usePersianDigits: true });

// export interface OrderColorLite {
//   id: string;
//   name:string;
//   slug:string;
//   hexCode: string;
//   price: number;
//   discount: number;
//   stocks: number;
// }

// export interface OrderLite {
//   item:{
//     id: string;
//     product :ProductLite
//     color: ProductColorLite;
//     colorId: string;
//     createdAt: string | Date;
//     quantity : number
//     price : number
//     discount : number
//   }
// }


// const OrderCard  : React.FC<OrderLite> = ({ item }) => {
//   const [link, setLink] = useState(`/products/${item?.product.slug}`);


//   const discountedPrice =
//     item?.color.price -
//     (item?.color.price * (item?.color?.discount || 0)) / 100;
//   const totalItemPrice = discountedPrice * item?.quantity;

//   return (
//     <div>
//       <div className="w-full px-1 py-3 space-y-1 mx-auto flex flex-wrap justify-between gap-2 select-none">
//         <div className="flex gap-2">
//           {item?.product.images[0] && (
//               <ImageCom
//                 className={"rounded-2xl w-20 h-20"}
//                 alt={item?.product.name}
//                 src={item?.product.images[0]}
//               />
//           )}

//           <Link
//             href={link as any}
//             className="flex flex-col justify-between h-full space-y-1"
//           >
//             <div className="space-y-1 text-wrap">
//               <h1 className="text-wrap line-clamp-3 hover:underline duration-150 decoration-2">
//                 {item?.product.name}
//               </h1>
//             </div>

//             <div className="flex gap-2">
//               <div
//                 className="h-5 w-5 rounded-md border border-lcard dark:border-dcard"
//                 style={{ backgroundColor: item?.color?.hexCode }}
//               ></div>
//               <p className="text-sm">{item?.color?.name}</p>
//             </div>

//             <div className="flex gap-2">
//               {item?.color.discount !== null  && item?.color.discount > 0 && (
//                 <>
//                   <span className="text-redorange  text-sm">
//                     {formatNumberFa(item?.color?.discount)}% تخفیف
//                   </span>
//                   <p className="text-sm line-through text-lfont decoration-2  my-auto">
//                     {formatPriceFa(item?.color?.price)}
//                   </p>
//                 </>
//               )}
//               {item?.quantity > 1 && (
//                 <p className="text-sm my-auto">
//                   {formatPriceFa(discountedPrice)} تومان
//                 </p>
//               )}
//             </div>
//           </Link>
//         </div>

//         <div className="flex flex-col space-y-1">
//           <div>
//             <AddToCartButton
//               product={item?.product}
//               colorId={item?.colorId}
//               stocks={item?.color?.stocks}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-wrap justify-between gap-2 text-sm">
//         <p>
//           مجموع قيمت كالا
//           <span className="text-[10px]">(تعداد * قيمت هر واحد)</span>{" "}
//         </p>
//         <div>
//           <p>{formatPriceFa(totalItemPrice)} تومان</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderCard;
// components/products/orderCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { formatNumberFa, formatPriceFa } from '@/lib/utils';
import ImageCom from '@/components/ui/Image';
import { useCart } from '@/hook/useCart';
import type { CartItem } from '@/store/cartStore';

interface OrderCardProps {
  item: CartItem;
}

const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useCart();

  const link = `/products/${item.product.slug}`;

  const itemOriginalPrice = item.price * item.quantity;
  const itemFinalPrice = item.finalPrice * item.quantity;
  const itemDiscount = itemOriginalPrice - itemFinalPrice;
  const hasDiscount = itemDiscount > 0;

  // ====== افزایش تعداد ======
  const handleIncrement = () => {
    if (item.quantity < item.color.stocks) {
      updateCartQuantity(item.productId, item.colorId, item.quantity + 1);
    } else {
      toast.error(`فقط ${item.color.stocks} عدد موجود است`);
    }
  };

  // ====== کاهش تعداد ======
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateCartQuantity(item.productId, item.colorId, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  // ====== حذف کامل ======
  const handleRemove = () => {
    removeFromCart(item.productId, item.colorId);
    toast.success('محصول از سبد حذف شد');
  };

  return (
    <div className="py-5 space-y-3">
      <div className="w-full flex flex-wrap justify-between gap-3 select-none">
        {/* ====== بخش چپ: تصویر + اطلاعات ====== */}
        <div className="flex gap-3 flex-1 min-w-0">
          {item.product.images?.[0] && (
            <Link href={link as any} className="flex-none">
              <ImageCom
                className="rounded-2xl w-20 h-20 sm:w-24 sm:h-24 object-cover"
                alt={item.product.name}
                src={item.product.images[0]}
              />
            </Link>
          )}

          <div className="flex flex-col justify-between h-full space-y-2 min-w-0 flex-1">
            <Link href={link as any} className="space-y-1">
              <h1 className="text-wrap line-clamp-2 hover:underline duration-150 decoration-2 font-medium">
                {item.product.name}
              </h1>
            </Link>

            {/* رنگ */}
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-md border border-lcard dark:border-dcard flex-none"
                style={{ backgroundColor: item.color.hexCode }}
              />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.color.name}
              </p>
            </div>

            {/* تخفیف */}
            {hasDiscount && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-redorange text-sm">
                  {formatNumberFa(item.discount)}% تخفیف
                </span>
                <p className="text-sm line-through text-lfont decoration-2 my-auto">
                  {formatPriceFa(item.price)}
                </p>
              </div>
            )}

            {/* هشدار موجودی کم */}
            {item.color.stocks <= 5 && item.color.stocks > 0 && (
              <p className="text-xs text-orange-500">
                فقط {formatNumberFa(item.color.stocks)} عدد باقی مانده
              </p>
            )}
          </div>
        </div>

        {/* ====== بخش راست: کنترل‌ها ====== */}
        <div className="flex flex-col items-end justify-between gap-2">
          {/* دکمه حذف */}
          <button
            onClick={handleRemove}
            aria-label="حذف از سبد"
            title="حذف از سبد"
            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FaTrash className="text-sm" />
          </button>

          {/* کنترل تعداد */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.color.stocks || item.quantity >= 10}
              aria-label="افزایش"
              title="افزایش"
              className="w-8 h-8 rounded-full border-2 border-lbtn dark:border-dbtn flex items-center justify-center hover:bg-lcard dark:hover:bg-dcard disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FaPlus className="text-xs" />
            </button>

            <span className="text-sm w-8 text-center font-medium">
              {formatNumberFa(item.quantity)}
            </span>

            <button
              onClick={handleDecrement}
              aria-label="کاهش"
              title="کاهش"
              className="w-8 h-8 rounded-full border-2 border-lbtn dark:border-dbtn flex items-center justify-center hover:bg-lcard dark:hover:bg-dcard transition-colors"
            >
              <FaMinus className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* ====== مجموع قیمت ====== */}
      <div className="flex flex-wrap justify-between gap-2 text-sm pt-2 border-t border-lcard dark:border-dcard">
        <p className="text-neutral-500 dark:text-neutral-400">
          مجموع قیمت کالا{' '}
          <span className="text-[10px]">(تعداد × قیمت هر واحد)</span>
        </p>
        <div className="flex flex-col items-end">
          {hasDiscount && (
            <p className="text-xs text-neutral-500 line-through">
              {formatPriceFa(itemOriginalPrice)} تومان
            </p>
          )}
          <p className="font-medium">
            {formatPriceFa(itemFinalPrice)} تومان
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;