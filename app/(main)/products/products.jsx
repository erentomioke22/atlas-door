"use client";

import React, { useState } from "react";
import ProductCard from "@components/products/productCard";
import InfiniteScrollContainer from "@components/InfiniteScrollContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@components/ui/dropdown";
import { useSession } from "next-auth/react";
import axios from "axios";
import LoadingCard from "@components/ui/loading/loadingCard";
import Footer from "@components/footer";
import Button from "@components/ui/button";


function Products() {

// const { data: session } = useSession();
// const [item,setItem] = useState(session ? "for-you" : "new-post")
// const path = usePathname();
// const url = path.split("/");

const router = useRouter();
const searchParams = useSearchParams();
const { data: session } = useSession();
const path = usePathname();
const url = path.split("/");

const categoryFromQuery = searchParams.get('category');
const tagFromQuery = searchParams.get('tag');

const [category, setCategory] = useState(categoryFromQuery || (session ? "for-you" : "new-product"));
const [tag, setTag] = useState(tagFromQuery || "discover");

// Update URL when category changes
const updateUrlWithCategory = (newCategory) => {
  const params = new URLSearchParams(searchParams);
  params.set('category', newCategory);
  router.push(`${path}?${params.toString()}`, { scroll: false });
  setCategory(newCategory);
};

// Update URL when tag changes
// const updateUrlWithTag = (newTag) => {
//   const params = new URLSearchParams(searchParams);
//   params.set('tag', newTag);
//   router.push(`${path}?${params.toString()}`, { scroll: false });
//   setTag(newTag);
// };


  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   status,
  // } = useInfiniteQuery({
  //   queryKey: ["post-feed", item],
  //   queryFn: async ({ pageParam = null }) => {
  //     const response = await axios.get(`/api/posts/home?category=${item}`, {
  //       params: pageParam ? { cursor: pageParam } : {},
  //     });
  //     return response.data;
  //   },
  //   getNextPageParam: (lastPage) => lastPage.nextCursor,
  // });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["product-feed",category],
    queryFn: async ({ pageParam = null }) => {
      // Fix the API call to use the category in the URL path as it was originally
      const response = await axios.get(`/api/product?category=${category}`, {
    //   const response = await axios.get(`/api/products/tag/${tag}?category=${category}`, {
        params: pageParam ? { cursor: pageParam } : {},
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const products = data?.pages.flatMap((page) => page.products) || [];
  console.log("posts", data);

//   const tags = [
//     { id: "1", name: "discover", link: "/" },
//     { id: "2", name: "crypto", link: "/posts/crypto" },
//     { id: "3", name: "forex", link: "/posts/forex" },
//     { id: "4", name: "stocks", link: "/posts/stocks" },
//     { id: "5", name: "future", link: "/posts/future" },
//     { id: "6", name: "airdrops", link: "/posts/airdrops" },
//     { id: "7", name: "news", link: "/posts/news" },
//     { id: "8", name: "learning", link: "/posts/learning" },
//     { id: "9", name: "exchange", link: "/posts/exchange" },
//     { id: "10", name: "trade", link: "/posts/trade" },
//     { id: "11", name: "begginers", link: "/posts/begginers" },
//     { id: "12", name: "skills", link: "/posts/skills" },
//     { id: "13", name: "ai", link: "/posts/ai" },
//     { id: "14", name: "tuturial", link: "/posts/tuturial" },
//   ];


  return (
    <div >

      {/* <div className="w-full  flex justify-center overflow-hidden">
        <div className="absolute w-full max-w-lg mt-24">
          <div className="absolute top-0 -left-4             w-32 h-32 md:w-72 md:h-72            bg-purple      rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob "></div>
          <div className="absolute top-0 left-44             w-32 h-32 md:w-72 md:h-72            bg-yellow      rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob animation-delay-4000"></div>
          <div className="absolute top-0 left-20  -bottom-20 w-32 h-32 md:w-72 md:h-72            bg-redorange   rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob animation-delay-6000"></div>
        </div>
      </div> */}
       

    <div className="w-full sm:px-20 md:px-5 px-3 mb-10 space-y-10">


              <div className="sm:flex gap-2 sm:justify-center">
        <div className=" px-1 py-2  flex text-nowrap overflow-x-auto space-x-2 md:text-sm text-[10px]">
        {/* {session &&  
              <>
               <Button variant={item === "for-you" ? "menuActive"  : "menu"} className={'px-2 py-1'}  onClick={()=>{setItem("for-you")}}>
                For You
               </Button>
             
               <Button variant={item === "following" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=>{setItem("following")}}>
                Following
               </Button>
              </>
              }
     
               <Button variant={item === "popular" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=>{setItem("popular")}}>
                 Popular
               </Button>
     
                <Button variant={item === "new-product" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=>{setItem("new-post")}}>
                  New Posts
                </Button>   */}
        {session &&  
              <>
               <Button variant={category === "for-you" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("for-you")}>
                For You
               </Button>
             
               <Button variant={category === "following" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("following")}>
                Following
               </Button>
              </>
              }
     
               <Button variant={category === "popular" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("popular")}>
                 Popular
               </Button>
     
                <Button variant={category === "new-product" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("new-post")}>
                  New products
                </Button> 

        </div>

        {/* <div className="my-auto max-sm:my-5">
        <Dropdown
              className={"right-0 w-52 max-h-52 overflow-y-scroll"}
              title={tag}
              btnStyle={
                "bg-lcard dark:bg-dcard p-2 md:text-sm text-[10px] rounded-lg uppercase w-full "
              }
            >
              <div className="space-y-2 flex flex-col p-2">
                {tags.map((tagItem) => (
                  <button
                    key={tagItem.id}
                    onClick={() => {
                      updateUrlWithTag(tagItem.name);
                    }}
                    className={`duration-300 px-2 py-2 w-full text-left rounded-lg capitalize ${
                      tag === tagItem.name
                        ? "bg-lcard dark:bg-dcard"
                        : "hover:bg-lcard dark:hover:bg-dcard"
                    }`}
                  >
                    {tagItem.name}
                  </button>
                ))}
              </div>
            </Dropdown>
        </div> */}

</div>
    {status === "error" && 
          <p className="text-center text-lfont ">
            An error occurred while loading products.
          </p>
      }

      {status === "success" && !products.length && !hasNextPage && 
        <p className="text-center text-lfont ">
           No one has producted anything yet.
       </p>
      }
      <InfiniteScrollContainer className={''} onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        <div className="max-xl:flex max-xl:flex-wrap  gap-10 justify-center xl:grid xl:grid-cols-4  w-full mx-auto max-w-[140rem]">
    {status === "pending" &&
      Array(8).fill({}).map((_, index) => {
        return <LoadingCard key={index} />;
      })}
    {products.map((product) => (
        <ProductCard product={product} key={product?.id}/> 
    ))}
    {isFetchingNextPage &&
      Array(3).fill({}).map((_, index) => {
        return <LoadingCard key={index} />;
      })}
        </div>
</InfiniteScrollContainer>


    </div>

    </div>
  );
}

export default Products;