"use client";

import React, { useEffect, useState , useMemo} from "react";
import axios from "axios";
import PageLoading from "@/components/ui/loading/pageLoading";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { IoShareOutline } from "react-icons/io5";
import ImageCom from "@/components/ui/Image";
import { FaArrowLeftLong,FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { formatPriceFa, formatNumberFa , getProductPriceRange } from "@/lib/utils";
import { ProductLite } from "@/components/products/productCard";
import type { Session } from "@/lib/auth";
import Button from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Comments = dynamic(() => import("@/components/products/comments/comments"));
const Connected = dynamic(() => import("@/components/products/Connected"));
const AddToCartButton = dynamic(() => import("@/components/products/AddToCartButtonRoot"));

interface ProductPageProps {
  initialProduct: ProductLite;
  session:Session | null
}


interface ColorState {
  id: string;
  name: string;
  discount: number | null;
  price: number;
  discountedPrice: number;
  stocks: number;
  hexCode: string;
}


const ProductPage: React.FC<ProductPageProps> = ({ initialProduct, session }) => {
 
  // const [currentColor, setCurrentColor] = useState<string>('');
  // const [currentDiscount, setCurrentDiscount] = useState<number | null>(null);
  // const [price, setPrice] = useState<string | null>(null);
  // const [currentPriceDiscount, setCurrentPriceDiscount] = useState<
  //   string | null
  // >(null);
  // const [currentStocks, setCurrentStocks] = useState<number | null>(null);
  // const [minPrice, setMinPrice] = useState<string | null>(null);
  // const [maxPrice, setMaxPrice] = useState<string | null>(null);
  // const [currentColorName, setCurrentColorName] = useState<string>("");

  const [selectedColor, setSelectedColor] = useState<ColorState | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentUrl = useMemo(() => 
    `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    [pathname]
  );
  const {
    data: product,
    isLoading,
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
    refetchOnWindowFocus: false,
  });



    useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      const availableColors = product.colors.filter(
        color => color.status === "EXISTENT" && color.stocks >= 1
      );
      
      if (availableColors.length > 0) {
        const firstColor = availableColors[0];
        const colorState: ColorState = {
          id: firstColor.id,
          name: firstColor.name,
          discount: firstColor.discount,
          price: firstColor.price,
          discountedPrice: firstColor.discount 
            ? firstColor.price - (firstColor.price * firstColor.discount) / 100
            : firstColor.price,
          stocks: firstColor.stocks,
          hexCode: firstColor.hexCode,
        };
        setSelectedColor(colorState);
      }

      const range = getProductPriceRange(product.colors);
      setPriceRange({
        min: formatPriceFa(range.min),
        max: formatPriceFa(range.max),
      });
    }
  }, [product, selectedColor]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.desc,
          url: currentUrl,
        });
      } catch (err) {
        await navigator.clipboard.writeText(currentUrl);
        toast.success("لینک کپی شد");
      }
    } else {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("لینک کپی شد");
    }
  };

  const handleColorSelect = (color: typeof product.colors[0]) => {
    setSelectedColor({
      id: color.id,
      name: color.name,
      discount: color.discount,
      price: color.price,
      discountedPrice: color.discount 
        ? color.price - (color.price * color.discount) / 100
        : color.price,
      stocks: color.stocks,
      hexCode: color.hexCode,
    });
  };





  if (error) {
    return (
      <div className="flex min-h-svh items-center  max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-6 py-8 my-auto  flex-col justify-center  text-center space-y-5">
      <p className="text-destructive">
        مشکلی در برقراری ارتباط وجود دارد
      </p>
       <Button variant="empty" className="bg-transparent text-lime-600 border-2 border-lime-600 rounded-full py-2 px-3 hover:text-lime-700 text-sm" onClick={() => router.refresh()}>
              تلاش مجدد
       </Button>
      </div>
    );
  }

  if (isLoading || !selectedColor) {
    return(
      <div className="container max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-6 py-8 ">
         <PageLoading/>
      </div>
      )
  }

  const availableColors = product.colors?.filter(
    color => color.status === "EXISTENT" && color.stocks >= 1
  ) || [];



  return (
    <div className="px-5 container sm:max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto  mt-16">
        <Button
          variant="back"
          onClick={()=>router.back()}
          className="mb-6 text-sm flex"
        >
          بازگشت
          <FaArrowLeftLong className="ml-2 my-auto " />
        </Button>

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
                onClick={handleShare}
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

              <Comments product={product} session={session}/>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-10 md:space-y-12">
          <div className=" space-y-5 md:mt-7">
            <div className="space-y-3">
            {priceRange && priceRange.min !== priceRange.max && (
                <span className="text-neutral-500 dark:text-neutral-300 text-[10px] md:text-sm">
                  قیمت از {priceRange.min} تا {priceRange.max} تومان
                </span>
            )}
              <h1 className="text-xl md:text-4xl w-full wrap-break-word text-black dark:text-white leading-8 md:leading-[60px]">
                {product.name}
              </h1>
              {/* <p className="text-lfont ">{product.desc}</p> */}
            </div>
          </div>

{availableColors.length > 0 && (
            <div className="space-y-4">
                <h3 className="font-medium">انتخاب رنگ</h3>
              <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`انتخاب رنگ ${color.name}`}
                    className={`
                      relative w-9 h-9 rounded-xl transition-all border-2 duration-300
                      ${selectedColor.id === color.id 
                        ? ' ring-2 ring-black dark:ring-white ' 
                        : ' border-lcard dark:border-dcard hover:border-lbtn dark:hover:border-dbtn'
                      }
                    `}
                    style={{ backgroundColor: color.hexCode }}
                    title={color.name}
                  >
                    {/* {selectedColor.id === color.id && (
                      <div className="absolute inset-0 border-2 border-white rounded-lg" />
                    )} */}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                  {selectedColor.name}
                </span>
              </div>
              
            </div>
          )}


              <div className="flex flex-wrap justify-between gap-2">
                <p className="my-auto">قيمت</p>
                <div className="flex flex-col flex-wrap gap-2 text-xl">
                  <p className="my-auto ">  {formatPriceFa(selectedColor.discountedPrice)} تومان</p>
                  {selectedColor.discount !== null && selectedColor.discount > 0 && (
                    <div className="flex gap-1 text-end ">
                      <p className="line-through  decoration-2 my-auto  text-neutral-500 dark:text-neutral-300">
                        {" "}
                        {formatPriceFa(selectedColor.price)}
                      </p>
                      <span className=" text-redorange text-sm ">
                        {selectedColor.discount}% تخفیف
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                موجودی: {selectedColor.stocks > 0 ? selectedColor.stocks : 'ناموجود'}
              </span>
              {selectedColor.stocks <= 5 && selectedColor.stocks > 0 && (
                <span  className="text-xs">
                  آخرین موجودی
                </span>
              )}
            </div>
          </div> */}

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
                    colorId={selectedColor.id}
                    stocks={selectedColor.stocks}
                    disabled={selectedColor.stocks === 0}
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

          <article
            className="content wrap-break-word w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  my-12"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />

          <section className="space-y-10 ">
            <div>
              <h1 className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-300">
                <span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">
                  محصولات
                </span>{" "}
                پرفروش و مرتبط
              </h1>
            </div>

            <Connected productTitle={product?.name} productId={product?.id} />
          </section>
    </div>
  );
};

export default ProductPage;
