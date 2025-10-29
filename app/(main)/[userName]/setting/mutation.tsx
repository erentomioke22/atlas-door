import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteUserAction} from "./action";
import { toast } from "sonner";



export function useDeleteUserMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn:(userId : string)=> deleteUserAction({userId}),
    onSuccess: async () => {
      const queryFilter = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      router.refresh();
      toast.success("کاربر با موفقیت حذف شد");
    },
    onError(error: Error) {
      if (error.message && typeof error.message === "string") {
        toast.error(error.message);
      } else {
        toast.error("مشکلی در برقراری ارتباط وجود دارد");
      }
    },
  });

  return mutation;
}

