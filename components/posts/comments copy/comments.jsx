"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Sign from "@components/authenticate/sign";
import LoadingComment from "@components/ui/loading/loadingComment";
import InfiniteScrollContainer from "@components/InfiniteScrollContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentInput from "./commentInput";
import Offcanvas from "@components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import { IoLockClosed} from "react-icons/io5";
import { MdOutlineBlock } from "react-icons/md";
import { TbMessageCircleFilled } from "react-icons/tb";
import Comment from "./comment";
import ImageCom from "@components/ui/Image";





const Comments = ({post}) => {
  const [close, setClose] = useState(false);
  const { data: session } = useSession(); 
  const [item,setItem] = useState('latest')
  const [commentId,setCommentId] = useState()
  const [replyInfo,setReplyInfo] = useState()
  const [message,setMessage] = useState('')


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", post?.id,item],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get(`/api/posts/${post?.id}/comments?category=${item}`, {
        params: pageParam ? { cursor: pageParam } : {},
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }


console.log(data)


const scrollToComment = (id) => { 
  const offcanvas = document.querySelector('.offcanvas'); 
  const commentElement = offcanvas.querySelector(`.comment[id='${id}']`);
  
  if (commentElement) { 
     const topPos = commentElement.offsetTop + 1200; 
     offcanvas.scrollTo({ top: topPos, behavior: 'smooth' }); 
  } 
  console.log(`Scrolling to comment with ID: ${id}`);
};

  return (
    <Offcanvas       
    title={<TbMessageCircleFilled/>}
    btnStyle={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
    position={"top-0 right-0"} size={"h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={close}>
    
    <div className=" flex justify-between">
      <h1 className="text-xl">Comment</h1>
      <button
        className={" text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "}
        onClick={() => setClose(!close)}
        type="button"
              >
            <IoClose/>
      </button>
    </div>
    
    {/* {post.discussions ?
    <div className="bg-lcard dark:bg-dcard rounded-2xl p-5 text-sm text-lfont text-center space-y-3">
       <IoLockClosed className="mx-auto text-xl"/>
      <p className=""> Auther close Feedback at this time</p>
    </div>
    :
    session 
    ?
      post.user?.blockers?.some(
        (blocker) => blocker.blockerId === session?.user?.id,
     ) 
     ? 
      <div className="bg-lcard dark:bg-dcard rounded-2xl p-5 text-sm text-lfont text-center space-y-3">
      <MdOutlineBlock className="mx-auto text-xl"/>
      <p className=" text-center">You Blocked from Writer</p>

      </div>
     :
      // <CommentInput post={post}  header={"write comment"} btnStyle={"w-full"}  category={item}
      // title={
      //   <div className="flex space-x-2   ">
      //     <div className="relative h-10 w-10">
      //   <ImageCom
      //     className="rounded-xl h-10 w-10"
      //     src={
      //       session.user?.image === null
      //         ? "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
      //         : session.user.image
      //     }
      //     alt={session.user?.displayName}
      //    />
      //     </div>
      //     <p className="my-auto w-full mx-auto  bg-lcard dark:bg-dcard    rounded-full border border-lbtn dark:border-dbtn text-sm py-2 px-3">
      //       Click Here to Write Comment...
      //     </p>
      //  </div>
      //     } 
      //     placeHolder={"COMMENT"}
      //  />
       <></>
     :
     <div>
      <Sign title={"You Must Login to send Comment"} commentStyle={"w-full mx-auto text-purple underline text-sm "}/>
     </div>
      } */}


  {!post.discussions && 
      <div className="my-10 space-y-5 ">
        {status === "pending" ? (
            Array(8)
              .fill({})
              .map((_,index) => {
                return <LoadingComment key={index}/>;
              })
        ) : (
          <>
          {comments.length >= 1 && 
          <div  className=" px-1 py-2  flex text-nowrap overflow-x-auto space-x-2 md:text-sm text-[10px]">
              
          <button className={`duration-300  ${item === "latest" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setItem("latest")}}>
           Latest
          </button>

          <button className={`duration-300  ${item === "toppest" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  "  : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1"   }`} onClick={()=>{setItem("toppest")}}>
            Popular
          </button>
  
         </div>
           }
      <InfiniteScrollContainer className={''} onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      {status === "success" && (!comments.length || comments.error) && !hasNextPage &&
      <p className="text-center  text-sm text-lfont">
        Not Found Any Comment. Start Writing New Comment .
      </p>
  }
          <div className=" divide-y-2 divide-lcard dark:divide-dcard">
            {comments.map(({content,user,createdAt,userId,id,replies,likes,_count,parent}) => {
                return (
                  <Comment
                  _count={_count}
                  likes={likes}
                  content={content}
                  createdAt={createdAt}
                  userId={userId}
                  user={user}
                  id={id}
                  key={id}
                  commentId={id}
                  writerId={post?.userId}
                  post={post}
                  replies={replies}
                  parent={parent}
                  margin={true}
                  category={item}
                  // params={params}
                  scrollToComment={scrollToComment}
                  currentCommentId={commentId}
                  setCurrentCommentId={setCommentId}
                  message={message}
                  setMessage={setMessage}
                  setReplyInfo={setReplyInfo}
                />
                );
              }
            )}
          </div>
     <div className=" space-y-5 ">
          {isFetchingNextPage &&
            Array(5)
            .fill({})
            .map((_,index) => {
              return <LoadingComment key={index}/>;
            })}
     </div>
      </InfiniteScrollContainer>
          </>
            )}
      </div>
  }
  <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-lcard dark:border-dcard p-3 shadow-md">
    {commentId && 
    <div className="flex justify-between space-x-3">
      {message ?
      <div
            className=" break-words w-full  normal-case leading-loose  text-sm line-clamp-1"
            dangerouslySetInnerHTML={{ __html:message }}/>
      :
      <div className="py-1 px-2  w-full flex items-start space-x-1 text-start  ">
    <div className="relative w-9 h-9 overflow-hidden flex-shrink-0 my-auto">
      <ImageCom
        className="rounded-lg object-cover absolute inset-0"
        src={
          replyInfo?.user?.image
          ? replyInfo?.user?.image
          : "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
        }
        alt={replyInfo?.user?.displayName}
      />
    </div>
    <div className="min-w-0">
      <p className="text-sm">{replyInfo.user.displayName}</p>
      <div
        className="break-words normal-case leading-loose text-[12px] text-lfont line-clamp-1"
        dangerouslySetInnerHTML={{ __html:replyInfo.content }}
      />
    </div>
      </div>
}
      <button onClick={()=>{setCommentId(null) ; setMessage('');setReplyInfo(null)}}><IoClose/></button>
    </div>
    }
    <div className="flex space-x-2">
    <div className="relative h-10 w-10">
       <ImageCom
          className="rounded-xl h-10 w-10"
          src={
            session.user?.image === null
              ? "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
              : session.user.image
          }
          alt={session.user?.displayName}
         />
      </div>
  <CommentInput post={post}  header={"write comment"} btnStyle={"w-full"}  category={item} placeHolder={"COMMENT"}  content={message}  commentId={commentId} setCommentId={setCommentId} setMessage={setMessage} setReplyInfo={setReplyInfo}/>
    </div>
  </div>
    </Offcanvas>
  );
};

export default Comments;
