import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment, submitComment, editComment } from "./action";

 

export function useSubmitCommentMutation(productId, category) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (comment) => {
      const queryKey = ["comments", productId, category];
      await queryClient.cancelQueries({ queryKey });

      // If it's a reply (has parentId), update the parent comment's replies array
      // if (comment.parentId) {
      //   queryClient.setQueryData(queryKey, (oldData) => {
      //     if (!oldData?.pages?.length) return oldData;

      //     return {
      //       ...oldData,
      //       pages: oldData.pages.map((page) => ({
      //         ...page,
      //         comments: page.comments.map((c) => {
      //           // If this is the parent comment, add the new reply to its replies array
      //           if (c.id === comment.parentId) {
      //             return {
      //               ...c,
      //               replies: [comment, ...(c.replies || [])],
      //             };
      //           }
      //           return c;
      //         }),
      //       })),
      //     };
      //   });
      // } else {
        // It's a top-level comment, add it to the beginning of the list
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

      toast.success(comment.parentId ? "Reply added" : "Comment created");
    },
    onError(error) {
      console.error(error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    },
  });

  return mutation;
}

export function useEditCommentMutation(productId, category) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editComment,
    onSuccess: async (comment) => {
      const queryKey = ["comments", productId, category];

      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.pages?.length) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) =>
              c.id === comment.id ? comment : c
            ),
          })), 
        };
      });

      // queryClient.invalidateQueries({queryKey,});

      toast.success("Comment edited");
    },
    onError(error) {
      console.error(error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to edit comment. Please try again.");
      }
    },
  });

  return mutation;
}







export function useDeleteCommentMutation(productId, category) {
  const queryClient = useQueryClient();
console.log(productId, category)
  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey = ["comments", productId, category];

      await queryClient.cancelQueries({ queryKey });

      // queryClient.setQueryData(queryKey, (oldData) => {
      //   if (!oldData) return;

      //   return {
      //     pageParams: oldData.pageParams,
      //     pages: oldData.pages.map((page) => ({
      //       previousCursor: page.nextCursor,
      //       comments: page.comments.filter((c) => c.id !== deletedComment.id),
      //     })),
      //   };
      // });
    queryClient.invalidateQueries({queryKey})
      toast.success("Comment deleted");
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to delete comment. Please try again.");
    },
  });

  return mutation;
}
