import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment, submitComment, editComment } from "./action";

type SortCategory = "latest" | "oldest" | "top";

type CommentItem = {
  id: string;
  parentId?: string | null;
  content: string;
};

type CommentsPage = {
  comments: CommentItem[];
  nextCursor?: string | null;
};

export function useSubmitCommentMutation(postId: string, category: SortCategory) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment as any,
    onSuccess: async (comment: CommentItem) => {
      const queryKey = ["comments", postId, category];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<CommentsPage | undefined>(queryKey, (oldData: any) => {
        const firstPage = oldData?.pages?.[0];
        if (firstPage) {
          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                comments: [comment, ...firstPage.comments],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
        return oldData;
      });

      toast.success(comment.parentId ? "بازخورد شما با موفقيت ثبت شد" : "بازخورد شما با موفقيت ثبت شد");
    },
    onError(error: any) {
      console.error(error);
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("مشكلي در برقراري ارتباط وجود دارد");
      }
    },
  });

  return mutation;
}

export function useEditCommentMutation(postId: string, category: SortCategory) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editComment as any,
    onSuccess: async (comment: CommentItem) => {
      const queryKey = ["comments", postId, category];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<any>(queryKey, (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            comments: page.comments.map((c: CommentItem) => {
              if (c.id === comment.id) {
                return comment;
              }
              if ((c as any).parentId === comment.id) {
                return {
                  ...c,
                  parentContent: (comment as any).content,
                };
              }
              return c;
            }),
          })),
        };
      });
      toast.success("بازخورد شما تغيير پيدا كرد");
    },
    onError(error: any) {
      console.error(error);
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("مشكلي در برقراري ارتباط وجود دارد");
      }
    },
  });

  return mutation;
}

export function useDeleteCommentMutation(postId: string, category: SortCategory) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id : string)=> deleteComment(id),
    onSuccess: async (deletedComment: { id: string }) => {
      const queryKey = ["comments", postId, category];
      await queryClient.cancelQueries({ queryKey });

      function removeCommentAndDescendants(comments: any[], commentId: string) {
        const directChildren = comments.filter(c => c.parentId === commentId);
        let idsToRemove = [commentId];
        for (const child of directChildren) {
          idsToRemove = idsToRemove.concat(getAllDescendantIds(comments, child.id));
        }
        return comments.filter(c => !idsToRemove.includes(c.id));
      }
      function getAllDescendantIds(comments: any[], parentId: string) {
        const children = comments.filter(c => c.parentId === parentId);
        let ids = [parentId];
        for (const child of children) {
          ids = ids.concat(getAllDescendantIds(comments, child.id));
        }
        return ids;
      }

      queryClient.setQueryData<any>(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            comments: removeCommentAndDescendants(page.comments, deletedComment.id),
          })),
        };
      });

      toast.success("بارخورد با موفقيت حذف شد");
    },

    onError(error: any) {
      console.error(error);
      toast.error("مشكلي در برقراري ارتباط وجود دارد");
    },
  });

  return mutation;
}

