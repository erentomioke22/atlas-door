"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "@components/posts/comments/comments";
import PageLoading from "@components/ui/loading/pageLoading";
import {  toast } from 'sonner'
import { useQuery,useQueryClient } from "@tanstack/react-query";
// import Conneccted from "@components/posts/Connected";
// import MoreByUser from "@components/posts/MoreByUser";
import moment from "moment";
import ProgressBar from "@components/ui/progressbar";
import { IoShareOutline } from "react-icons/io5";
import {usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
// import BookmarkButton from "@components/posts/bookMarkButton";
// import LikeButton from "@components/posts/likeButton";
import ImageCom from "@components/ui/Image";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import AddToCartButton from "@components/products/AddToCartButton";

const PostPage = ({name}) => {
  const [currentColor,setCurrentColor]=useState()
  const {data:session,update}=useSession()
  const pathName = usePathname();
  const currentUrl = `http://localhost:3000/${pathName}`;
  const router = useRouter()
  const queryClient = useQueryClient();
const {data: product,isFetching,status,}=useQuery({
    queryKey: ["product", name],
    queryFn: async()=>{
     const response = await axios.get(`/api/product/product?productName=${name}`);
     return response.data
    },
    onSuccess:(product)=>{
        setCurrentColor(product?.colors[0].id)
    }
  });

console.log(product,currentColor)

  if (status === "success" && (product.error || product.length <= 0) ) {
    return (
      <p className="text-center text-muted-foreground">
        No products found. Start following people to see their products here.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading products.
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
    toast.success("SHARE LINK COPIED")
  };

  return (
        <>
        <ProgressBar/>
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
                                <FaArrowLeftLong className="my-auto text-lg"/>
                                BACK
                         </button>

               <div className=" space-y-5 md:mt-7">
                <div className="space-y-3">
                   <p className="text-xl md:text-4xl w-full break-words text-black dark:text-white">{product.name}</p>   
                    {/* <div className="flex  space-x-2">
                           <span className="flex space-x-2">
                               {product?.tags?.map((tag) => {
                                 return (
                                   <p key={tag.name} className="text-[10px] md:text-[13px] text-lfont ">
                                     <span className="text-black dark:text-white">#</span> {tag.name}
                                   </p>
                                 );
                               })}
                           </span>


                    </div>   */}
                </div>

               </div>
               <div className='flex justify-between'>
              
                {/* <Link href={product?.team ? `/teams/${product?.team.name}` :`/${product?.user.name}`}
               className=' flex space-x-1 sm:space-x-2  w-fit p-1 text-[10px] hover:bg-lcard dark:hover:bg-dcard   duration-300 cursor-pointer rounded-lg truncate'>
               <div className='relative w-8 h-8'>
                <ImageCom src={product?.team ? product?.team.image : product?.user.image} className='h-8 w-8  rounded-lg' size={'h-8 w-8 '}/>
               </div>
               <div className='flex-1 truncate'>
                 <p className='truncate text-black dark:text-white'>{product?.team ? product?.team.displayName : product?.user.displayName}</p>
                 <p className=' truncate text-lfont' >
                  {product?.team  && <span className='text-redorange'>{product?.user.displayName} .</span>} 
                  {moment(new Date(product?.createdAt), "YYYYMMDD").fromNow()} - 
                  <span className="">
                     {Math.ceil(product?.content?.length / 2044) >= 18 ? Math.ceil(product?.content?.length / 2044) - 5 : Math.ceil(product?.content?.length / 2044)} min read
                  </span>
                  </p>
               </div>
                </Link> */}






             <div className="flex space-x-2 sm:space-x-3   my-auto">
        
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
            <button className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg" onClick={copyToClipboard}><IoShareOutline/></button>
         </div>
          {session?.user.id === product.sellerId &&
           <Link className={"bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"} href={`/edit-product/${product?.name}`}>
             <FaEraser/>
           </Link>
           }

          {/* <div>
            <BookmarkButton
                       postId={product.id}
                       initialState={{
                         isBookmarkedByUser: product?.bookmarks?.some(
                           (bookmark) => bookmark.userId === session?.user?.id,
                        ),
                     }}
                     className={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
                   /> 
          </div>

            <div>
                <Comments product={product}  />
            </div> */}

            

             </div>
               </div>
   
               {product?.colors.map((color) => {
            return (
              <div key={color.name}>
                <input
                  className="hidden peer"
                  type="radio"
                  value={color.id}
                  onClick={()=>{setCurrentColor(color.id)}}
                //   {...register("reason")}
                  id={color.name}
                  name="color"
                />
                <label
                  className="flex flex-col py-2 px-3  text-black dark:text-white border-2  cursor-pointer rounded-lg duration-300  peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black"
                  htmlFor={color.name}
                >
                  {color.name}
                </label>
              </div>
            );
          })}





<AddToCartButton
    className={"text-sm w-full flex justify-between  hover:bg-lcard rounded-lg p-2 dark:hover:bg-dcard duration-300"}
    productId={product?.id}
    price={product?.price}
    colorId={currentColor}
    name={name}
    initialState={{
        quantity: product?.cartItems?.find(
            (cartItem) => cartItem.userId === session?.user?.id && cartItem.colorId === currentColor
        )?.quantity || 1,
        isCarted: product?.cartItems?.some(
            (cartItem) => cartItem.userId === session?.user?.id && cartItem.colorId === currentColor
        ),
        userId: session?.user.id
    }}
    stocks={product?.colors?.find(color => color.id === currentColor)?.stocks || 0}
/>

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
        </>
  );
};

export default PostPage;
