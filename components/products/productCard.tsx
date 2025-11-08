"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatNumberFa, formatPriceFa } from "@/lib/utils";
import ImageCom from "../ui/Image";
import moment from 'moment-jalaali'

moment.loadPersian({ usePersianDigits: true }) 
export interface ProductColorLite {
  id: string;
  hexCode: string;
  price: number;
  discount: number | null;
  name: string;
  stocks: number;
  status: string;
}

export interface ProductLite {
  id: string;
  name: string;
  desc: string;
  content: string;
  images: string[];
  sellerId: string;
  seller: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    displayName: string | null;
  };
  cartItems?: Array<{
    userId: string;
    colorId: string | null;
    quantity: number;
  }>;
  colors: ProductColorLite[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: ProductLite;
  draft?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, draft }) => {
  const [link, setLink] = useState<string>(
    draft ? `/edit-product/${product.name}` : `/products/${product.name}`
  );
  console.log(product)
  const createdAt = moment(product.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").locale("fa");
  // const formattedDate = createdAt.isValid() ? createdAt.fromNow() : "تاریخ نامعتبر";

  return (
    <div className="   sm:w-64   border-2 border-lcard dark:border-dcard rounded-3xl shadow-sm duration-500   max-sm:w-full   py-2 space-y-2 px-3   select-none">
      <div className="flex justify-between"></div>
      <Link href={link as any}>
        {product?.images[0] && (
          <div className="relative w-full h-36 md:h-40  rounded-3xl ">
            <ImageCom
              className={"object-cover  rounded-3xl w-full"}
              alt={product?.name}
              src={product?.images[0]}
              size={"h-36 md:h-40"}
            />
            <div className="inset-0 absolute ">
              <div className="flex justify-between m-2">
                  <div className="flex gap-2 backdrop-blur-sm p-2 rounded-lg  bg-white/20">
                    {product?.colors.map((color) => {
                      return (
                        <div
                          style={{ backgroundColor: color.hexCode }}
                          key={color?.id}
                          className=" rounded-full p-2"
                        ></div>
                      );
                    })}
                  </div>
                {product?.colors[0].discount !== null && product.colors[0].discount > 1 && (
                    <div className="text-white backdrop-blur-sm p-1.5 rounded-lg  bg-redorange  text-[10px]">
                      {formatNumberFa(product?.colors[0].discount)}%
                    </div>
                )}  
              </div>
            </div>
          </div>
        )}

        <h1 className="text-wrap line-clamp-3 text-lfont hover:underline decoration-black dark:decoration-white duration-150 decoration-2">
          {product?.name}
        </h1>
      </Link>

      <div className="flex justify-between">
        <div className=" gap-2">
          <h2>
          {formatPriceFa(
  product.colors[0].price - (product.colors[0].price * (product.colors[0].discount || 0)) / 100
)}{" "}
            تومان
          </h2>
          {product?.colors[0].discount !== null && product?.colors[0].discount > 0 && (
            <h3 className="line-through text-sm  decoration-2 my-auto text-lfont">
              {formatPriceFa(product?.colors[0].price)}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

