"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import moment from "moment";
import Dropdown from "@components/ui/dropdown";
import { BsThreeDots } from "react-icons/bs";
import CommentInput from "./commentInput";
import { useDeleteCommentMutation } from "./mutations";
import Report from "@components/report";
import { LuReply } from "react-icons/lu";
import ImageCom from "@components/ui/Image";

const Comment = ({content,user,createdAt,userId,id,replies,likes,_count,parent,post,margin,name,email,image}) => {
 
  const [ShowAll,setShowAll]=useState(false)
  const { data: session } = useSession();
  const mutation = useDeleteCommentMutation()
  const [showAllReply,setShowAllReply]=useState(false)



  return (
    <div className=" w-full  space-y-3 py-5">
                      <div className="flex justify-between space-x-1">
                      <div className="flex capitalize gap-2 ">
                          <div className="relative w-[35px] h-[35px]">
                            <ImageCom
                              className="rounded-lg "
                              src={
                                image
                                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${image}`
                                  : `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                              }
                              alt={'avatar'}
                            />
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
                              {(userId === post?.userId && "ادمین")}
                              </span>
                            </p>
                            </div>

                        </div>
                         
                          <Dropdown
                            title={<BsThreeDots className="text-sm"/>}
                            className={" px-2 z-[99999] left-0 mb-1 w-44 bg-white dark:bg-black shadow-sm border border-lbtn dark:border-dbtn"}
                          >
                            <div className="text-[10px] w-full space-y-1">
                                <Report type={"COMMENT"}/>
                                {session?.user.role === 'admin' && 
                                <>
                                 <button disabled={mutation.isPending} className="disabled:cursor-not-allowed w-full py-1 px-3  rounded-lg hover:bg-lcard dark:hover:bg-dcard text-start text-[10px]" type="button" onClick={()=>{mutation.mutate(id)}}>Delete</button>
                                 {/* {session && session.user.id === userId && ( */}
                                  <CommentInput post={post} header={"edit comment"} btnStyle={"hover:bg-lcard  duration-300 dark:hover:bg-dcard px-2 py-1 text-start w-full rounded-lg "} title={ "Edit your Comment"} content={content} commentId={id}  reply={false} placeHolder={"EDIT COMMENT"}/>
                                  {/* // )} */}
                                </>
                                }
                            </div>
                          </Dropdown>


                      </div>

                        <div className="text-[10px] md:text-[12px]  my-1 ">
                          {content.length >= 251 ? (
                            <>
                              {ShowAll === id ? (
                                <>
                                             <div
                                       className=" break-words w-full  normal-case leading-loose text-sm  decoration-purple decoration-2 underline-offset-4"
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
                                       className=" break-words w-full  normal-case leading-loose text-sm  decoration-purple decoration-2 underline-offset-4"
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
                            className=" break-words w-full  normal-case leading-loose text-sm  decoration-purple decoration-2 underline-offset-4"
                            dangerouslySetInnerHTML={{ __html:content }}/>
                          )} 
                        </div>


                        <div className="flex  w-full mt-2  text-sm">
                         <div >
                           <CommentInput post={post} header={"WRITE REPLY"} btnStyle={"text-sm text-lfont"} title={<LuReply/>}  commentId={id} reply={true} placeHolder={"REPLY"}/>
                         </div>

                     </div> 
                         <div className={`my-7 ${margin && 'mr-5'} space-y-3`}>
                           {replies?.map(({content,user,createdAt,userId,id,_count,likes,replies,parent,name,email}) => {
                            return (
                              <Comment
                                _count={_count}
                                likes={likes}
                                content={content}
                                createdAt={createdAt}
                                userId={userId}
                                user={user}
                                id={id}
                                commentId={id}
                                writerId={post?.userId}
                                post={post}
                                replies={replies}
                                parent={parent}
                                margin={false}
                                name={name}
                                email={email}
                                image={image}
                                // params={params}
                              />
                            );
                          })}
                         
                        </div>
        {/* {parent && <button className="text-[10px] cursor-pointer" onClick={()=>scrollToComment(id)}>reply to <span className="text-redorange capitalize">{parent.user.displayName}</span></button>} */}

    </div>
  );
};

export default Comment;
