"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
// import Sign from "@components/authenticate/sign";
import LoadingComment from "@components/ui/loading/loadingComment";
import InfiniteScrollContainer from "@components/InfiniteScrollContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentInput from "./commentInput";
import Offcanvas from "@components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
// import { IoLockClosed} from "react-icons/io5";
// import { MdOutlineBlock } from "react-icons/md";
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





const scrollToComment = (id) => { 
  const commentElement = document.getElementById(id);
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
    const highlightClasses = 'bg-lcard dark:bg-dcard px-2 animate-pulse rounded-xl my-2';
    commentElement.classList.add(...highlightClasses.split(' '));
    setTimeout(() => {
      commentElement.classList.remove(...highlightClasses.split(' '));
    }, 3000);
  }
};



  return (
    <Offcanvas       
    title={<TbMessageCircleFilled/>}
    btnStyle={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
    position={"top-0 right-0"} size={"h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={close}>
    
    <div className=" flex justify-between">
      <h1 className="text-xl">بازخوردها</h1>
      <button
        className={" text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "}
        onClick={() => setClose(!close)}
        type="button"
              >
            <IoClose/>
      </button>
    </div>
    

    {status === "error"  
    // || data?.error 
    ?
    <p className="text-center  text-sm text-lfont">
      مشكلي در برقراري ارتباط وجود دارد
    </p>
    :
 <div>
  {!post.discussions && 
      <div className="my-10 space-y-5 ">
        {status === "pending" ? (
            Array(8)
              .fill({})
              .map((_,index) => {
                return <LoadingComment key={index}/>;
              })
        ) : (
      <InfiniteScrollContainer className={''} onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
    
    {status === "success" && !comments.length  && !hasNextPage &&
      <p className="text-center  text-sm text-lfont">
        هنوز بازخوردي اينجا قرار نگرفته 
      </p>
      }
          <div className=" divide-y-2 divide-lcard dark:divide-dcard">
            {comments.map(({content,user,createdAt,userId,id,replies,likes,_count,parent}) => {
                return (
                  <Comment
                  _count={_count}
                  // likes={likes}
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
            )}
      </div>
  }
  <div className="sticky -bottom-5 left-0 right-0 bg-white dark:bg-black py-5">
    {commentId && 
    <div className="flex justify-between gap-3">
      {message ?
      <div className="flex text-[12px] gap-1 ">
      <div className="text-redorange my-auto text-nowrap">
          <p >  ويرايش  پيام : </p>
      </div>
    <div
          className=" break-words w-full  normal-case leading-loose text-lfont line-clamp-1 my-auto"
          dangerouslySetInnerHTML={{ __html:message }}/>
    </div>
      :
      <div className="py-1 px-2  w-full flex items-start gap-1 text-start  ">
    {replyInfo?.user.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
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
    }
    <div className="min-w-0">
      <p className="text-sm">{replyInfo.user.displayName}</p>
      <div className="flex gap-1 text-[12px] ">
        <div className="text-redorange my-auto">
            <p className=" ">  پاسخ به پيام : </p>
        </div>
      <div
        className="break-words normal-case leading-loose  text-lfont line-clamp-1 my-auto"
        dangerouslySetInnerHTML={{ __html:replyInfo.content }}
      />
      </div>
    </div>
      </div>
}      
   <div className="my-auto">
      <button className="bg-lcard dark:bg-dcard px-2 py-1 rounded-full border-2 text-lfont" onClick={()=>{setCommentId(null) ; setMessage('');setReplyInfo(null)}}><IoClose/></button>
   </div>
    </div>
    }
    <div className="flex gap-2">
    {session?.user?.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
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
        }
  <CommentInput post={post}  header={"write comment"} btnStyle={"w-full"}  category={item} placeHolder={"COMMENT"}  content={message}  commentId={commentId} setCommentId={setCommentId} setMessage={setMessage} setReplyInfo={setReplyInfo} replyInfo={replyInfo}/>
    </div>
  </div>
 </div>
    }
    </Offcanvas>
  );
};

export default Comments;
