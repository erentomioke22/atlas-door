// components/comments/commentInput.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentValidation } from '@/lib/validation';
import {
  useSubmitCommentMutation,
  useEditCommentMutation,
} from '@/lib/comments/hook/mutations';
import LoadingIcon from '@/components/ui/loading/LoadingIcon';
import CommentTextArea from './commentTextArea';
import Button from '@/components/ui/button';
import { FaCaretLeft, FaCheck } from 'react-icons/fa6';
import { toast } from 'sonner';
import type { Session } from '@/lib/auth';
import type {
  CommentTarget,
  SortCategory,
  CommentUser,
} from '@/lib/types';

interface CommentInputProps {
  target: CommentTarget;
  category: SortCategory;
  content: string | null;
  commentId: string | null;
  placeHolder?: string;
  btnStyle?: string;
  setCommentId: (id: string | null) => void;
  setMessage: (v: string | null) => void;
  setReplyInfo: (info: { user: CommentUser; content: string } | null) => void;
  replyInfo?: { user: CommentUser; content: string } | null;
  session: Session | null;
}

type FormValues = {
  content: string;
  userId?: string;
  parentId?: string | null;
};

const CommentInput: React.FC<CommentInputProps> = ({
  target,
  category,
  content,
  commentId,
  placeHolder = 'نظر خود را بنویسید...',
  setCommentId,
  setMessage,
  setReplyInfo,
  replyInfo,
  session,
}) => {
  const addMutation = useSubmitCommentMutation(target, category);
  const editMutation = useEditCommentMutation(target, category);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(commentValidation) as any,
    defaultValues: { content: '', userId: session?.user?.id },
  });

  useEffect(() => {
    if (content !== null) setValue('content', content);
  }, [content, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id) {
      toast.error('لطفا وارد حساب کاربری خود شوید');
      return;
    }

    if (content) {
      editMutation.mutate(
        {
          commentId: commentId!,
          content: values.content,
          userId: session.user.id,
        },
        {
          onSuccess: () => {
            reset();
            setCommentId(null);
            setMessage(null);
            setReplyInfo(null);
          },
        }
      );
    } else {
      addMutation.mutate(
        {
          targetType: target.targetType,
          targetId: target.targetId,
          content: values.content,
          userId: session.user.id,
          parentId: commentId,
          userReplyId: replyInfo?.user.id,
          targetOwnerId: target.targetOwnerId,
        },
        {
          onSuccess: () => {
            reset();
            setCommentId(null);
            setMessage(null);
            setReplyInfo(null);
          },
        }
      );
    }
  };

  const isPending = content ? editMutation.isPending : addMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-5 gap-2 w-full items-end"
    >
      <div className="col-span-4">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <CommentTextArea
              value={field.value}
              onChange={field.onChange}
              ref={field.ref as any}
              placeholder={placeHolder}
              error={errors?.content?.message as string}
              maxLength={500}
            />
          )}
        />
      </div>

      <div className="col-span-1">
        <Button
          variant="menuActive"
          className="rounded-full text-lg py-2 px-3 w-full"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <LoadingIcon color="bg-white dark:bg-black" />
          ) : content ? (
            <FaCheck />
          ) : (
            <FaCaretLeft />
          )}
        </Button>
      </div>
    </form>
  );
};

export default CommentInput;