// components/comments/comment.tsx
'use client';

import React, { useState } from 'react';
import moment from 'moment';
import Dropdown from '@/components/ui/Dropdown';
import { BsThreeDots } from 'react-icons/bs';
import { useDeleteCommentMutation } from '@/lib/comments/hook/mutations';
import { LuReply } from 'react-icons/lu';
import ImageCom from '@/components/ui/Image';
import { FaArrowLeftLong } from 'react-icons/fa6';
import type { Session } from '@/lib/auth';
import type {
  CommentTarget,
  SortCategory,
  CommentUser,
} from '@/lib/types';
// import Report from '@/components/report';

interface CommentProps {
  comment: any;
  target: CommentTarget;
  category: SortCategory;
  session: Session | null;
  currentCommentId: string | null;
  setCurrentCommentId: (id: string | null) => void;
  setMessage: (v: string | null) => void;
  setReplyInfo: (info: { user: CommentUser; content: string } | null) => void;
  scrollToComment: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  target,
  category,
  session,
  setCurrentCommentId,
  setMessage,
  setReplyInfo,
  scrollToComment,
}) => {
  const [showAll, setShowAll] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const deleteMutation = useDeleteCommentMutation(target, category);

  const {
    content,
    user,
    createdAt,
    userId,
    id,
    parent,
  } = comment;

  const DEFAULT_AVATAR =
    'https://static.vecteezy.com/system/resources/previews/006/801/624/non_2x/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg';

  return (
    <div className="comment w-full space-y-3 py-5" id={id}>
      {/* parent preview */}
      {parent && (
        <button
          className="py-1 px-2 bg-lcard dark:bg-dcard rounded-xl w-full flex items-start gap-1 text-start border border-lbtn"
          onClick={() => scrollToComment(parent.id)}
        >
          <ImageCom
            className="rounded-xl w-9 h-9 my-auto"
            src={parent.user?.image || DEFAULT_AVATAR}
            alt={parent.user?.displayName || parent.user?.name || ''}
          />
          <div>
            <p className="text-xs capitalize">
              {parent.user?.displayName || parent.user?.name}
            </p>
            <div
              className="text-xs text-neutral-500 line-clamp-1"
              dangerouslySetInnerHTML={{ __html: parent.content }}
            />
          </div>
        </button>
      )}

      {/* هدر */}
      <div className="flex justify-between gap-1">
        <div className="flex capitalize gap-2">
          <ImageCom
            className="rounded-xl w-9 h-9 my-auto"
            src={user?.image || DEFAULT_AVATAR}
            alt={user?.displayName || user?.name || ''}
          />
          <div>
            <p className="text-[10px] md:text-sm truncate capitalize">
              {user?.displayName || user?.name}
            </p>
            <p className="text-[8px] md:text-[10px]">
              <span className="text-neutral-500">
                {moment(new Date(createdAt)).fromNow()}
              </span>
              {(userId === target.targetOwnerId ||
                (userId === session?.user?.id &&
                  session?.user?.role === 'admin')) && (
                <span className="text-purple mx-1">ادمین</span>
              )}
            </p>
          </div>
        </div>

        <Dropdown
          title={<BsThreeDots />}
          className={`space-y-1 px-2 z-99999 left-0 mb-1 ${
            showReport ? 'w-72' : 'w-44'
          } bg-white dark:bg-black border text-[10px]`}
        >
          <div className="text-[10px] space-y-2">
            {!showReport ? (
              <>
                {session?.user?.id === userId && (
                  <button
                    className="hover:bg-lcard p-2 rounded-lg w-full text-start"
                    onClick={() => {
                      setMessage(content);
                      setCurrentCommentId(id);
                    }}
                  >
                    ویرایش
                  </button>
                )}
                {(session?.user?.id === userId ||
                  session?.user?.role === 'admin') && (
                  <button
                    onClick={() => deleteMutation.mutate(id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg w-full text-start disabled:opacity-50"
                  >
                    حذف
                  </button>
                )}
                <button
                  onClick={() => setShowReport(true)}
                  className="p-2 rounded-lg w-full text-start"
                >
                  گزارش
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowReport(false)}
                  className="flex"
                  type="button"
                >
                  بازگشت
                  <FaArrowLeftLong className="my-auto text-sm" />
                </button>
                {/* <Report type="COMMENT" /> */}
              </div>
            )}
          </div>
        </Dropdown>
      </div>

      {/* محتوا */}
      <div className="text-[10px] md:text-[12px]">
        {content?.length >= 251 ? (
          showAll === id ? (
            <>
              <div
                className="text-sm leading-loose"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <span
                onClick={() => setShowAll(null)}
                className="text-purple text-[10px] underline cursor-pointer"
              >
                نمایش کمتر
              </span>
            </>
          ) : (
            <>
              <div
                className="text-sm leading-loose"
                dangerouslySetInnerHTML={{ __html: content.slice(0, 250) }}
              />
              <span
                onClick={() => setShowAll(id)}
                className="text-purple text-[10px] underline cursor-pointer"
              >
                نمایش بیشتر
              </span>
            </>
          )
        ) : (
          <p
            className="text-sm leading-loose"
          >
            {content}
          </p>
        )}
      </div>

      {/* دکمه پاسخ */}
      <button
        aria-label="reply"
        onClick={() => {
          setCurrentCommentId(id);
          setMessage(null);
          setReplyInfo({ user: user as any, content });
        }}
      >
        <LuReply />
      </button>
    </div>
  );
};

export default Comment;