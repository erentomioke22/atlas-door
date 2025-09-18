"use client";

import PostCard from "@components/posts/postCard";
import LoadingCard from "@components/ui/loading/loadingCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EmblaCarousel from "@components/ui/carousel/carousel";

function Conneccted({postTitle,postId}) {


  const {
    data:posts,
    isFetching,
    status,
    error
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




{status === "error" || posts?.error || error && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
      }

      {status === "success" && posts?.length <= 0  && 
        <p className="text-center text-lfont underline">
           هنوز پستی در اینجا قرار داده نشده
       </p>
      }

     <EmblaCarousel options={{loop:false,dragFree: true,direction:'rtl'}}                 
               dot={false}
               autoScroll={false}>
            {status === "pending" && 
                    Array(10)
                      .fill({})
                      .map((_,index) => {
                        return <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" key={index}><LoadingCard /></div>;
                  })
            }
          {posts?.map((post)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] sm:basis-auto  min-w-0 pl-4 sm:pr-2 my-2" 
         key={post.id}>
               <PostCard post={post} />
         </div>
          ))}
          
         
        </EmblaCarousel>

    </div>
  );
}

export default Conneccted;