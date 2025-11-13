import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitProduct, editProduct, deleteProduct } from "./action";
import { toast } from 'sonner'
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

type NewProduct = any;

export function useSubmitProductMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitProduct,
    onSuccess: async (newProduct: NewProduct) => {
      const newProductQueryKey = ["new-product"];
      await queryClient.cancelQueries({ queryKey: newProductQueryKey as any});
      queryClient.setQueryData<NewProduct[]>(newProductQueryKey, (oldData) => {
        return oldData ? [newProduct, ...oldData] : [newProduct];
      });
      queryClient.invalidateQueries(newProductQueryKey as any);
      toast.success("Product created");
    },
    onError(error: unknown) {
      console.error(error);
      toast.error("Failed to product. Please try again.");
    },
  });

  return mutation;
}

export function useEditProductMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editProduct,
    onSuccess: async (newProduct: NewProduct) => {
      const newProductQueryKey = ["new-product"];
      await queryClient.cancelQueries({ queryKey: newProductQueryKey as any});
      queryClient.setQueryData<NewProduct[]>(newProductQueryKey, (oldData) => {
        return oldData ? [newProduct, ...oldData] : [newProduct];
      });
      queryClient.invalidateQueries({ queryKey: newProductQueryKey as any});
      toast.success("Product edited");
    },
    onError(error: unknown) {
      console.error(error);
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
    onSuccess: async (deletedProduct: any) => {
      const newProductQueryKey = ["new-product"];
      await queryClient.cancelQueries({ queryKey: newProductQueryKey as any});
      queryClient.invalidateQueries({ queryKey: newProductQueryKey as any});
      toast.success("Product deleted");

      // if (pathname === `/products/${deletedProduct.id}`) {
      //   router.push(`/users/${deletedProduct.user.username}`);
      // }
    },
    onError(error: unknown) {
      console.error(error);
      toast.error("Failed to delete product. Please try again.");
    },
  });

  return mutation;
}



