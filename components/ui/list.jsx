"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import LoadingPage from "@components/ui/loading/loadingPage";
import axios from "axios";
import PostCard from "@components/posts/postCard";
import { useQuery } from "@tanstack/react-query";

const List = () => {
  const [postPerPage, setPostPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [arrOfCurrentPage, setArrOfCurrentPage] = useState([]);
  const dotsInitial = "...";
  const dotsLeft = "... ";
  const dotsRight = " ...";
  const [item,setPath] = useState('')

  const { data, status, isFetching } = useQuery({
    queryKey: ["post-feed", "user-posts", `/posts/tag/${item}`, currentPage, postPerPage],
    // enabled:currentPage,
    queryFn: async () => {
      const response = await axios.get(
        `/api/posts/tag/${item}?pgnum=${currentPage}&pgsize=${postPerPage}`
      );
      return response.data;
    },
    staleTime: 0,
    keepPreviousData: true,
  });
  // console.log(data);

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
      // console.log(pages.length);
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

  return (
    <>


<div  className="px-3 py-2  flex text-nowrap   lg:justify-center overflow-x-auto gap-2 md:text-sm text-[10px] my-20">
            <div>
             <button className={`duration-300  ${item === "" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("")}}>
                همه
             </button>
            </div>

             <div>
              <button className={`duration-300  ${item === "شیشه سکوریت" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("شیشه سکوریت")}}>
                شیشه سکوریت
              </button>  
             </div>

            <div>
             <button className={`duration-300  ${item === "درب اتوماتیک" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("درب اتوماتیک")}}>
               درب اتوماتیک
             </button>
            </div>
             
            <div>
             <button className={`duration-300  ${item === "کرکره برقی" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("کرکره برقی")}}>
              کرکره برقی
             </button>
            </div>
            
             <div>
              <button className={`duration-300  ${item === "شیشه بالکنی" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("شیشه بالکنی")}}>
                 شیشه بالکنی
              </button>  
             </div>

             {/* <div>
              <button className={`duration-300  ${item === "upvc" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("upvc")}}>
                   UPVC پنجره 
              </button>  
             </div> */}


            
            
            
             {/* <div>
              <button className={`duration-300  ${item === "راهبند پارکیگ" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("راهبند پارکیگ")}}>
                پرده برقی
              </button>  
             </div> */}

             {/* <div>
              <button className={`duration-300  ${item === "راهبند پارکیگ" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("راهبند پارکیگ")}}>
                سایبان برقی
              </button>  
             </div> */}

             {/* <div>
              <button className={`duration-300  ${item === "راهبند پارکیگ" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("راهبند پارکیگ")}}>
               راهبند پارکینگ
              </button>  
             </div>
            
            <div>
             <button className={`duration-300  ${item === "جک پارکینگ" ? "bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setPath("جک پارکینگ")}}>
               جک پارکینگ
             </button>
            </div> */}
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
        <div className={`px-5 max-sm:space-y-5 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-5 my-10 `}>
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

        {!count || status === "pending" || !posts.length || (
          <>
            <div className="flex justify-center mt-10 space-x-2 text-[10px]">
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
            <div className="flex justify-center space-x-2 mt-5 text-[10px]">
              <button
                disabled={currentPage === 0}
                className={`${
                  currentPage === 0
                    ? "disabled disabled:cursor-not-allowed   bg-lbtn border-lbtn text-lfont  py-1 px-3 rounded-lg dark:bg-dbtn"
                    : "bg-lcard rounded-lg  py-1 px-3 duration-500 border border-lbtn text-lfont hover:bg-lbtn dark:bg-dcard dark:hover:bg-dbtn dark:border-dbtn"
                }`}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
              >
                PREV
              </button>
              <button
                disabled={currentPage === Math.ceil(count / postPerPage) - 1}
                className={`${
                  currentPage === Math.ceil(count / postPerPage) - 1
                    ? "disabled disabled:cursor-not-allowed   bg-lbtn border-lbtn text-lfont  py-1 px-3 rounded-lg dark:bg-dbtn"
                    : "bg-lcard rounded-lg  py-1 px-3 duration-500 border border-lbtn text-lfont hover:bg-lbtn dark:bg-dcard dark:hover:bg-dbtn dark:border-dbtn"
                }`}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                NEXT
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  function handleDotsClick(dotType) {
    if (dotType === dotsInitial) {
      setCurrentPage(arrOfCurrentPage[arrOfCurrentPage.length - 3]);
      // console.log(dotType, "middle");
    } else if (dotType === dotsLeft) {
      setCurrentPage(currentPage - 3);
    } else if (dotType === dotsRight) {
      setCurrentPage(currentPage + 3);
    }
  }
};

export default List;
