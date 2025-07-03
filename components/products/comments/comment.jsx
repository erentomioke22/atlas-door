"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import moment from "moment";
import Dropdown from "@components/ui/dropdown";
import { BsThreeDots } from "react-icons/bs";
import { useDeleteCommentMutation } from "./mutations";
import Report from "@components/report";
import { LuReply } from "react-icons/lu";
import ImageCom from "@components/ui/Image";
import { FaArrowLeftLong } from "react-icons/fa6";
// import CommentInput from "./commentInput";
// import LikeButton from "@components/posts/likeButton";


const Comment = ({content,user,createdAt,userId,id,replies,likes,_count,parent,product,margin,category,scrollToComment,setCurrentCommentId,setMessage,setReplyInfo}) => {
 
  const [ShowAll,setShowAll]=useState(false)
  const { data: session } = useSession();
  const deleteMutation = useDeleteCommentMutation(product?.id,category)
  const [showAllReply,setShowAllReply]=useState(false)
  const [showReport,setShowReport] = useState(false)



  return (
    <div className="comment w-full  space-y-3 py-5" id={id}>
         
         {parent && 
  <button className="cursor-pointer py-1 px-2 bg-lcard dark:bg-dcard rounded-xl w-full flex items-start gap-1 text-start border border-lbtn" onClick={()=>scrollToComment(parent?.id)}>
                            {user?.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
    <div className="relative w-9 h-9 overflow-hidden flex-shrink-0 my-auto">
      <ImageCom
        className="rounded-lg object-cover absolute inset-0"
        src={
          parent?.user?.image
          ? parent?.user?.image
          : "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
        }
        alt={parent?.user?.displayName}
        />
    </div>
      }
    <div className="min-w-0">
      <p className="text-sm">{parent.user.displayName}</p>
      <div
        className="break-words normal-case leading-loose text-[12px] text-lfont line-clamp-1"
        dangerouslySetInnerHTML={{ __html:parent.content }}
      />
    </div>
  </button>
}

      <div className="flex justify-between gap-1">
        <div className="flex capitalize gap-2 ">
        {user?.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
          <div className="relative h-9 w-9">
            <ImageCom
              className="rounded-lg w-9 h-9"
              src={
                user?.image
                ? user?.image
                : "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
              }
              alt={user?.displayName}
              />
          </div>
            }
          <div >
           <p className="text-[10px] md:text-sm truncate ">
             {user?.displayName}
           </p>
           <p className="text-[8px] md:text-[10px]  ">
            <span className="text-lfont">{moment(new Date(createdAt), "YYYYMMDD").fromNow()}  .</span>
             {"   "}<span className="truncate uperrcase">
             {(userId === product?.sellerId && "ادمين") ||
               (userId === session?.user?.id &&
                 session?.user?.role === "admin" &&
                 "ادمين")}
             </span>
           </p>
           </div>
        </div>

        <div className="flex gap-2  text-[13px] md:text-[15px] ">

         <Dropdown
            title={<BsThreeDots />}
            className={`space-y-1 px-2 z-[99999] left-0 mb-1 ${showReport ? 'w-72': 'w-44'} bg-white dark:bg-black border border-lbtn dark:border-dbtn text-[10px]`}
          >
            <div className="text-[10px] space-y-2">
                          {!showReport ? 
                                <>
                                {session && session.user.id === userId && (
                                  <div>
                                      {/* <CommentInput post={post} header={"edit reply"} btnStyle={"hover:bg-lcard  duration-300 dark:hover:bg-dcard p-2 rounded-lg w-full text-start"} title={'Edit your Comment'} content={content} replyId={id}  reply={true} edit={true} placeHolder={"EDIT REPLY"} category={category}/> */}
                                      <button className="hover:bg-lcard dark:bg-dcard p-2 rounded-lg  duration-200  w-full text-start" onClick={()=>{setMessage(content) ; setCurrentCommentId(id)}}>ويرايش</button>
                                  </div>
                                )}
                    
                    
                                                  {session && session.user.id === userId && (
                                                      <button
                                                        onClick={() => deleteMutation.mutate(id)}
                                                        className={` p-2 rounded-lg  duration-200  w-full text-start ${deleteMutation.isPending ? "cursor-not-allowed bg-lbtn dark:bg-dbtn" : "hover:bg-lcard dark:bg-dcard"}`}
                                                      >
                                                        حذف
                                                      </button>
                                                  )}
                                  <button onClick={()=>{setShowReport(true)}} className="hover:bg-lcard dark:bg-dcard p-2 rounded-lg  duration-200  w-full text-start">
                                    گزارش
                                  </button>
</>
                                :
                                <div className="space-y-3">
                                   <button onClick={()=>{setShowReport(false)}} 
                                   className="flex"                       
                                    type="button"
                                   >
                                بازگشت
                                <FaArrowLeftLong className="my-auto text-sm"/>
                         </button>
                                  <Report type={"Comment"}/>
                                </div>
                                }

            </div>
          </Dropdown>

        </div>
      </div>


        <div className="text-[10px] md:text-[12px] ">
        {content?.length >= 251 ? (
            <>
              {ShowAll === id ? (
                <>
                             <div
                                       className=" break-words w-full  normal-case leading-loose  text-sm  "
                                       dangerouslySetInnerHTML={{ __html:content }}
                     /> {" "}
                  <span
                    onClick={() => {
                      setShowAll(null);
                    }}
                    className="text-purple bold cursor-pointer text-[10px] underline"
                  >
                    نمايش كمتر
                  </span>
                </>
              ) : (
                <>
           <div
                                       className=" break-words w-full  normal-case leading-loose  text-sm  "
                                       dangerouslySetInnerHTML={{ __html:content.slice(0, 250) }}/> 
                  
                  <span
                    onClick={() => {
                      setShowAll(id);
                    }}
                    className="text-purple bold cursor-pointer text-[10px] underline"
                  >
                    نمايش بيشتر
                  </span>
                </>
              )}
            </>
          ) : (
            <div
            className=" break-words w-full  normal-case leading-loose  text-sm "
            dangerouslySetInnerHTML={{ __html:content }}/>
          )} 
        </div>
           
        <div className="  ">
             <button onClick={()=>{setCurrentCommentId(id); setMessage(null); setReplyInfo({user,content})}}><LuReply/></button>
        </div>


        {/* <div className={`my-7 ${margin && 'mr-5'} space-y-3`}>
                           {replies?.map(({content,user,createdAt,userId,id,_count,likes,replies,parent,name,email}) => {
                            return (
                              <Comment
                                _count={_count}
                                likes={likes}
                                key={id}
                                content={content}
                                createdAt={createdAt}
                                userId={userId}
                                user={user}
                                id={id}
                                commentId={id}
                                writerId={post?.sellerId}
                                product={product}
                                replies={replies}
                                parent={parent}
                                margin={false}
                                name={name}
                                email={email}
                                // params={params}
                              />
                            );
                          })}
                         
                        </div> */}


    </div>
  );
};

export default Comment;
