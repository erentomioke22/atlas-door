import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./action";
import { deleteUser } from "./action";
import { deleteAccount } from "./action";
import { Toaster, toast } from 'sonner'
import { suspendAccount } from "./action";
import { deleteSession } from "./action";


export function useUpdateProfileMutation() {


  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: updateUserProfile,  
    onSuccess: async (updatedUser) => {

      const queryFilter = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      toast.success("Profile updated");
    },
    onError(error) {
      if (error.message) { toast.error(error.message); }
      else{toast.error("Failed to create Team. Please try again.")}
    },
  });

  return mutation;
}

export function useDeleteUserMutation() {

  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,  
    onSuccess: async () => {

      const queryFilter = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      router.refresh();
      toast.success("user deleted successfully");
    },
    onError(error) {
      if (error.message) { toast.error(error.message); }
      else{toast.error("Failed to create Team. Please try again.")}
    },
  });

  return mutation;
}

export function useDeleteAccountMutation() {

  const router = useRouter();

  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: deleteAccount,  
    onSuccess: async () => {


      await queryClient.invalidateQueries(["account-info"]);
      router.refresh();
      toast.success("delete account successfuly");
    },
    onError(error) {
      if (error.message) { toast.error(error.message); }
      else{toast.error("Failed to create Team. Please try again.")}
    },
  });

  return mutation;
}

export function useDeleteSessionMutation() {

  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSession,  
    onSuccess: async () => {
      toast.success("delete session successfully");
    },
    onError(error) {
      if (error.message) { toast.error(error.message); }
      else{toast.error("Failed to create Team. Please try again.")}
    },
  });

  return mutation;
}


