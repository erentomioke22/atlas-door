import { useSession } from "next-auth/react";
import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { submitProduct } from "./action";
import { editProduct } from "./action";
import { deleteProduct } from "./action";
import { toast } from 'sonner'
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";




export function useSubmitProductMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: submitProduct,
    onSuccess: async (newProduct) => {
      // const postFeedQueryKey = ["post-feed"];
      // const userPostsQueryKey = ["user-posts", session?.user.id];
      // Cancel relevant queries
      // await queryClient.cancelQueries(postFeedQueryKey);
      // await queryClient.cancelQueries(userPostsQueryKey);
      const newProductQueryKey = ["new-product"];

      await queryClient.cancelQueries(newProductQueryKey);


      queryClient.setQueryData(newProductQueryKey, (oldData) => {
        return oldData ? [newProduct, ...oldData] : [newProduct];
      });

      queryClient.invalidateQueries(newProductQueryKey);
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

      toast.success("Product created");
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to product. Please try again.");
    },
  });

  return mutation;
}



export function useEditProductMutation() {

  const queryClient = useQueryClient();

  const { session } = useSession();

  const mutation = useMutation({
    mutationFn: editProduct,
   
    onSuccess: async (newProduct) => {
      const newProductQueryKey = ["new-product"];

      await queryClient.cancelQueries(newProductQueryKey);


      queryClient.setQueryData(newProductQueryKey, (oldData) => {
        return oldData ? [newProduct, ...oldData] : [newProduct];
      });

      queryClient.invalidateQueries(newProductQueryKey);

      toast.success("Product edited");
    },

    onError(error) {
      // console.error(error);
      toast.error("Failed to edit product. Please try again.");
    },
  });

  return mutation;
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async (deletedProduct) => {
      const newProductQueryKey = ["new-product"];

      await queryClient.cancelQueries(newProductQueryKey);



      queryClient.invalidateQueries(newProductQueryKey);

      toast.success("Product deleted");

      if (pathname === `/products/${deletedProduct.id}`) {
        router.push(`/users/${deletedProduct.user.username}`);
      }
    },
    onError(error) {
      // console.error(error);
      toast.error("Failed to delete product. Please try again.");
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

