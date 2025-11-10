"use client";

import React, { useState } from "react";
import axios from "axios";
import LoadingComment from "@/components/ui/loading/loadingComment";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentInput from "./commentInput";
import Offcanvas from "@/components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import { TbMessageCircleFilled } from "react-icons/tb";
import Comment from "./comment";
import ImageCom from "@/components/ui/Image";
import { Session } from "@/lib/auth";

type CommentUser = {
  id: string;
  name?: string | null;
  displayName?: string | null;
  image?: string | null;
};

type CommentItem = {
  id: string;
  content: string;
  createdAt: string | Date;
  userId?: string | null;
  user?: CommentUser | null;
  parent?: { id: string; user?: CommentUser | null; content: string } | null;
  replies?: CommentItem[];
  _count?: { replies?: number };
};

type CommentsPage = {
  comments: CommentItem[];
  nextCursor?: string | null;
  error?: string;
};

type SortCategory = "latest" | "oldest" | "top";

type ProductLite = {
  id: string;
  sellerId: string;
  discussions?: boolean;
  user?: { id: string };
};

interface CommentsProps {
  product: ProductLite;
  session:Session | null
}

const Comments: React.FC<CommentsProps> = ({product,session}) => {
  const [close, setClose] = useState(false);
  const [item,setItem] = useState<SortCategory>('latest')
  const [commentId,setCommentId] = useState<string | null>(null)
  const [replyInfo,setReplyInfo] = useState<{ user: CommentUser; content: string } | null>(null)
  const [message,setMessage] = useState<string | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error
  } = useInfiniteQuery<CommentsPage, unknown>({
    queryKey: ["comments-product", product?.id,item],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get<CommentsPage>(`/api/product/product/${product?.id}/comments?category=${item}`, {
        params: pageParam ? { cursor: pageParam } : {},
      });
      return response.data;
    },
    initialPageParam: null as string | null, 
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
  });

  const comments: CommentItem[] = data?.pages.flatMap((page) => page.comments) || [];

  const scrollToComment = (id: string) => {
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
          aria-label="close button"
          title="close button"
          className={" text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont"}
          onClick={() => setClose(!close)}
          type="button"
        >
          <IoClose/>
        </button>
      </div>

      {status === "error" || (data as any)?.error || error
        ? <p className="text-center  text-sm text-lfont">مشكلي در برقراري ارتباط وجود دارد</p>
        : <div>
            <div className="my-10 space-y-5 ">
              {status === "pending" ? (
                Array(8).fill({}).map((_,index) => <LoadingComment key={index}/>)
              ) : (
                <InfiniteScrollContainer className={''} onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
                  {status === "success" && !comments.length  && !hasNextPage &&
                    <p className="text-center  text-sm text-lfont">هنوز بازخوردي اينجا قرار نگرفته</p>
                  }
                  <div className=" divide-y-2 divide-lcard dark:divide-dcard">
                    {comments.map(({content,user,createdAt,userId,id,replies,_count,parent}) => {
                      return (
                        <Comment
                          _count={_count}
                          content={content}
                          createdAt={createdAt}
                          userId={userId ?? undefined}
                          user={user ?? undefined}
                          id={id}
                          key={id}
                          writerId={product?.sellerId}
                          product={product as any}
                          replies={replies}
                          parent={parent as any}
                          margin={true}
                          category={item}
                          scrollToComment={scrollToComment}
                          currentCommentId={commentId}
                          setCurrentCommentId={setCommentId}
                          setMessage={setMessage}
                          setReplyInfo={setReplyInfo}
                          session={session}
                        />
                      );
                    })}
                  </div>
                  <div className=" space-y-5 ">
                    {isFetchingNextPage && Array(5).fill({}).map((_,index) => <LoadingComment key={index}/>)}
                  </div>
                </InfiniteScrollContainer>
              )}
            </div>

            {session
              ? product?.discussions
                ? <p className="text-center underline underline-offset-2 decoration-2">قسمت بازخورد توسط نویسنده فیر فعال شده است</p>
                : <div className="sticky -bottom-5 left-0 right-0 bg-white dark:bg-black py-5">
                    {commentId &&
                      <div className="flex justify-between gap-3">
                        {message
                          ? <div className="flex text-[12px] gap-1 ">
                              <div className="text-redorange my-auto text-nowrap"><p >  ويرايش  پيام : </p></div>
                              <div className=" wrap-break-word w-full  normal-case leading-loose text-lfont line-clamp-1 my-auto" dangerouslySetInnerHTML={{ __html:message }}/>
                            </div>
                          : <div className="py-1 px-2  w-full flex items-start gap-1 text-start  ">
                              {replyInfo?.user?.image === null
                                ? <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
                                : <div className="relative w-9 h-9 overflow-hidden shrink-0 my-auto">
                                    <ImageCom
                                      className="rounded-lg object-cover absolute inset-0"
                                      src={replyInfo?.user?.image ?? ""}
                                      alt={replyInfo?.user?.displayName || replyInfo?.user?.name || ""}
                                    />
                                  </div>
                              }
                              <div className="min-w-0">
                                <p className="text-sm">{replyInfo?.user?.displayName || replyInfo?.user?.name}</p>
                                <div className="flex gap-1 text-[12px] ">
                                  <div className="text-redorange my-auto"><p className=" ">  پاسخ به پيام : </p></div>
                                  <div
                                    className="wrap-break-word normal-case leading-loose  text-lfont line-clamp-1 my-auto"
                                    dangerouslySetInnerHTML={{ __html:replyInfo?.content ?? "" }}
                                  />
                                </div>
                              </div>
                            </div>
                        }
                        <div className="my-auto">
                          <button aria-label="close button" title="close button" className="bg-lcard dark:bg-dcard px-2 py-1 rounded-full border-2 text-lfont" onClick={()=>{setCommentId(null) ; setMessage(null);setReplyInfo(null)}}><IoClose/></button>
                        </div>
                      </div>
                    }
                    <div className="flex gap-2">
                      {session?.user?.image === null
                        ? <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
                        : <div className="relative h-10 w-10">
                            <ImageCom
                              className="rounded-xl h-10 w-10"
                              src={session?.user?.image ?? ""}
                              alt={session?.user?.displayName|| session?.user?.name  || ""}
                            />
                          </div>
                      }
                      <CommentInput 
                      product={product as any}  
                      header={"write comment"} 
                      btnStyle={"w-full"}  
                      category={item} 
                      placeHolder={"COMMENT"}  
                      content={message}  
                      commentId={commentId} 
                      setCommentId={setCommentId} 
                      setMessage={setMessage} 
                      setReplyInfo={setReplyInfo} 
                      replyInfo={replyInfo}
                      session={session}
                      />
                    </div>
                  </div>
              : 
              <button onClick={()=>setClose(!close)} className="text-center underline underline-offset-2 decoration-2"> لطفا برای ارسال بازخورد وارد حساب کاربری خود شوید</button>
            }
          </div>
      }
    </Offcanvas>
  );
};

export default Comments;
