"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatNumberFa, formatPriceFa } from "@/lib/utils";
import ImageCom from "@/components/ui/Image";
import moment from "moment-jalaali";
import AddToCartButton from "./AddToCartButtonRoot";
import { ProductColorLite, ProductLite } from "./productCard";

moment.loadPersian({ usePersianDigits: true });

export interface OrderColorLite {
  id: string;
  name:string;
  hexCode: string;
  price: number;
  discount: number;
  stocks: number;
}

export interface OrderLite {
  item:{
    id: string;
    product :ProductLite
    color: ProductColorLite;
    colorId: string;
    createdAt: string | Date;
    quantity : number
    price : number
    discount : number
  }
}


const OrderCard  : React.FC<OrderLite> = ({ item }) => {
  const [link, setLink] = useState(`/products/${item?.product.name}`);


  const discountedPrice =
    item?.color.price -
    (item?.color.price * (item?.color?.discount || 0)) / 100;
  const totalItemPrice = discountedPrice * item?.quantity;

  return (
    <div>
      <div className="w-full px-1 py-3 space-y-1 mx-auto flex flex-wrap justify-between gap-2 select-none">
        <div className="flex gap-2">
          {item?.product.images[0] && (
            <div className="relative w-20 h-20 rounded-2xl">
              <ImageCom
                className={"object-cover rounded-xl w-20 h-20"}
                alt={item?.product.name}
                src={item?.product.images[0]}
                // size={'w-20 h-20 '}
              />
            </div>
          )}

          <Link
            href={link as any}
            className="flex flex-col justify-between h-full space-y-1"
          >
            <div className="space-y-1 text-wrap">
              <h1 className="text-wrap line-clamp-3 hover:underline duration-150 decoration-2">
                {item?.product.name}
              </h1>
            </div>

            <div className="flex gap-2">
              <div
                className="h-5 w-5 rounded-md border border-lcard dark:border-dcard"
                style={{ backgroundColor: item?.color?.hexCode }}
              ></div>
              <p className="text-sm">{item?.color?.name}</p>
            </div>

            <div className="flex gap-2">
              {item?.color.discount  && item?.color.discount > 0 && (
                <>
                  <span className="text-redorange  text-sm">
                    {formatNumberFa(item?.color?.discount)}% تخفیف
                  </span>
                  <p className="text-sm line-through text-lfont decoration-2  my-auto">
                    {formatPriceFa(item?.color?.price)}
                  </p>
                </>
              )}
              {item?.quantity > 1 && (
                <p className="text-sm my-auto">
                  {formatPriceFa(discountedPrice)} تومان
                </p>
              )}
            </div>
          </Link>
        </div>

        <div className="flex flex-col space-y-1">
          <div>
            <AddToCartButton
              product={item?.product}
              colorId={item?.colorId}
              stocks={item?.color?.stocks}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <p>
          مجموع قيمت كالا
          <span className="text-[10px]">(تعداد * قيمت هر واحد)</span>{" "}
        </p>
        <div>
          <p>{formatPriceFa(totalItemPrice)} تومان</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
