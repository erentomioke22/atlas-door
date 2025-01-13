"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoadingComment from "@components/ui/loading/loadingComment";
import { useQuery } from "@tanstack/react-query";
import CommentInput from "./commentInput";
import ImageCom from "@components/ui/Image";
import Comment from "./comment";







const Comments = ({post}) => {
  const [close, setClose] = useState(false);
  const [ShowAll,setShowAll]=useState(false)
  const { data: session } = useSession(); 


// console.log(post)

  const {data: comments,isFetching,status,}=useQuery({
    queryKey: ["comments", post?.id],
    queryFn: async()=>{const response = await axios.get(`/api/posts/${post?.id}/comments`);
     return response.data
    }
  });

console.log(comments)





  return (

    
<div>



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
          <div className=" divide-y-2 divide-lcard dark:divide-dcard">
            {comments?.map(({content,user,createdAt,userId,id,replies,likes,_count,parent,name,email,image}) => {
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
                  name={name}
                  email={email}
                  image={image}
                  // params={params}
                />
                );
              }
            )}
          </div>
            )}
      </div>
  </div>
      
 
  );
};

export default Comments;
