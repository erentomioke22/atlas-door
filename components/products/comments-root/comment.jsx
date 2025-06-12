"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import moment from "moment";
import Dropdown from "@components/ui/dropdown";
import { BsThreeDots } from "react-icons/bs";
import CommentInput from "./commentInput";
import { useDeleteCommentMutation } from "./mutations";
import Report from "@components/report";
// import LikeButton from "@components/posts/likeButton";
import { LuReply } from "react-icons/lu";
import ImageCom from "@components/ui/Image";
import { FaArrowLeftLong } from "react-icons/fa6";


const Comment = ({content,user,createdAt,userId,id,replies,likes,_count,parent,product,margin,category,scrollToComment,setCurrentCommentId,setMessage,setReplyInfo,name,email}) => {
 
  const [ShowAll,setShowAll]=useState(false)
  const { data: session } = useSession();
  const mutation = useDeleteCommentMutation(id,category)
  const [showAllReply,setShowAllReply]=useState(false)
  const [showReport,setShowReport] = useState(false)



  return (
    <div className="comment w-full  space-y-3 py-5" id={id}>
         
         {parent && 
  <button className="cursor-pointer py-1 px-2 bg-lcard dark:bg-dcard rounded-xl w-full flex items-start space-x-1 text-start border border-lbtn" onClick={()=>scrollToComment(id)}>
    <div className="relative w-9 h-9 overflow-hidden flex-shrink-0 my-auto">
    {parent?.user?.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
      <ImageCom
        className="rounded-lg object-cover absolute inset-0"
        src={
          parent?.user?.image
          ? parent?.user?.image
          : "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
        }
        alt={parent?.user?.displayName}
      />
                  }
    </div>
    <div className="min-w-0">
      <p className="text-sm">{parent.user.displayName}</p>
      <div
        className="break-words normal-case leading-loose text-[12px] text-lfont line-clamp-1"
        dangerouslySetInnerHTML={{ __html:parent.content }}
      />
    </div>
  </button>
}

      <div className="flex justify-between space-x-1">
      <div className="flex capitalize gap-2 ">
                          <div className="relative w-9 h-9">
                          {user?.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                            <ImageCom
                              className="rounded-lg "
                              src={
                                user?.image
                                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${user?.image}`
                                  : `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                              }
                              alt={'avatar'}
                            />
                  }
                            </div>
                          <div>
                            <p className="text-[10px] md:text-sm truncate ">
                              {user?.displayName || name}
                            </p>
                            <p className="text-[8px] md:text-[10px] text-lfont ">
                              <span>
                               {moment(new Date(createdAt), "YYYYMMDD").fromNow()}
                              </span> . {"  "}
                              <span className=" text-purple  truncate uperrcase">
                              {(userId === product?.sellerId && "ادمین")}
                              </span>
                            </p>
                            </div>

                        </div>

        <div className="flex space-x-2  text-[13px] md:text-[15px] ">

         <Dropdown
            title={<BsThreeDots />}
            // className={`space-y-1 px-2 z-[99999] right-0 mb-1 ${showReport ? 'w-72': 'w-44'} bg-white dark:bg-black border border-lbtn dark:border-dbtn text-[10px]`}
            className={`px-2 z-[99999] left-0 mb-1 ${showReport ? 'w-72': 'w-44'} bg-white dark:bg-black shadow-sm border border-lbtn dark:border-dbtn`}

          >
            <div className="text-[10px]">
                          {!showReport ? 
                                <>
                                {session && session.user.id === userId && (
                                  <div>
                                      {/* <CommentInput post={post} header={"edit reply"} btnStyle={"hover:bg-lcard  duration-300 dark:hover:bg-dcard p-2 rounded-lg w-full text-start"} title={'Edit your Comment'} content={content} replyId={id}  reply={true} edit={true} placeHolder={"EDIT REPLY"} category={category}/> */}
                                      <button onClick={()=>{setMessage(content) ; setCurrentCommentId(id)}}>edit Comment</button>
                                  </div>
                                )}
                    
                    
                                                  {session && session.user.id === userId && (
                                                      <button
                                                        onClick={() => mutation.mutate(id)}
                                                        className="hover:bg-lcard duration-300 dark:hover:bg-dcard p-2 text-start w-full rounded-lg"
                                                      >
                                                        Delete your Comment
                                                      </button>
                                                  )}
                                  <button onClick={()=>{setShowReport(true)}} className="hover:bg-lcard dark:bg-dcard p-2 rounded-lg  duration-200 mb-2 w-full text-start">
                                    Report
                                  </button>
</>
                                :
                                <div className="space-y-3">
                                   <button onClick={()=>{setShowReport(false)}} 
                                   className="flex"                       
                                    type="button"
                                   >
                                <FaArrowLeftLong className="my-auto text-sm"/>
                                BACK
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
                    show less
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
                    show more...
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
           
        <div className=" flex justify-between">
        {/* <div className="flex space-x-3">
            <LikeButton
              isBlocked={{
                isBlockedByUser: post.user?.blockers?.some(
                  (blocker) => blocker.blockerId === session?.user?.id,
               ),
               }}
              api={`/api/posts/${post?.id}/comments/${id}/likes`}
              query={["comment-like-info",id]}
              initialState={{
                likes: _count?.likes,
                isLikedByUser: likes?.some((likes) => likes.userId === session?.user?.id),
                }}
                count={true}
            /> 

                         {showAllReply !== id && replies?.length >=1 &&
                            <button
                              className="text-lfont text-[10px]"
                              onClick={() => setShowAllReply(id)}
                            >
                              SHOW ALL {replies?.length} REPLY
                            </button>
                         }
                          {showAllReply === id && replies?.length >=1 && 
                               <button
                                 className="text-red text-[10px]"
                                 onClick={() => setShowAllReply(null)}
                               >
                                 SHOW LESS
                               </button>         
                          } 
         </div> */}
                         {/* <div className="flex space-x-2">
                           <CommentInput post={post} header={"WRITE REPLY"} btnStyle={"text-sm text-lfont"} title={<LuReply/>}  commentId={id} reply={true} placeHolder={"REPLY"} category={category}/>
                         </div> */}
                                      <button onClick={()=>{setCurrentCommentId(id); setMessage(null); setReplyInfo({user,content})}}><LuReply/></button>


        </div>
                         {/* <div className={`my-7 ${margin && 'ml-5'} space-y-5`}>
                         {showAllReply === id && 
                         <>
                           {replies?.map(({content,user,createdAt,userId,id,_count,likes,replies,parent}) => {
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
                                margin={false}
                                // params={params}
                              />
                            );
                          })}
                         
                         </>          
                          }
                        </div> */}


    </div>
  );
};

export default Comment;
