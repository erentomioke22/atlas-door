"use client";

import PostCard from "@components/posts/postCard";
import LoadingPage from "@components/ui/loading/loadingCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


function Conneccted({postTitle,postId}) {


  const {
    data:posts,
    isFetching,
    status,
  } = useQuery({
    queryKey: ["connected-Post",postTitle],
    queryFn: async () => {
      const response = await axios.get(
        `/api/posts/connected?postTitle=${postTitle}&postId=${postId}`
      );
      return response.data;
    },
  });

  // const posts = data?.pages.flatMap((page) => page.posts) || [];


  return (
    <div className="px-7 space-y-5">

      <div>
        <div className="text-center space-y-3">
          <p className="text-4xl md:text-[60px] leading-normal ">مقاله  های مرتبط </p>
          <p className=" text-md text-lfont">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p>
        </div>
     </div>


     {status === "error" && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
      }

      {status === "success" && posts?.length <= 0  && 
        <p className="text-center text-lfont underline">
           هنوز پستی در اینجا قرار داده نشده
       </p>
      }

        <div className="w-full max-sm:space-y-5 sm:flex sm:flex-wrap gap-3 justify-center">
          {status === "pending" && 
                  Array(3)
                    .fill({})
                    .map((_,index) => {
                      return <LoadingPage key={index}/>;
                })
          }
          {posts?.map((post) => (
            <div key={post?.id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>



    </div>
  );
}

export default Conneccted;