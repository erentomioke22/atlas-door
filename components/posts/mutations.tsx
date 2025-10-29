import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost, editPost, deletePost } from "./action";
import { toast } from 'sonner'
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

type NewPost = any;

export function useSubmitPostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost: NewPost) => {
      const newPostQueryKey = ["new-post"];
      await queryClient.cancelQueries( newPostQueryKey as any);
      queryClient.setQueryData<NewPost[]>( newPostQueryKey as any, (oldData) => {
        return oldData ? [newPost, ...oldData] : [newPost];
      });
      queryClient.invalidateQueries( newPostQueryKey as any);
      toast.success("Post created");
    },
    onError() {
      toast.error("Failed to post. Please try again.");
    },
  });

  return mutation;
}

export function useEditPostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: async (newPost: NewPost) => {
      const newPostQueryKey = ["new-post"];
      await queryClient.cancelQueries( newPostQueryKey as any);
      queryClient.setQueryData<NewPost[]>( newPostQueryKey as any, (oldData) => {
        return oldData ? [newPost, ...oldData] : [newPost];
      });
      queryClient.invalidateQueries( newPostQueryKey as any);
      toast.success("Post edited");
    },
    onError() {
      toast.error("Failed to edit post. Please try again.");
    },
  });

  return mutation;
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost: any) => {
      const newPostQueryKey = ["new-post"];
      await queryClient.cancelQueries( newPostQueryKey as any);
      queryClient.invalidateQueries( newPostQueryKey as any);
      toast.success("Post deleted");

      // if (pathname === `/posts/${deletedPost.id}`) {
      //   router.push(`/users/${deletedPost.user.username}`);
      // }
    },
    onError() {
      toast.error("Failed to delete post. Please try again.");
    },
  });

  return mutation;
}

export function useUploadMutation() {
  const uploadFile = async (file: FormData | File | Blob | unknown) => {
    const response = await axios.post('/api/upload', file);
    return response.data as { url: string; key?: string };
  };

  const mutation = useMutation({
    mutationFn: uploadFile,
  });

  return mutation;
}
