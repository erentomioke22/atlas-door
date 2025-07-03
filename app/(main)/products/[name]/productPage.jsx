"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "@components/products/comments/comments";
import PageLoading from "@components/ui/loading/pageLoading";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Conneccted from "@components/posts/Connected";
// import MoreByUser from "@components/posts/MoreByUser";
import moment from "moment";
import ProgressBar from "@components/ui/progressbar";
import { IoShareOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
// import BookmarkButton from "@components/posts/bookMarkButton";
// import LikeButton from "@components/posts/likeButton";
import ImageCom from "@components/ui/Image";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import AddToCartButton from "@components/products/AddToCartButton";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { formatPrice,formatNumber } from "@lib/utils";

const PostPage = ({ name }) => {
  const [currentColor, setCurrentColor] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentStocks, setCurrentStocks] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [currentColorName, setCurrentColorName] = useState("");
  const { data: session, update } = useSession();
  const pathName = usePathname();
  const currentUrl = `http://localhost:3000/${pathName}`;
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: product,
    isFetching,
    status,
  } = useQuery({
    queryKey: ["product", name],
    queryFn: async () => {
      const response = await axios.get(
        `/api/product/product?productName=${name}`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (product?.colors?.length > 0 && !currentColor) {
      setCurrentColor(product.colors[0].id);
      setCurrentColorName(product.colors[0].name);
      setCurrentPrice(formatPrice(product.colors[0].price));
      setCurrentStocks(formatPrice(product.colors[0].stocks));

      const prices = product.colors.map((color) => color.price);
      setMinPrice(formatPrice(Math.min(...prices)));
      setMaxPrice(formatPrice(Math.max(...prices)));
    }
  }, [product, currentColor]);

  console.log(product, currentColor, currentPrice);

  if (status === "success" && product.length <= 0 ) {
    return (
      <p className="text-center text-muted-foreground">
         .هيچ محصولي يافت نشد
      </p>
    );
  }

  if (status === "error" || product?.error) {
    return (
      <p className="text-center text-destructive">
        مشكلي در برقراري ارتباط وجود دارد
      </p>
    );
  }

  //   useEffect(() => {
  //     if (status === "success" && product?.id) {
  //       axios.post(`/api/products/${product.id}/view`)
  //         .then(response => console.log(response.data)
  //         )
  //         .catch(error => console.error(error)
  //         );
  //     }
  //   }, [status, product]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("SHARE LINK COPIED");
  };

  return (
      <div className="px-5 w-full sm:w-4/5 lg:w-4/6 xl:w-3/5 mx-auto space-y-10 md:space-y-20">
        {status === "pending" ? (
          <PageLoading />
        ) : (
          <div className="mx-auto w-full space-y-10">
            <button
              className={"text-sm px-3  py-1   flex"}
              onClick={() => router.back()}
              type="button"
            >
              بازگشت
              <FaArrowLeftLong className="my-auto text-lg" />
            </button>
            <div className="flex gap-2 sm:gap-3   my-auto">
                {/* <div>
           <LikeButton
            isBlocked={{
              isBlockedByUser: product.user?.blockers?.some(
                (blocker) => blocker.blockerId === session?.user?.id,
             ),
             }}
              api={`/api/products/${product.id}/likes`}
              query={["like-info", product.id]}
              initialState={{
                likes: product?._count?.likes,
                isLikedByUser: product?.likes?.some((like) => like.userId === session?.user?.id),
              }}
              className={'  bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
              count={false}
            />
        </div> */}

                <div>
                  <button
                    className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
                    onClick={copyToClipboard}
                  >
                    <IoShareOutline />
                  </button>
                </div>
                {session?.user.id === product.sellerId && (
                  <Link
                    className={
                      "bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
                    }
                    href={`/admin/edit-product/${product?.name}`}
                  >
                    <FaEraser />
                  </Link>
                )}

                

                <div>
                <Comments product={product}  />
                </div>
              </div>

            <div className=" space-y-5 md:mt-7">
              <div className="space-y-3">
              {minPrice !== maxPrice && (
                 <p className=" text-lfont text-[10px] md:text-sm">از{minPrice} تا {maxPrice} تومان</p>
                 )}
                <h1 className="text-xl md:text-4xl w-full break-words text-black dark:text-white">
                  {product.name}
                </h1>
                <p className="text-lfont ">{product.desc}</p>
              </div>
            </div>


            <div className="flex justify-between gap-2">
              <div className="flex gap-3 flex-wrap">
                {product?.colors.map((color) => {
                  return (
                    <div key={color.name}>
                      <input
                        className="hidden peer"
                        type="radio"
                        value={color.id}
                        onClick={() => {
                          setCurrentColor(color.id);
                          setCurrentPrice(formatPrice(color.price));
                          setCurrentColorName(color.name);
                          setCurrentStocks(color.stocks);
                        }}
                        checked={currentColor === color.id}
                        //   {...register("reason")}
                        id={color.name}
                        name="color"
                      />
                      <label
                        className="flex flex-col  ring-2 ring-lbtn dark:ring-dbtn  outline-none  peer-checked:outline-2 peer-checked:ring-0 cursor-pointer rounded-md sm:rounded-lg duration-300  peer-checked:outline-black peer-checked:border-0 dark:peer-checked:outline-white "
                        htmlFor={color.name}
                      >
                        <div
                          className="w-5 h-5 sm:w-7  sm:h-7  my-auto rounded-md sm:rounded-lg"
                          style={{ backgroundColor: color.hexCode }}
                        >
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm sm:text-lg my-auto">
                <p> رنگ - {currentColorName}</p>
                <div>
         {/* <p className="text-sm"> {currentStocks} - موجودی</p> */}
      </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex my-auto gap-2">
                <button className="bg-lcard dark:bg-dcard rounded-xl text-sm px-3 py-2 ">
                  خريد
                </button>

                <AddToCartButton
                  // className={"text-sm w-full flex justify-between   rounded-lg p-2  duration-300"}
                  productId={product?.id}
                  price={product?.price}
                  colorId={currentColor}
                  name={name}
                  initialState={{
                    quantity:
                      product?.cartItems?.find(
                        (cartItem) =>
                          cartItem.userId === session?.user?.id &&
                          cartItem.colorId === currentColor
                      )?.quantity || 1,
                    isCarted: product?.cartItems?.some(
                      (cartItem) =>
                        cartItem.userId === session?.user?.id &&
                        cartItem.colorId === currentColor
                    ),
                    userId: session?.user.id,
                  }}
                  stocks={
                    product?.colors?.find((color) => color.id === currentColor)
                      ?.stocks || 0
                  }
                />
              </div>
          <div>
            
          <div className=" text-sm bg-lcard dark:bg-dcard  rounded-md px-3 py-1 gap-1 flex flex-col my-auto">
          <div >
            <p > قیمت - {currentPrice} تومان</p>
          </div>
          <div className="my-auto flex justify-between">
       <p >موجودي</p>
      <span className="  dark:bg-dcard rounded p-1 ">{formatNumber(currentStocks)}</span>
          </div>
      </div>
          </div>

            </div>


           <div>
            <EmblaCarousel
              options={{ loop: false, direction: "rtl" }}
              dot={true}
              buttons={true}
              autoScroll={false}
              length={product?.images?.length > 1}
            >
              {product?.images?.map((image, index) => (
                <div
                  className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-52 md:h-128 min-w-0 pl-4 "
                  key={index}
                >
                  <ImageCom
                    className={`  w-full h-full object-cover rounded-xl`}
                    src={image}
                    alt={"post thumnail"}
                  />
                </div>
              ))}
            </EmblaCarousel>
           </div>

            <div
              className="content break-words w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  "
              dangerouslySetInnerHTML={{ __html: product.content }}
            />

            {/* <div className="px-5 sm:px-10 mx-auto  space-y-10 ">
            <h1 className="text-lg sm:text-xl text-lfont"><span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">{post?.user.displayName}</span> More And Top Posts</h1>
           <MoreByUser postTitle={title} writerId={post?.userId}/> 
          </div>

          <div className="px-5 sm:px-10 mx-auto  space-y-10 ">
            <h1 className="text-lg sm:text-xl text-lfont"><span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">Connected</span>  And Top Posts</h1>
            <Conneccted postTitle={title} postId={post?.id}/>
          </div> */}
          </div>
        )}
      </div>
  );
};

export default PostPage;


