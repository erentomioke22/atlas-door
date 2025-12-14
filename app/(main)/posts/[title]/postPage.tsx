"use client";

import React, { useEffect, useRef, useState , useMemo } from "react";
import axios from "axios";
import PageLoading from "@/components/ui/loading/pageLoading";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import ProgressBar from "@/components/ui/progressbar";
import { IoShareOutline } from "react-icons/io5";
import { usePathname , useRouter  } from "next/navigation";
import ImageCom from "@/components/ui/Image";
import { FaArrowLeftLong, FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import { PostLite } from "@/components/posts/postCard";
import type { Session } from "@/lib/auth";
import dynamic from "next/dynamic";
import Button from "@/components/ui/button";
import { getReadingTime } from "@/lib/utils";
interface PostPageProps {
  initialPost: PostLite;
  session:Session | null
}


const Comments = dynamic(() => import("@/components/posts/comments/comments"));
const Conneccted = dynamic(() => import("@/components/posts/Connected"));
const TableOfContents = dynamic(() => import("@/components/posts/TocPost"));

const PostPage: React.FC<PostPageProps>  = ({ initialPost,session }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathName = usePathname();

  const currentUrl = useMemo(() => 
    `${process.env.NEXT_PUBLIC_BASE_URL}${pathName}`,
    [pathName]
  );

  const { data: post, isLoading, error } = useQuery<PostLite>({
    queryKey: ["post", initialPost.slug],
    queryFn: async (): Promise<PostLite> => {
      const response = await axios.get(`/api/posts?postTitle=${initialPost.slug}`);
      return response.data;
    },
    initialData: initialPost,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const readingTime = useMemo(() => 
    getReadingTime(post.content),
    [post.content]
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.desc || '',
          url: currentUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(currentUrl);
        toast.success("لینک کپی شد");
      }
    } else {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("لینک کپی شد");
    }
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


  if (isLoading) {
    return(
    <div className="container max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-6 py-8 ">
       <PageLoading/>
    </div>
    )
    ;
  }

  return (
    <>
      <ProgressBar />
      <div className="container max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-6 py-8 mt-16">


        <Button
          variant="back"
          onClick={()=>router.back()}
          className="mb-6 text-sm flex"
        >
          بازگشت
          <FaArrowLeftLong className="ml-2 my-auto " />
        </Button>

            <header className="space-y-5">
              <div className=" space-y-5 md:mt-7">
                <div className="space-y-3">
                  <p className="text-xl md:text-4xl w-full wrap-break-word text-black dark:text-white leading-8 md:leading-[60px]">
                    {post.title}
                  </p>
                  <div className="flex  gap-2">
                    <span className="flex gap-2 flex-wrap">
                      {post?.tags?.map((tag) => {
                        return (
                          <h3 key={tag.name} className="text-[10px] md:text-[13px] text-neutral-500 dark:text-neutral-400 text-nowrap">
                            <span className="text-black dark:text-white">#</span> {tag.name}
                          </h3>
                        );
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className=' flex gap-1 sm:gap-2  w-fit p-1 text-[10px]   duration-300 rounded-lg truncate'>
                    {post?.user.image === null ? (
                      <div className="h-8 w-8 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
                    ) : (
                      <ImageCom
                        src={post?.user?.image ?? ""}
                        className='h-8 w-8  rounded-lg'
                        alt={`${post?.user?.name} avatar`}
                      />
                    )}
                  <div className='flex-1 truncate'>
                    <p className='truncate capitalize'>{post?.user.displayName || post?.user.name}</p>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate text-neutral-500 dark:text-neutral-300">
                  <time  dateTime={post.createdAt.toISOString()}>
                    {moment(new Date (post.createdAt), "YYYYMMDD").fromNow()}
                  </time>
                  <span>-</span>
                  <span >{readingTime} دقیقه مطالعه</span>
                </div>
                  </div>
                </div>

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
                    <button aria-label="share post" title="share post" className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg" onClick={handleShare}>
                      <IoShareOutline />
                    </button>
                  </div>
                  {session?.user?.id === post?.userId && (
                    <Link className={"bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"} href={`/admin/edit-post/${post?.slug}`}>
                      <FaEraser />
                    </Link>
                  )}

                    <Comments post={post} session={session}/>

                    <TableOfContents content={contentRef?.current} />
                </div>
              </div>
            </header>

            <article
              ref={contentRef}
              className="content wrap-break-word w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  prose prose-lg dark:prose-invert max-w-none my-12"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />

            <section className="   space-y-10 ">
              <div>
                <h1 className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-300">
                  <span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">مقاله های</span>    محبوب و مرتبط
                </h1>
                <p className=" text-md text-neutral-500 dark:text-neutral-300">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p>
              </div>

              <Conneccted postTitle={post?.title} postId={post?.id} />
            </section>
      </div>
    </>
  );
};





export default PostPage;




  