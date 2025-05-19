"use client";

import React, { useEffect } from "react";
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


const PostPage = ({title}) => {

  const {data:session,update}=useSession()
  const pathName = usePathname();
  const currentUrl = `http://localhost:3000/${pathName}`;
  const router = useRouter()
  const queryClient = useQueryClient();
const {data: post,isFetching,status,}=useQuery({
    queryKey: ["post", title],
    queryFn: async()=>{
     const response = await axios.get(`/api/posts?postTitle=${title}`);
     return response.data
    }
  });

console.log(post)

  if (status === "success" && (post.error || post.length <= 0) ) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }


  useEffect(() => {
    if (status === "success" && post?.id) {
      axios.post(`/api/posts/${post.id}/view`)
        .then(response => console.log(response.data)
        )
        .catch(error => console.error(error)
        );
    }
  }, [status, post]);





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
                   <p className="text-xl md:text-4xl w-full break-words text-black dark:text-white">{post.title}</p>   
                    <div className="flex  space-x-2">
                           <span className="flex space-x-2">
                               {post?.tags?.map((tag) => {
                                 return (
                                   <p key={tag.name} className="text-[10px] md:text-[13px] text-lfont ">
                                     <span className="text-black dark:text-white">#</span> {tag.name}
                                   </p>
                                 );
                               })}
                           </span>


                    </div>  
                </div>

               </div>
               <div className='flex justify-between'>
              
                <Link href={post?.team ? `/teams/${post?.team.name}` :`/${post?.user.name}`}
               className=' flex space-x-1 sm:space-x-2  w-fit p-1 text-[10px] hover:bg-lcard dark:hover:bg-dcard   duration-300 cursor-pointer rounded-lg truncate'>
               <div className='relative w-8 h-8'>
                <ImageCom src={post?.team ? post?.team.image : post?.user.image} className='h-8 w-8  rounded-lg' size={'h-8 w-8 '}/>
               </div>
               <div className='flex-1 truncate'>
                 <p className='truncate text-black dark:text-white'>{post?.team ? post?.team.displayName : post?.user.displayName}</p>
                 <p className=' truncate text-lfont' >
                  {post?.team  && <span className='text-redorange'>{post?.user.displayName} .</span>} 
                  {moment(new Date(post?.createdAt), "YYYYMMDD").fromNow()} - 
                  <span className="">
                     {Math.ceil(post?.content?.length / 2044) >= 18 ? Math.ceil(post?.content?.length / 2044) - 5 : Math.ceil(post?.content?.length / 2044)} min read
                  </span>
                  </p>
               </div>
                </Link>






             <div className="flex space-x-2 sm:space-x-3   my-auto">
        
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

         <div>
            <button className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg" onClick={copyToClipboard}><IoShareOutline/></button>
         </div>
          {session?.user.id === post.userId &&
           <Link className={"bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"} href={`/edit-post/${post?.link}`}>
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

            

             </div>
               </div>
   

       
            <div
              className="content break-words w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  "
              dangerouslySetInnerHTML={{ __html: post.content }}
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
