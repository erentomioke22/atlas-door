"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatNumberFa, formatPriceFa } from "@lib/utils";
import ImageCom from "@components/ui/Image";
import moment from "moment-jalaali";

moment.loadPersian({ usePersianDigits: true });

const ProductCard = ({ product, draft }) => {
  const [link, setLink] = useState(
    draft ? `/edit-product/${post.name}` : `/products/${product.name}`
  );



  const createdAt = moment(
    product.createdAt,
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  ).locale("fa");
  const formattedDate = createdAt.isValid()
    ? createdAt.fromNow()
    : "تاریخ نامعتبر";

  return (
    <div className="   sm:w-64   border-2 border-lcard dark:border-dcard rounded-3xl shadow-sm duration-500   max-sm:w-full   py-2 space-y-2 px-3   select-none">
      <div className="flex justify-between">
      </div>
      <Link href={link}>
        {product?.images[0] && (
          <div className="relative w-full h-36 md:h-40  rounded-3xl ">
            <ImageCom
              className={"object-cover  rounded-3xl w-full"}
              alt={product?.name}
              //  src={product?.images[0].startsWith('https://') ?  `${product?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${product?.images[0]}`}
              src={product?.images[0]}
              size={"h-36 md:h-40"}
            />
            <div className="inset-0 absolute ">
              <div className="flex justify-between m-2">
                <div>
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
                </div>
                {product?.colors[0].discount > 0 && (
                  <div>
                    <div className="text-white backdrop-blur-sm p-1.5 rounded-lg  bg-redorange  text-[10px]">
                      {formatNumberFa(product?.colors[0].discount)}%
                    </div>
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
        {/* <AddToCartButton
                       className={"text-sm w-full flex justify-between  hover:bg-lcard rounded-lg p-2 dark:hover:bg-dcard duration-300"}
                       name={"AddToCartButton"}
                       productId={product?.id}
                       initialState={{
                        // quantity:product?.quantity,
                        quantity: product?.cartItems?.find(
                          (cartItem) => cartItem.userId === session?.user?.id,
                        )?.quantity || 1,
                         isCarted: product?.cartItems?.some(
                           (cartItem) => cartItem.userId === session?.user?.id,
                        ),
                     }}
                     stocks={product?.stocks}
                     card={true}
                   />  */}
        {/* <div className='my-auto'>
                     <button className='text-sm bg-black text-white dark:bg-white dark:text-black rounded-full px-3 py-2'>ADD TO CART</button>
                   </div> */}
        <div className=" gap-2">
          <h2>
            {formatPriceFa(
              product?.colors[0].price -
                (product?.colors[0].price * product?.colors[0].discount) / 100
            )}{" "}
            تومان
          </h2>
          {product?.colors[0].discount > 0 && (
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

