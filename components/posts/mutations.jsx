import { useSession } from "next-auth/react";
import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { submitPost } from "./action";
import { editPost } from "./action";
import { deletePost } from "./action";
import { toast } from 'sonner'
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";




export function useSubmitPostMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      // const postFeedQueryKey = ["post-feed"];
      // const userPostsQueryKey = ["user-posts", session?.user.id];
      // Cancel relevant queries
      // await queryClient.cancelQueries(postFeedQueryKey);
      // await queryClient.cancelQueries(userPostsQueryKey);
      const newPostQueryKey = ["new-post"];

      await queryClient.cancelQueries(newPostQueryKey);


      queryClient.setQueryData(newPostQueryKey, (oldData) => {
        return oldData ? [newPost, ...oldData] : [newPost];
      });

      queryClient.invalidateQueries(newPostQueryKey);
      // Optionally update "post-feed" and "user-posts" data if necessary
      // queryClient.setQueriesData(postFeedQueryKey, (oldData) => {
      //   const firstPage = oldData?.pages[0];
      //   if (firstPage) {
      //     return {
      //       pageParams: oldData.pageParams,
      //       pages: [
      //         {
      //           posts: [newPost, ...firstPage.posts],
      //           nextCursor: firstPage.nextCursor,
      //         },
      //         ...oldData.pages.slice(1),
      //       ],
      //     };
      //   }
      // });
      
      // queryClient.setQueriesData(userPostsQueryKey, (oldData) => {
      //   return oldData ? [newPost, ...oldData] : [newPost];
      // });

      // Invalidate relevant queries
      // queryClient.invalidateQueries(postFeedQueryKey);
      // queryClient.invalidateQueries(userPostsQueryKey);

      toast.success("Post created");
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to post. Please try again.");
    },
  });

  return mutation;
}



export function useEditPostMutation() {

  const queryClient = useQueryClient();

  const { session } = useSession();

  const mutation = useMutation({
    mutationFn: editPost,
   
    onSuccess: async (newPost) => {
      const newPostQueryKey = ["new-post"];

      await queryClient.cancelQueries(newPostQueryKey);


      queryClient.setQueryData(newPostQueryKey, (oldData) => {
        return oldData ? [newPost, ...oldData] : [newPost];
      });

      queryClient.invalidateQueries(newPostQueryKey);

      toast.success("Post edited");
    },

    onError(error) {
      // console.error(error);
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
    onSuccess: async (deletedPost) => {
      const newPostQueryKey = ["new-post"];

      await queryClient.cancelQueries(newPostQueryKey);



      queryClient.invalidateQueries(newPostQueryKey);

      toast.success("Post deleted");

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to delete post. Please try again.");
    },
  });

  return mutation;
}

export function useUploadMutation() {

  const uploadFile = async (file) => {

    const response = await axios.post('/api/upload', file, 
    //   {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // }
  );
  
    // console.log(response)
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: uploadFile,
  });

  return mutation;
}

