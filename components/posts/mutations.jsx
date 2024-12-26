import { useSession } from "next-auth/react";
import { PostsPage } from "@/lib/types";
import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { submitPost } from "./action";
import { editPost } from "./action";
import { deletePost } from "./action";
import { toast } from 'sonner'
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

// import { createArchive } from "./action";

// export function useUploadImage() {
//   const { startUpload: startAvatarUpload } = useUploadThing("file");
//   const mutation = useMutation({
//     mutationFn: async (file) => {
//       // const formData = new FormData();
//       // formData.append('file', file);
//       // console.log(formData)
//       try{
//         // const response = await axios.post('/api/uploadthing', formData, {
//         //   headers: {
//         //     'Content-Type': 'multipart/form-data',
//         //   },
//         // });
  
//         // return response.data; // Ensure this matches your response structure
//        const url = file && startAvatarUpload([file])
//        return url
//       }
//       catch(error){
//         console.log("Upload Error:", error.response?.data || error.message)
//       }
//     },
//     onError: (error) => {
//       console.error(error);
//       toast.error("Failed to post. Please try again.");
//       if(error)toast.error(error.message);
//     },
//   });

//   return mutation;
// }


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


// export function useSubmitPostMutation() {

//   const queryClient = useQueryClient();

//   const { session } = useSession();
  
//   const mutation = useMutation({
//     mutationFn: submitPost,
   
//     onSuccess: async (newPost) => {
//       const queryFilter = {
//         queryKey: ["new-post"],
//         predicate(query) {
//           return (
//             query.queryKey.includes("new-post") ||
//             (query.queryKey.includes("user-posts") &&
//               query.queryKey.includes(session?.user.id))
//           );
//         },
//       };

//       await queryClient.cancelQueries(queryFilter);

//       queryClient.setQueriesData(
//         queryFilter,
//         (oldData) => {
//           const firstPage = oldData?.pages[0];

//           if (firstPage) {
//             return {
//               pageParams: oldData.pageParams,
//               pages: [
//                 {
//                   posts: [newPost, ...firstPage.posts],
//                   nextCursor: firstPage.nextCursor,
//                 },
//                 ...oldData.pages.slice(1),
//               ],
//             };
//           }
//         },
//       );

//       queryClient.invalidateQueries({
//         queryKey: queryFilter.queryKey,
//         predicate(query) {
//           return queryFilter.predicate(query) && !query.state.data;
//         },
//       });

//       toast.success("Post created");
//     },

//     onError(error) {
//       console.error(error);
//       toast.error("Failed to post. Please try again.");
//       // toast.error(error);
//     },
//   });

//   return mutation;
// }

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

