"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import moment from "moment";
import Dropdown from "@components/ui/dropdown";
import { BsThreeDots } from "react-icons/bs";
import CommentInput from "../commentInput";
import { useDeleteReplyMutation } from "../mutations";
import Report from "@components/report";
import ImageCom from "@components/ui/Image";


const Reply = ({content,user,createdAt,userId,id,writerId,post,likes,_count,name,email,image}) => {
 
  const [ShowAll,setShowAll]=useState(false)
  const { data: session } = useSession();
  const mutation = useDeleteReplyMutation(post?.id)



  return (
    <div className=" w-full pr-6 mt-2">
      <div className="flex justify-between space-x-1">
        
      <div className="flex capitalize gap-2  ">
        <div className="relative w-[35px] h-[35px]">
            <ImageCom
              className="rounded-lg "
              src={
                image
                  ? image
                  : "/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
              }
              alt="avatar"
            />
          </div>
          
          <div>
           <p className="text-[10px] md:text-sm truncate ">
           {user?.displayName || name}
           </p>
           <p className="text-[8px] md:text-[10px] text-lfont ">
            <span>
             {moment(new Date(createdAt), "YYYYMMDD").fromNow()} 
            </span>.
             {"   "}<span className=" text-purple  truncate uperrcase">
             {(userId === post?.userId && "ادمین") }
             </span>
           </p>
           </div>

        </div>

      <Dropdown
            title={<BsThreeDots className="text-sm"/>}
            className={"space-y-1 px-2 z-[99999] left-0 mb-1 w-44 bg-white dark:bg-black border border-lbtn dark:border-dbtn text-[10px]"}
          >
            <div className="text-[10px]">
            <Report type={"REPLY"}/>
            {session?.user.role === 'admin' && 
            <>
                  <button className="w-full py-1 px-3  rounded-lg hover:bg-lcard dark:hover:bg-dcard text-start text-[10px]" type="button" onClick={()=>{mutation.mutate(id)}}>Delete</button>
             {session && session.user.id === userId && (
              <div>
                  <CommentInput post={post} header={"edit reply"} btnStyle={"hover:bg-lcard  duration-300 dark:hover:bg-dcard px-2 py-1 rounded-lg w-full text-start"} title={'Edit your Reply'} content={content} replyId={id}  reply={true} edit={true} placeHolder={"EDIT REPLY"}/>
              </div>
            )}
            </>
             }
            </div>
      </Dropdown>
        





      </div>


        <div className="text-[10px] md:text-[12px]  my-1">
        {content.length >= 251 ? (
            <>
              {ShowAll === id ? (
                <>
                             <div
                                       className=" break-words w-full  normal-case leading-loose  text-sm  decoration-purple decoration-2 underline-offset-4"
                                       dangerouslySetInnerHTML={{ __html:content }}
                     /> {" "}
                  <span
                    onClick={() => {
                      setShowAll(null);
                    }}
                    className="text-purple bold cursor-pointer text-[10px] underline"
                  >
                    نمایش کمتر
                  </span>
                </>
              ) : (
                <>
           <div
                                       className=" break-words w-full  normal-case leading-loose  text-sm  decoration-purple decoration-2 underline-offset-4"
                                       dangerouslySetInnerHTML={{ __html:content.slice(0, 250) }}/> 
                  
                  <span
                    onClick={() => {
                      setShowAll(id);
                    }}
                    className="text-purple bold cursor-pointer text-[10px] underline"
                  >
                     ... نمایش بیشتر
                  </span>
                </>
              )}
            </>
          ) : (
            <div
            className=" break-words w-full  normal-case leading-loose  text-sm  decoration-purple decoration-2 underline-offset-4"
            dangerouslySetInnerHTML={{ __html:content }}/>
          )} 
        </div>
           

    </div>
  );
};

export default Reply;
                        {/* <div>
                         {showAllReply === id && 
                         <>
                           {replies?.map(({content,user,createdAt,userId,id,_count,likes}) => {
                            return (
                              <Reply
                                _count={_count}
                                likes={likes}
                                content={content}
                                createdAt={createdAt}
                                userId={userId}
                                user={user}
                                id={id}
                                commentId={id}
                                // params={params}
                                writerId={post?.userId}
                                post={post}
                              />
                            );
                          })}
                         
                         </>          
                          }
                        </div> */}