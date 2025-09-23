'use client'

import React, { useEffect } from "react";
import { useState } from "react";
import LoadingPage from "@components/ui/loading/loadingCard";
import axios from "axios";
import PostCard from "@components/posts/postCard";
import { useQuery } from "@tanstack/react-query";
import { useRouter , useSearchParams ,usePathname} from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import Button from "@components/ui/button";
import Dropdown from "@components/ui/dropdown";


const PostList = () => {
  const router = useRouter();
  const [postPerPage, setPostPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [arrOfCurrentPage, setArrOfCurrentPage] = useState([]);
  const dotsInitial = "...";
  const dotsLeft = "... ";
  const dotsRight = " ...";


  const searchParams = useSearchParams();
  const path = usePathname();
  
  const categoryFromQuery = searchParams.get('category');
  const tagFromQuery = searchParams.get('tag');
  
  const [category, setCategory] = useState(categoryFromQuery || "new-post");
  const [tag, setTag] = useState(tagFromQuery || "");
  
  // Update URL when category changes
  const updateUrlWithCategory = (newCategory) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', newCategory);
    router.push(`${path}?${params.toString()}`, { scroll: false });
    setCategory(newCategory);
  };
  
  // Update URL when tag changes
  const updateUrlWithTag = (newTag) => {
    const params = new URLSearchParams(searchParams);
    params.set('tag', newTag);
    router.push(`${path}?${params.toString()}`, { scroll: false });
    setTag(newTag === "همه ی وبلاگ ها" ? "" : newTag);
  };












  const { data, status, isFetching } = useQuery({
    queryKey: ["post-feed", "user-posts", `/posts/tag//${tag}?category=${category}`, currentPage, postPerPage],
    // enabled:currentPage,
    queryFn: async () => {
      const response = await axios.get(
        `/api/posts/tag/${tag}?category=${category}&pgnum=${currentPage}&pgsize=${postPerPage}`
      );
      return response.data;
    },
    staleTime: 0,
    keepPreviousData: true,
  });
  
  const posts = data?.posts || data?.posts?.post || [];
  const count = data?.count || 0;
  


  let pages = [];
  for (let i = 1; i <= Math.ceil(count / postPerPage); i++) {
    pages.push(i);
  }

  useEffect(() => {
    let tempNumberOfPages = [...pages];

    let dotsInitial = "...";
    let dotsLeft = "... ";
    let dotsRight = " ...";

    if (currentPage >= 1 && currentPage < 5) {
      tempNumberOfPages = [...pages];
    }

    if (pages.length >= 5) {
      const sliced = pages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, pages.length];

      if (currentPage >= 5 && currentPage < pages.length - 3) {
        const sliced1 = pages.slice(currentPage - 2, currentPage);
        const sliced2 = pages.slice(currentPage, currentPage + 1);
        tempNumberOfPages = [
          1,
          dotsLeft,
          ...sliced1,
          ...sliced2,
          dotsRight,
          pages.length,
        ];
      } else if (currentPage >= pages.length - 3) {
        const sliced4 = pages.slice(pages.length - 3);
        tempNumberOfPages = [1, dotsLeft, ...sliced4];
      }
    }
    setArrOfCurrentPage(tempNumberOfPages);
  }, [currentPage, count]);




  const tags = [
    { id: "1", name: "همه ی وبلاگ ها", link: "همه ی وبلاگ ها"},
    { id: "2", name: "شیشه سکوریت", link: "شیشه سکوریت" },
    { id: "3", name: "لمینت", link: "لمینت" },
    { id: "4", name: "درب اتوماتیک", link: "درب اتوماتیک" },
    { id: "5", name: "نصب", link: "نصب" },
    { id: "6", name: "خدمات", link: "خدمات" },
    { id: "7", name: "کرکره برقی", link: "کرکره برقی" },
    { id: "8", name: "جام بالکن", link: "جام بالکن" },
    // { id: "9", name: "exchange", link: "/posts/exchange" },
    // { id: "10", name: "trade", link: "/posts/trade" },
    // { id: "11", name: "begginers", link: "/posts/begginers" },
    // { id: "12", name: "skills", link: "/posts/skills" },
    // { id: "13", name: "ai", link: "/posts/ai" },
    // { id: "14", name: "tuturial", link: "/posts/tuturial" },
  ];


  return (
    <div className="px-7 container max-w-7xl  mx-auto space-y-20">

          <div className="flex justify-between mt-16">
              <h1 className="text-2xl">مقاله ها</h1>

                     <button
                         className={"text-sm px-3  py-1    flex"}
                         onClick={() => router.push('/')}
                         type="button"
                               >
                                بازگشت
                                <FaArrowLeftLong className="my-auto "/>
                         </button>
          </div>



              <div className="sm:flex gap-2 sm:justify-center">
        <div className=" px-1 py-2  flex text-nowrap overflow-x-auto gap-2 md:text-sm text-[10px]">

        {/* {session &&  
              <>
               <Button variant={category === "for-you" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("for-you")}>
                For You
               </Button>
             
               <Button variant={category === "following" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("following")}>
                Following
               </Button>
              </>
              } */}
     
               <Button variant={category === "popular" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("popular")}>
                 محبوب ترین ها
               </Button>
     
                <Button variant={category === "new-post" ? "menuActive"  : "menu"} className={'px-2 py-1'} onClick={()=> updateUrlWithCategory("new-post")}>
                  جدید ترین ها
                </Button> 

        </div>
        <div className="my-auto max-sm:my-5">
        <Dropdown
              className={"right-0 w-52 max-h-52 overflow-y-scroll"}
              title={tag === "" ? "همه ی وبلاگ ها" : tag}
              btnStyle={
                "bg-lcard dark:bg-dcard p-2 md:text-sm text-[10px] rounded-lg uppercase w-full "
              }
            >
              <div className="space-y-2 flex flex-col p-2">
                {tags.map((tagItem) => (
                  <button
                    key={tagItem.id}
                    onClick={() => {
                      updateUrlWithTag(tagItem.link);
                    }}
                    className={`duration-300 px-2 py-2 w-full text-right rounded-lg capitalize ${
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
        </div>

</div>




            {status === "error" && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
      }

      {status === "success" && !posts?.length  && 
        <p className="text-center text-lfont underline">
           هنوز پستی در اینجا قرار داده نشده
       </p>
      }
      <div className="my-10">
        <div className='px-5 max-sm:space-y-5 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-5 my-10 '>
          {status === "pending" ? (
            <>
              {Array(postPerPage)
                .fill({})
                .map((_,index) => {
                  return <LoadingPage key={index}/>;
                })}
            </>
          ) : (
            posts.map((post) => (
              <div key={post?.id}>
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>

        {status === "pending" || posts.length <= 0 || count <= 0 ||  (
          <>
            <div className="flex justify-center mt-10 gap-2 text-[10px]">
              {arrOfCurrentPage.map((page, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      page === dotsInitial ||
                      page === dotsLeft ||
                      page === dotsRight
                        ? handleDotsClick(page)
                        : setCurrentPage(page - 1);
                    }}
                    className={`${
                      currentPage === page - 1
                         ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-lg border-2 border-black px-2 py-1   "  
                         : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-lg  px-2 py-1 "
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center gap-2 mt-5 text-[10px]">
              <button
                disabled={currentPage === 0}
                className={`${
                  currentPage === 0
                    ? "disabled disabled:cursor-not-allowed   bg-lbtn border-lbtn  py-1 px-3 rounded-lg dark:bg-dbtn"
                    : "bg-lcard rounded-lg  py-1 px-3 duration-500 border border-lbtn   dark:bg-dcard  dark:border-dbtn"
                }`}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
              >
                قبلي
              </button>
              <button
                disabled={currentPage === Math.ceil(count / postPerPage) - 1}
                className={`${
                  currentPage === Math.ceil(count / postPerPage) - 1
                    ? "disabled disabled:cursor-not-allowed   bg-lbtn border-lbtn   py-1 px-3 rounded-lg dark:bg-dbtn"
                    : "bg-lcard rounded-lg  py-1 px-3 duration-500 border border-lbtn   dark:bg-dcard  dark:border-dbtn"
                }`}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                بعدي
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function handleDotsClick(dotType) {
    if (dotType === dotsInitial) {
      setCurrentPage(arrOfCurrentPage[arrOfCurrentPage.length - 3]);
    } else if (dotType === dotsLeft) {
      setCurrentPage(currentPage - 3);
    } else if (dotType === dotsRight) {
      setCurrentPage(currentPage + 3);
    }
  }
};

export default PostList;

