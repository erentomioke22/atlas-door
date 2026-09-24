// lib/comments/hook/mutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  deleteComment,
  submitComment,
  editComment,
} from '@/lib/comments/action';
import type {
  CommentTarget,
  SortCategory,
} from '@/lib/types';

// ✅ Type برای Argumentها
type SubmitCommentArgs = {
  targetType: 'post' | 'product';
  targetId: string;
  content: string;
  userId: string;
  parentId?: string | null;
  userReplyId?: string | null;
  targetOwnerId?: string | null;
};

type EditCommentArgs = {
  commentId: string;
  content: string;
  userId: string;
};

// ====== Query Key ======
function getQueryKey(target: CommentTarget, category: SortCategory) {
  return ['comments', target.targetType, target.targetId, category];
}

// ====== Submit ======
export function useSubmitCommentMutation(
  target: CommentTarget,
  category: SortCategory
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: SubmitCommentArgs) => submitComment(args),
    onSuccess: async (comment: any) => {
      const queryKey = getQueryKey(target, category);
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<any>(queryKey, (oldData: any) => {
        const firstPage = oldData?.pages?.[0];
        if (firstPage) {
          return {
            ...oldData,
            pages: [
              { ...firstPage, comments: [comment, ...firstPage.comments] },
              ...oldData.pages.slice(1),
            ],
          };
        }
        return oldData;
      });

      toast.success('بازخورد شما با موفقیت ثبت شد');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'مشکلی در برقراری ارتباط وجود دارد');
    },
  });
}

// ====== Edit ======
export function useEditCommentMutation(
  target: CommentTarget,
  category: SortCategory
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: EditCommentArgs) => editComment(args),
    onSuccess: async (comment: any) => {
      const queryKey = getQueryKey(target, category);
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<any>(queryKey, (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            comments: page.comments.map((c: any) => {
              if (c.id === comment.id) return comment;
              if (c.parentId === comment.id) {
                return { ...c, parentContent: comment.content };
              }
              return c;
            }),
          })),
        };
      });

      toast.success('بازخورد شما تغییر پیدا کرد');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'مشکلی در برقراری ارتباط وجود دارد');
    },
  });
}

// ====== Delete ======
export function useDeleteCommentMutation(
  target: CommentTarget,
  category: SortCategory
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: async (deletedComment: any) => {
      const queryKey = getQueryKey(target, category);
      await queryClient.cancelQueries({ queryKey });

      function getAllDescendantIds(comments: any[], parentId: string): string[] {
        const children = comments.filter((c) => c.parentId === parentId);
        let ids = [parentId];
        for (const child of children) {
          ids = ids.concat(getAllDescendantIds(comments, child.id));
        }
        return ids;
      }

      function removeCommentAndDescendants(comments: any[], commentId: string) {
        const idsToRemove = getAllDescendantIds(comments, commentId);
        return comments.filter((c) => !idsToRemove.includes(c.id));
      }

      queryClient.setQueryData<any>(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            comments: removeCommentAndDescendants(
              page.comments,
              deletedComment.id
            ),
          })),
        };
      });

      toast.success('بازخورد با موفقیت حذف شد');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'مشکلی در برقراری ارتباط وجود دارد');
    },
  });
}
