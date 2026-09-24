// components/comments/comments.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import LoadingComment from '@/components/ui/loading/loadingComment';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { useInfiniteQuery } from '@tanstack/react-query';
import CommentInput from './commentInput';
import Offcanvas from '@/components/ui/offcanvas';
import { IoClose } from 'react-icons/io5';
import { TbMessageCircleFilled } from 'react-icons/tb';
import Comment from './comment';
import ImageCom from '@/components/ui/Image';
import type { Session } from '@/lib/auth';
import type { CommentTarget, SortCategory, CommentUser } from '@/lib/types';

interface CommentsProps {
  target: CommentTarget;
  session: Session | null;
}

const Comments: React.FC<CommentsProps> = ({ target, session }) => {
  const [close, setClose] = useState(false);
  const [item, setItem] = useState<SortCategory>('latest');
  const [commentId, setCommentId] = useState<string | null>(null);
  const [replyInfo, setReplyInfo] = useState<{
    user: CommentUser;
    content: string;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['comments', target.targetType, target.targetId, item],
      queryFn: async ({ pageParam = null }) => {
        const res = await axios.get(
          `/api/comments/${target.targetType}/${target.targetId}?category=${item}`,
          { params: pageParam ? { cursor: pageParam } : {} }
        );
        return res.data;
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage: any) => lastPage.nextCursor ?? null,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    });

  const comments =
    data?.pages.flatMap((page: any) => page.comments) || [];

  const scrollToComment = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const classes = 'bg-lcard dark:bg-dcard px-2 animate-pulse rounded-xl my-2';
      el.classList.add(...classes.split(' '));
      setTimeout(() => el.classList.remove(...classes.split(' ')), 3000);
    }
  };

  // ✅ اگه discussions غیرفعاله، اصلاً نمایش نده
  if (target.discussions === false) {
    return null;
  }

  return (
    <Offcanvas
      title={<TbMessageCircleFilled />}
      btnStyle="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
      position="top-0 right-0"
      size="h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"
      openTransition="translate-x-0"
      closeTransition="translate-x-full"
      onClose={close}
    >
      {/* ====== هدر ====== */}
      <div className="flex justify-between">
        <h1 className="text-xl">بازخوردها</h1>
        <button
          aria-label="close"
          onClick={() => setClose(!close)}
          type="button"
          className="text-lg bg-lcard dark:bg-dcard px-2 py-1 rounded-full border-2 text-neutral-500 dark:text-neutral-300"
        >
          <IoClose />
        </button>
      </div>

      {/* ====== لیست کامنت‌ها ====== */}
      <div className="my-10 space-y-5">
        {status === 'pending' ? (
          Array(8)
            .fill({})
            .map((_, i) => <LoadingComment key={i} />)
        ) : status === 'error' ? (
          <p className="text-center text-sm text-neutral-500">
            مشکلی در برقراری ارتباط وجود دارد
          </p>
        ) : (
          <InfiniteScrollContainer
            onBottomReached={() =>
              hasNextPage && !isFetching && fetchNextPage()
            }
          >
            {comments.length === 0 && !hasNextPage && (
              <p className="text-center text-sm text-neutral-500">
                هنوز بازخوردی اینجا قرار نگرفته
              </p>
            )}

            <div className="divide-y-2 divide-lcard dark:divide-dcard">
              {comments.map((comment: any) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  target={target}
                  category={item}
                  session={session}
                  currentCommentId={commentId}
                  setCurrentCommentId={setCommentId}
                  setMessage={setMessage}
                  setReplyInfo={setReplyInfo}
                  scrollToComment={scrollToComment}
                />
              ))}
            </div>

            {isFetchingNextPage &&
              Array(5)
                .fill({})
                .map((_, i) => <LoadingComment key={i} />)}
          </InfiniteScrollContainer>
        )}
      </div>

      {/* ====== فرم ارسال ====== */}
      {session ? (
        <div className="sticky -bottom-5 left-0 right-0 bg-white dark:bg-black py-5">
          {/* وضعیت ویرایش/پاسخ */}
          {commentId && (
            <div className="flex justify-between gap-3 mb-3">
              {message ? (
                <div className="flex text-[12px] gap-1">
                  <div className="text-redorange my-auto">
                    <p>ویرایش پیام :</p>
                  </div>
                  <div
                    className="line-clamp-1 my-auto text-neutral-500"
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </div>
              ) : (
                <div className="py-1 px-2 w-full flex items-start gap-1 text-start">
                  {replyInfo?.user?.image ? (
                    <ImageCom
                      className="rounded-xl w-9 h-9 my-auto"
                      src={replyInfo.user.image}
                      alt={replyInfo.user.displayName || replyInfo.user.name || ''}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-redorange to-yellow" />
                  )}
                  <div>
                    <p className="text-xs capitalize">
                      {replyInfo?.user?.displayName || replyInfo?.user?.name}
                    </p>
                    <div className="flex gap-1 text-xs">
                      <div className="text-redorange my-auto">
                        <p>پاسخ به پیام :</p>
                      </div>
                      <div
                        className="line-clamp-1 my-auto text-neutral-500"
                        dangerouslySetInnerHTML={{
                          __html: replyInfo?.content ?? '',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <button
                aria-label="close"
                onClick={() => {
                  setCommentId(null);
                  setMessage(null);
                  setReplyInfo(null);
                }}
                className="bg-lcard dark:bg-dcard px-2 py-1 rounded-full border-2"
              >
                <IoClose />
              </button>
            </div>
          )}

          {/* فرم */}
          <div className="flex gap-2">
            {session.user.image ? (
              <ImageCom
                className="rounded-xl w-10 h-10"
                src={session.user.image}
                alt={session.user.displayName || session.user.name || ''}
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-redorange to-yellow" />
            )}

            <CommentInput
              target={target}
              category={item}
              content={message}
              commentId={commentId}
              placeHolder="نظر خود را بنویسید..."
              btnStyle="w-full"
              setCommentId={setCommentId}
              setMessage={setMessage}
              setReplyInfo={setReplyInfo}
              replyInfo={replyInfo}
              session={session}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setClose(!close)}
          className="text-center underline underline-offset-2 decoration-2"
        >
          لطفا برای ارسال بازخورد وارد حساب کاربری خود شوید
        </button>
      )}
    </Offcanvas>
  );
};

export default Comments;
