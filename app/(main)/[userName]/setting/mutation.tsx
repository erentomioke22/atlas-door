// app/(main)/[userName]/setting/mutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteUserAction } from "./action";
import { toast } from "sonner";

export function useDeleteUserMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => deleteUserAction({ userId }),
    onSuccess: async (data) => {
      if (!data?.success) {
        toast.error(data?.error ?? "حذف کاربر با مشکل مواجه شد");
        return;
      }
      const queryFilter = { queryKey: ["post-feed"] };
      await queryClient.cancelQueries(queryFilter);
      queryClient.invalidateQueries(queryFilter);
      router.refresh();
      toast.success("کاربر با موفقیت حذف شد");
    },
    onError(error: Error) {
      toast.error(
        typeof error?.message === "string" && error.message
          ? error.message
          : "مشکلی در برقراری ارتباط وجود دارد",
      );
    },
  });

  return mutation;
}

