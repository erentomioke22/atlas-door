"use client";

import React, { useEffect,useRef,useState } from "react";
import axios from "axios";
import Comments from "@components/posts/comments/comments"
import PageLoading from "@components/ui/loading/pageLoading";
import {  toast } from 'sonner'
import { useQuery,useQueryClient } from "@tanstack/react-query";
import Conneccted from "@components/posts/Connected";
import moment from "moment";
import ProgressBar from "@components/ui/progressbar";
import { IoShareOutline } from "react-icons/io5";
import {usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
// import BookmarkButton from "@components/posts/bookMarkButton";
// import LikeButton from "@components/posts/likeButton";
// import MoreByUser from "@components/posts/MoreByUser";
import ImageCom from "@components/ui/Image";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong,FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { FaEraser } from "react-icons/fa6";
import TableOfContents from "@components/posts/TocPost";
import Accordion from "@components/ui/Accordion";


const PostPage = ({title}) => {

  const {data:session,update}=useSession()
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const pathName = usePathname();
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${pathName}`;
  const router = useRouter()
  const queryClient = useQueryClient();
const {data: post,isFetching,status,error}=useQuery({
    queryKey: ["post", title],
    queryFn: async()=>{
     const response = await axios.get(`/api/posts?postTitle=${title}`);
     return response.data
    }
  });


  if (status === "success" && post?.length <= 0 ) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.!!!
      </p>
    );
  }
  
  if (status === "error" || post?.error) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }




  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      setProgress(scrollProgress);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  },[]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("لینک اشتراک گذاری ک‍پی شد")
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
                         className={"text-sm px-3  py-1  max-sm:mt-5 flex"}
                         onClick={() => router.back()}
                         type="button"
                               >
                                بازگشت
                                <FaArrowLeftLong className="my-auto text-lg"/>
                         </button>

               <div className=" space-y-5 md:mt-7">
                <div className="space-y-3">
                   <p className="text-xl md:text-4xl w-full break-words text-black dark:text-white">{post.title}</p>   
                    <div className="flex  gap-2">
                           <span className="flex gap-2 flex-wrap">
                               {post?.tags?.map((tag) => {
                                 return (
                                   <p key={tag.name} className="text-[10px] md:text-[13px] text-lfont text-nowrap">
                                     <span className="text-black dark:text-white">#</span> {tag.name}
                                   </p>
                                 );
                               })}
                           </span>


                    </div>  
                </div>

               </div>
               <div className='flex justify-between'>
              
                <div
               className=' flex gap-1 sm:gap-2  w-fit p-1 text-[10px] hover:bg-lcard dark:hover:bg-dcard   duration-300 cursor-pointer rounded-lg truncate'>
               <div className='relative w-8 h-8'>
               {post?.user.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                <ImageCom src={post?.user.image} className='h-8 w-8  rounded-lg' size={'h-8 w-8 '}  alt={`${post?.user?.name} avatar`}/>
                  }
               </div>
               <div className='flex-1 truncate'>
                 <p className='truncate text-black dark:text-white'>{post?.user.displayName}</p>
                 <p className=' truncate text-lfont' >
                  {post?.team  && <span className='text-redorange'>{post?.user.displayName} .</span>} 
                  {moment(new Date(post?.createdAt), "YYYYMMDD").fromNow()} - 
                  <span className="">
                     {Math.ceil(post?.content?.length / 2044) >= 18 ? Math.ceil(post?.content?.length / 2044) - 5 : Math.ceil(post?.content?.length / 2044)} دقيقه
                  </span>
                  </p>
               </div>
                </div>






             <div className="flex gap-2 sm:gap-3   my-auto">
        
        {/* <div>
           <LikeButton
            isBlocked={{
              isBlockedByUser: post.user?.blockers?.some(
                (blocker) => blocker.blockerId === session?.user?.id,
             ),
             }}
              api={`/api/posts/${post.id}/likes`}
              query={["like-info", post.id]}
              initialState={{
                likes: post?._count?.likes,
                isLikedByUser: post?.likes?.some((like) => like.userId === session?.user?.id),
              }}
              className={'  bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
              count={false}
            />
        </div> */}

            <button className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg">
              <a href="tel:02155589837" onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('02155589837')}} >
                <FaPhone/>
              </a>
                </button>
         <div>
            <button className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg" onClick={copyToClipboard}><IoShareOutline/></button>
         </div>
          {session?.user.id === post?.userId &&
           <Link className={"bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"} href={`/admin/edit-post/${post?.link}`}>
             <FaEraser/>
           </Link>
           }

          {/* <div>
            <BookmarkButton
                       postId={post.id}
                       initialState={{
                         isBookmarkedByUser: post?.bookmarks?.some(
                           (bookmark) => bookmark.userId === session?.user?.id,
                        ),
                     }}
                     className={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
                   /> 
          </div> */}

            <div>
                <Comments post={post}  />
            </div>

               <div>
                  <TableOfContents content={contentRef?.current}
                   //  items={post?.tocs}
                  />
               </div>
            

             </div>
               </div>
       
            <div
            id="post-content" ref={contentRef}
              className="content break-words w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  "
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />


{post?.faqs?.length >= 1 && 
                       <div className="space-y-5"> 
                       <div>
                        <h1 className="text-lg sm:text-xl text-lfont"><span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">سوالات</span> متداول</h1>
                         <p className="text-sm md:text-md  text-lfont">از سوالات شما همیشه استقبال میشود;سوالات شما جرقه گفتگوهایی را میدهند که منجر به نوآوری میشود</p>
                       </div>
             {post?.faqs?.map((faq,index)=>(
                     <Accordion menuStyle={"p-4 text-lfont text-sm bg-lcard dark:bg-dcard rounded-xl"} btnStyle={"text-lg sm:text-xl lg:text-2xl "} title={faq.question} key={index}> <p>{faq.answer}</p> </Accordion>
                 ))}
             </div>  
       

        }

          {/* <div className="px-5 sm:px-10 mx-auto  space-y-10 ">
            <h1 className="text-lg sm:text-xl text-lfont"><span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">{post?.user.displayName}</span> More And Top Posts</h1>
           <MoreByUser postTitle={title} writerId={post?.userId}/> 
          </div>*/}

<div className="   space-y-10 ">
            <div>
          <h1 className="text-lg sm:text-xl text-lfont"><span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">مقاله های</span>    محبوب و مرتبط</h1>
          <p className=" text-md text-lfont">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p>
            </div>

            <Conneccted postTitle={post?.title} postId={post?.id}/>
          </div>

          </div>
            )}
        </div>
        </>
  );
};

export default PostPage;
