"use client";

import React, { useState } from "react";
import moment from "moment";
import Dropdown from "@/components/ui/Dropdown";
import { BsThreeDots } from "react-icons/bs";
import { useDeleteCommentMutation } from "./mutations";
import Report from "@/components/report";
import { LuReply } from "react-icons/lu";
import ImageCom from "@/components/ui/Image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Session } from "@/lib/auth";

type SortCategory = "latest" | "oldest" | "top";

type CommentUser = {
  id: string;
  name?: string | null;
  displayName?: string | null;
  image?: string | null;
};

type ParentInfo = {
  id: string;
  user?: CommentUser | null;
  content: string;
};

interface CommentProps {
  content: string;
  user?: CommentUser | null;
  createdAt: string | Date;
  userId?: string | null;
  id: string;
  replies?: any[];
  likes?: any[];
  _count?: { replies?: number };
  parent?: ParentInfo | null;
  post: { id: string; userId: string };
  writerId: string;
  margin: boolean;
  category: SortCategory;
  scrollToComment: (id: string) => void;
  currentCommentId: string | null;
  setCurrentCommentId: (id: string | null) => void;
  setMessage: (v: string | null) => void;
  setReplyInfo: (info: { user: CommentUser; content: string } | null) => void;
  session:Session| null
}

const Comment: React.FC<CommentProps> = ({
  content,user,createdAt,userId,id,replies,likes,_count,parent,post,margin,category,scrollToComment,setCurrentCommentId,setMessage,setReplyInfo,session
}) => {
  const [ShowAll,setShowAll]=useState<string | null>(null)
  const deleteMutation = useDeleteCommentMutation(post?.id,category)
  const [showReport,setShowReport] = useState(false)

  return (
    <div className="comment w-full  space-y-3 py-5" id={id}>
      {parent &&
        <button className="py-1 px-2 bg-lcard dark:bg-dcard rounded-xl w-full flex items-start gap-1 text-start border border-lbtn" onClick={()=>scrollToComment(parent?.id)}>
          {user?.image === null
            ? <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
            : <div className="relative w-9 h-9 overflow-hidden shrink-0 my-auto">
                <ImageCom
                  className="rounded-lg object-cover absolute inset-0"
                  src={parent?.user?.image ?? "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"}
                  alt={parent?.user?.displayName || parent?.user?.name || ''}
                />
              </div>
          }
          <div className="min-w-0">
            <p className="text-sm">{parent.user?.displayName || parent.user?.name}</p>
            <div
              className="wrap-break-word normal-case leading-loose text-[12px] text-lfont line-clamp-1"
              dangerouslySetInnerHTML={{ __html:parent.content }}
            />
          </div>
        </button>
      }

      <div className="flex justify-between gap-1">
        <div className="flex capitalize gap-2 ">
          {user?.image === null
            ? <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
            : <div className="relative h-9 w-9">
                <ImageCom
                  className="rounded-lg w-9 h-9"
                  src={user?.image ?? "https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"}
                  alt={user?.displayName || user?.name || ''}
                />
              </div>
          }
          <div >
            <p className="text-[10px] md:text-sm truncate ">{user?.displayName || user?.name}</p>
            <p className="text-[8px] md:text-[10px]  ">
              <span className="text-lfont">{moment(new Date(createdAt), "YYYYMMDD").fromNow()}  .</span>
              {"   "}<span className="truncate uperrcase">
                {(userId === post?.userId && "ادمين") ||
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
            className={`space-y-1 px-2 z-99999 left-0 mb-1 ${showReport ? 'w-72': 'w-44'} bg-white dark:bg-black border border-lbtn dark:border-dbtn text-[10px]`}
          >
            <div className="text-[10px] space-y-2">
              {!showReport
                ? <>
                    {session && session.user.id === userId && (
                      <div>
                        <button className="hover:bg-lcard dark:bg-dcard p-2 rounded-lg  duration-200  w-full text-start" onClick={()=>{setMessage(content) ; setCurrentCommentId(id)}}>ويرايش</button>
                      </div>
                    )}
                    {session && session.user.id === userId && (
                      <button
                        aria-label="delete button"
                        title="delete button"
                        onClick={() => deleteMutation.mutate(id)}
                        className={` p-2 rounded-lg  duration-200  w-full text-start ${deleteMutation.isPending ? "cursor-not-allowed bg-lbtn dark:bg-dbtn" : "hover:bg-lcard dark:bg-dcard"}`}
                      >
                        حذف
                      </button>
                    )}
                    <button onClick={()=>{setShowReport(true)}} className="hover:bg-lcard dark:bg-dcard p-2 rounded-lg  duration-200  w-full text-start"           aria-label="report button"
          title="report button">
                      گزارش
                    </button>
                  </>
                : <div className="space-y-3">
                    <button onClick={()=>{setShowReport(false)}} className="flex" type="button">
                      بازگشت
                      <FaArrowLeftLong className="my-auto text-sm"/>
                    </button>
                    <Report type={"COMMENT"}/>
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
                <div className=" wrap-break-word w-full  normal-case leading-loose  text-sm  " dangerouslySetInnerHTML={{ __html:content }}/> {" "}
                <span onClick={() => { setShowAll(null); }} className="text-purple bold cursor-pointer text-[10px] underline">
                  نمايش كمتر
                </span>
              </>
            ) : (
              <>
                <div className=" wrap-break-word w-full  normal-case leading-loose  text-sm  " dangerouslySetInnerHTML={{ __html:content.slice(0, 250) }}/> 
                <span onClick={() => { setShowAll(id); }} className="text-purple bold cursor-pointer text-[10px] underline">
                  نمايش بيشتر
                </span>
              </>
            )}
          </>
        ) : (
          <div className=" wrap-break-word w-full  normal-case leading-loose  text-sm " dangerouslySetInnerHTML={{ __html:content }}/>
        )}
      </div>

      <div className="  ">
        <button           aria-label="reply button"
          title="reply button" onClick={()=>{setCurrentCommentId(id); setMessage(null); setReplyInfo({user: user as any, content})}}><LuReply/></button>
      </div>
    </div>
  );
};

export default Comment;