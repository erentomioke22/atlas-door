import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { toast } from 'sonner'
import { deleteComment,submitComment ,editComment,submitReply,editReply,deleteReply} from './action'

export function useSubmitCommentMutation(postId) {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const commentsQueryKey = ["comments", postId];
      const notificationsQueryKey = ["notifications"];
      
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      

      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      
      
      toast.success("بازخورد شما ثبت شد",);
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to submit comment. Please try again.");
    },
  });

  return mutation;
}

export function useEditCommentMutation(postId) {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editComment,
    onSuccess: async (newComment) => {
      const commentsQueryKey = ["comments", postId];
      const notificationsQueryKey = ["notifications"];
      
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      

      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });

      toast.success("Comment edited",);
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to edit comment. Please try again.");
    },
  });

  return mutation;
}

export function useDeleteCommentMutation(){

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {

      const commentsQueryKey = ["comments", deletedComment.postId];
      const notificationsQueryKey = ["notifications"];
      
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      

      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });

      toast.success("Comment deleted");
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to delete comment. Please try again.");
    },
  });

  return mutation;
}

