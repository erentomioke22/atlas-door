"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Comments from "@/components/posts/comments/comments";
import PageLoading from "@/components/ui/loading/pageLoading";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Conneccted from "@/components/posts/Connected";
import moment from "moment";
import ProgressBar from "@/components/ui/progressbar";
import { IoShareOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import ImageCom from "@/components/ui/Image";
import { FaArrowLeftLong, FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import TableOfContents from "@/components/posts/TocPost";
import { PostLite } from "@/components/posts/postCard";
import type { Session } from "@/lib/auth";



interface PostPageProps {
  initialPost: PostLite;
  session:Session | null
}

const PostPage: React.FC<PostPageProps> = ({ initialPost,session }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const pathName = usePathname();
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${pathName}`;

  const { data: post, isLoading, status, error } = useQuery<PostLite>({
    queryKey: ["post", initialPost.slug],
    queryFn: async (): Promise<PostLite> => {
      const response = await axios.get(`/api/posts?postTitle=${initialPost.slug}`);
      return response.data;
    },
    initialData: initialPost,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false
  });

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("لینک اشتراک گذاری ک‍پی شد");
  };

  if (status === "success" && !post) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        هیچ مقاله ای یافت نشد
      </p>
    );
  }

  if (status === "error" || error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        مشکلی در برقراری ارتباط وجود دارد
      </p>
    );
  }

  return (
    <>
      <ProgressBar />
      <div className="px-5 container sm:max-w-4xl xl:max-w-6xl  mx-auto ">
        {!post && isLoading ? (
          <PageLoading />
        ) : (
          <div className="flex flex-col gap-7">

            <Link href="/" className="flex text-sm ">
                بازگشت
                <FaArrowLeftLong className="my-auto " />
              </Link>
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
                          <h3 key={tag.name} className="text-[10px] md:text-[13px] text-lfont text-nowrap">
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
                  <div className='relative w-8 h-8'>
                    {post?.user.image === null ? (
                      <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
                    ) : (
                      <ImageCom
                        src={post?.user?.image ?? ""}
                        className='h-8 w-8  rounded-lg'
                        size={'h-8 w-8 '}
                        alt={`${post?.user?.name} avatar`}
                      />
                    )}
                  </div>
                  <div className='flex-1 truncate'>
                    <p className='truncate capitalize'>{post?.user.displayName || post?.user.name}</p>
                    <p className=' truncate text-lfont'>
                      {moment(new Date(post?.createdAt), "YYYYMMDD").fromNow()} -
                      <span className="">
                        {Math.ceil(post.content.length / 2044) >= 18 ? Math.ceil(post.content.length / 2044) - 5 : Math.ceil(post.content.length / 2044)} دقيقه
                      </span>
                    </p>
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
                    <button aria-label="share post" title="share post" className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg" onClick={copyToClipboard}>
                      <IoShareOutline />
                    </button>
                  </div>
                  {session?.user?.id === post?.userId && (
                    <Link className={"bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"} href={`/admin/edit-post/${post?.slug}`}>
                      <FaEraser />
                    </Link>
                  )}

                  <div>
                    <Comments post={post} session={session}/>
                  </div>

                  <div>
                    <TableOfContents content={contentRef?.current} />
                  </div>
                </div>
              </div>
            </header>

            <div
              id="post-content"
              ref={contentRef}
              className="content wrap-break-word w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  "
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />

            <div className="   space-y-10 ">
              <div>
                <h1 className="text-lg sm:text-xl text-lfont">
                  <span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">مقاله های</span>    محبوب و مرتبط
                </h1>
                <p className=" text-md text-lfont">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p>
              </div>

              <Conneccted postTitle={post?.title} postId={post?.id} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostPage;
