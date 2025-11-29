"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "@/components/products/comments/comments";
import PageLoading from "@/components/ui/loading/pageLoading";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { IoShareOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import ImageCom from "@/components/ui/Image";
import { FaArrowLeftLong,FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { formatPriceFa, formatNumberFa } from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButtonRoot";
import Conneccted from "@/components/products/Connected";
import { ProductLite } from "@/components/products/productCard";
import type { Session } from "@/lib/auth";



interface ProductPageProps {
  initialProduct: ProductLite;
  session:Session | null
}

const ProductPage: React.FC<ProductPageProps> = ({ initialProduct, session }) => {
  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentDiscount, setCurrentDiscount] = useState<number | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [currentPriceDiscount, setCurrentPriceDiscount] = useState<
    string | null
  >(null);
  const [currentStocks, setCurrentStocks] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string | null>(null);
  const [currentColorName, setCurrentColorName] = useState<string>("");

  const pathName = usePathname();
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${pathName}`;
 
  const {
    data: product,
    isLoading,
    status,
    error,
  } = useQuery<ProductLite>({
    queryKey: ["product", initialProduct.name],
    queryFn: async (): Promise<ProductLite> => {
      const response = await axios.get(
        `/api/product/product?productName=${initialProduct.name}`
      );
      return response.data;
    },
    initialData: initialProduct,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (product?.colors?.length > 0 && !currentColor) {
      setCurrentColor(product.colors[0].id);
      setCurrentColorName(product.colors[0].name);
      setCurrentDiscount(product.colors[0].discount);
      setPrice(formatPriceFa(product.colors[0].price));
      setCurrentStocks(product.colors[0].stocks);
      setCurrentPriceDiscount(
        formatPriceFa(
          product.colors[0].price -
            (product.colors[0].price * (product.colors[0].discount || 0)) / 100
        )
      );

      const prices = product.colors.map((color) => color.price);
      setMinPrice(formatPriceFa(Math.min(...prices)));
      setMaxPrice(formatPriceFa(Math.max(...prices)));
    }
  }, [product, currentColor]);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("لینک اشتراک گذاری ک‍پی شد");
  };

  if (status === "success" && !product) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        هيچ محصولي يافت نشد
      </p>
    );
  }

  if (status === "error" ||  error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        مشکلی در برقراری ارتباط وجود دارد
      </p>
    );
  }

  return (
    <div className="px-5 container sm:max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto  ">
      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="flex flex-col gap-5">
              <Link href="/" className="flex text-sm ">
                بازگشت
                <FaArrowLeftLong className="my-auto " />
              </Link>
          <div className="flex gap-2 sm:gap-3   my-auto">
          <a 
                 href="tel:09901196140" 
                 onClick={() => { toast.success('شماره کپی شد'); navigator.clipboard.writeText('09901196140') }} 
                 title="call number"
                 aria-label="call number"
                 className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
                 >
                    <FaPhone />
                 </a>
            <div>
              <button
                aria-label="share product"
                title="share product"
                className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
                onClick={copyToClipboard}
              >
                <IoShareOutline />
              </button>
            </div>
            {session?.user?.id === product?.sellerId && (
              <Link
                className={
                  "bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
                }
                href={`/admin/edit-product/${product?.slug}`}
              >
                <FaEraser />
              </Link>
            )}

            <div>
              <Comments product={product} session={session}/>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-10 md:space-y-12">
          <div className=" space-y-5 md:mt-7">
            <div className="space-y-3">
              {minPrice !== maxPrice && (
                <p className=" text-neutral-500 dark:text-neutral-300 text-[10px] md:text-sm">
                  قیمت این محصول از {minPrice} تا {maxPrice} تومان میباشد.
                </p>
              )}
              <h1 className="text-xl md:text-4xl w-full wrap-break-word text-black dark:text-white leading-8 md:leading-[60px]">
                {product.name}
              </h1>
              {/* <p className="text-lfont ">{product.desc}</p> */}
            </div>
          </div>
              <div className="flex justify-between gap-2">
                <div className="flex gap-3 flex-wrap">
                  {product?.colors
                    ?.filter(
                      (color) =>
                        color?.status === "EXISTENT" && color?.stocks >= 1
                    )
                    .map((color) => {
                      return (
                        <div key={color.name}>
                          <input
                            className="hidden peer"
                            aria-label={`set color ${color.name}`}
                            type="radio"
                            value={color.id}
                            onClick={() => {
                              setCurrentColor(color.id);
                              setCurrentDiscount(color.discount);
                              setPrice(formatPriceFa(color.price));
                              setCurrentColorName(color.name);
                              setCurrentStocks(color.stocks);
                              setCurrentPriceDiscount(
                                formatPriceFa(
                                  color.price -
                                    (color.price * (color?.discount || 0)) / 100
                                )
                              );
                            }}
                            checked={currentColor === color.id}
                            id={color.name}
                            name="color"
                            readOnly
                          />
                           <label
                             className="
                               flex flex-col ring-2 ring-lbtn dark:ring-dbtn cursor-pointer 
                               rounded-md sm:rounded-lg duration-300
                                 peer-checked:outline-2 peer-checked:outline-offset-2 
                               peer-checked:outline-black peer-checked:ring-0 
                               dark:peer-checked:outline-white peer-checked:scale-110 transition-transform
                             " htmlFor={color.name}
                           >
                            <div
                              className="w-5 h-5 sm:w-7  sm:h-7  my-auto rounded-md sm:rounded-lg"
                              style={{ backgroundColor: color.hexCode }}
                            ></div>
                          </label>
                        </div>
                      );
                    })}
                </div>

                <div className="text-sm sm:text-lg my-auto">
                  <p> رنگ - {currentColorName}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-2">
                <p className="my-auto">قيمت</p>
                <div className="flex flex-col flex-wrap gap-2 text-xl">
                  <p className="my-auto "> {currentPriceDiscount} تومان</p>
                  {currentDiscount !== null && currentDiscount > 0 && (
                    <div className="flex gap-1 text-end ">
                      <p className="line-through  decoration-2 my-auto  text-neutral-500 dark:text-neutral-300">
                        {" "}
                        {price}
                      </p>
                      <span className=" text-redorange text-sm ">
                        {formatNumberFa(currentDiscount)}% تخفیف
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-between my-auto gap-2">
                <div className="flex flex-col gap-2">
                  <div>
                      <a
                       className="bg-lcard dark:bg-dcard rounded-xl text-sm px-10 py-2 border-2 border-lfont"
                        href="tel:09901196140"
                        onClick={() => {
                          toast.success("شماره کپی شد");
                          navigator.clipboard.writeText("09901196140");
                        }}
                      >
                        تماس
                      </a>
                  </div>
                </div>

                <div>
                  <AddToCartButton
                    session={session}
                    product={product}
                    colorId={currentColor}
                    stocks={
                      product?.colors?.find(
                        (color) => color.id === currentColor
                      )?.stocks || 0
                    }
                  />
                </div>
              </div>
            </div>
              <EmblaCarousel
                options={{ loop: false, direction: "rtl", }}
                dot={true}
                buttons={true}
                autoScroll={false}
                length={product?.images?.length > 1}
              >
                {product?.images?.map((image, index) => (
                  <div
                      className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-full h-64 md:h-96 min-w-0 pl-2"
                    key={index}
                  >
                    <ImageCom
                      className={`basis-full h-64 md:h-96  rounded-xl`}
                      src={image}
                      alt={"product thumnail"}
                    />
                  </div>
                ))}
              </EmblaCarousel>
          </div>

          <div
            className="content wrap-break-word w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  "
            dangerouslySetInnerHTML={{ __html: product.content }}
          />

          <div className="space-y-10 ">
            <div>
              <h1 className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-300">
                <span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">
                  محصولات
                </span>{" "}
                پرفروش و مرتبط
              </h1>
            </div>

            <Conneccted productTitle={product?.name} productId={product?.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
