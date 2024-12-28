"use client";

import React, { useState } from "react";
import { LuReply } from "react-icons/lu";
import Reply from "./reply/reply";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoadingComment from "@components/ui/loading/loadingComment";
import moment from "moment";
import Dropdown from "@components/ui/dropdown";
import { BsThreeDots } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import CommentInput from "./commentInput";
import { useDeleteCommentMutation } from "./mutations";
import Report from "@components/report";
import Offcanvas from "@components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import ImageCom from "@components/ui/Image";








const Comment = ({post}) => {
  const [close, setClose] = useState(false);
  const [ShowAll,setShowAll]=useState(false)
  const { data: session } = useSession(); 


  const mutation = useDeleteCommentMutation()
// console.log(post)

  const {data: comments,isFetching,status,}=useQuery({
    queryKey: ["comments", post?.id],
    queryFn: async()=>{const response = await axios.get(`/api/posts/${post?.id}/comments`);
     return response.data
    }
  });

// console.log(comments)





  return (

    
<>



      <CommentInput post={post}   btnStyle={"w-full"}  
      title={
        <div className="flex gap-2 w-full  ">
          <div className="relative h-[40px] w-[45px]">
           <ImageCom
             className="rounded-xl h-10 w-10"
             src={
               session?.user?.image === null
                 ? `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                 : `${process.env.NEXT_PUBLIC_BASE_URL}${session?.user.image}`
             }
             alt={'avatar'}
            />
          </div>
          <p className="my-auto text-center w-full  bg-black text-white dark:bg-white dark:text-black rounded-full text-sm py-2 px-3">
            برای نوشتن اینجا کلیک کنید
          </p>
       </div>
          } 
          placeHolder={"بازخورد"}
       />
      
   {status === "error" &&
      <p className="text-center text-destructive my-5">
        مشکلی در برقراری ارباط وجود دارد
      </p>
  }
    {status === "success" && !comments.length &&
      <p className="text-center  text-sm text-lfont my-5">
        هنوز بازخوردی اینجا اضافه نشده 
      </p>
  }

      <div className="my-10 space-y-5 ">
        {status === "pending" ? (
            Array(4)
              .fill({})
              .map((_,index) => {
                return <LoadingComment key={index}/>;
              })
        ) : (
          <div className="divide-y divide-lbtn dark:divide-dbtn">
            {comments?.map(({content,user,createdAt,userId,id,replies,likes,_count,email,name,image}) => {
                return (
                    <div className="w-full  py-4 px-4" key={id}>
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
                                 {session && session.user.id === userId && (
                                  <CommentInput post={post} header={"edit comment"} btnStyle={"hover:bg-lcard  duration-300 dark:hover:bg-dcard px-2 py-1 text-start w-full rounded-lg "} title={ "Edit your Comment"} content={content} commentId={id}  reply={false} placeHolder={"EDIT COMMENT"}/>
                                  )}
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


                        <div>
                           {replies?.map(({content,user,createdAt,userId,id,_count,likes,name,image}) => {
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
                                name={name}
                                // params={params}
                                writerId={post?.userId}
                                post={post}
                                image={image}
                                key={id}
                              />
                            );
                          })}
                         
                        </div>




                    </div>
                );
              }
            )}
          </div>
            )}
      </div>
  </>
      
 
  );
};

export default Comment;
    // <Offcanvas       
    // title={'ارسال بازخورد'}
    // btnStyle={"text-sm border-2  bg-transparent text-black rounded-full dark:text-white py-1 px-2 text-nowrap"}
    // position={"top-0 right-0"} size={"h-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={close}>
    
    {/* <div className="flex justify-between">
      <button
        className={"bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-3 py-1 text-sm "}
        onClick={() => setClose(!close)}
        type="button"
              >
            <IoClose/>
      </button>
      <p>بازخورد</p>
    </div> */}
       // </Offcanvas>