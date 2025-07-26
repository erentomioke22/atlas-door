import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment, submitComment, editComment } from "./action";

 

export function useSubmitCommentMutation(postId, category) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (comment) => {
      const queryKey = ["comments", postId, category];
      await queryClient.cancelQueries({ queryKey });

        queryClient.setQueryData(queryKey, (oldData) => {
          const firstPage = oldData?.pages[0];
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
      // }

      toast.success(comment.parentId ? "بازخورد شما با موفقيت ثبت شد" : "بازخورد شما با موفقيت ثبت شد");
    },
    onError(error) {
      console.error(error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("مشكلي در برقراري ارتباط وجود دارد");
      }
    },
  });

  return mutation;
}

export function useEditCommentMutation(postId, category) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editComment,
    onSuccess: async (comment) => {
      const queryKey = ["comments", postId, category];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.pages?.length) return oldData;
      
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c.id === comment.id) {
                return comment;
              }
              if (c.parentId === comment.id) {
                return {
                  ...c,
                  parentContent: comment.content, // update this field as needed
                };
              }
              return c;
            }),
          })),
        };
      });
      toast.success("بازخورد شما تغيير پيدا كرد");
    },
    onError(error) {
      console.error(error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("مشكلي در برقراري ارتباط وجود دارد");
      }
    },
  });

  return mutation;
}






export function useDeleteCommentMutation(postId, category) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey = ["comments", postId, category];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: removeCommentAndDescendants(page.comments, deletedComment.id),
          })),
        };
      });


      
      toast.success("بارخورد با موفقيت حذف شد");
    },

    onError(error) {
      console.error(error);
      toast.error("مشكلي در برقراري ارتباط وجود دارد");
    },
  });

  return mutation;
}



function removeCommentAndDescendants(comments, commentId) {
  // Find all direct children
  const directChildren = comments.filter(c => c.parentId === commentId);
  // Recursively remove all descendants
  let idsToRemove = [commentId];
  for (const child of directChildren) {
    idsToRemove = idsToRemove.concat(
      getAllDescendantIds(comments, child.id)
    );
  }
  return comments.filter(c => !idsToRemove.includes(c.id));
}

function getAllDescendantIds(comments, parentId) {
  const children = comments.filter(c => c.parentId === parentId);
  let ids = [parentId];
  for (const child of children) {
    ids = ids.concat(getAllDescendantIds(comments, child.id));
  }
  return ids;
}

