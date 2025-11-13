"use client";
import useCartStore from "../store/cartStore";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

type Id = string | number;

type AddVars = { productId: Id; colorId: Id };
type UpdateVars = { productId: Id; colorId: Id; quantity: number };
type RemoveVars = { productId: Id; colorId: Id };

type PendingSyncItem =
  | { type: "add"; data: AddVars; timestamp: number }
  | { type: "update"; data: UpdateVars; timestamp: number }
  | { type: "remove"; data: RemoveVars; timestamp: number };

type QtyChange = (UpdateVars & { t: number }) | null;

type NetworkishError = AxiosError & { code?: string | number };

export const useCart = () => {
  const [pendingSync, setPendingSync] = useState<PendingSyncItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const [lastQtyChange, setLastQtyChange] = useState<QtyChange>(null);
  const debouncedQtyChange = useDebounce(lastQtyChange, 1200);

  const {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    _hasHydrated,
    totalDiscount,
    originalTotalPrice,
    restoreFromServer
  } = useCartStore();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      pendingSync.forEach((sync) => {
        if (sync.type === "add") {
          syncAddToServer(sync.data);
        } else if (sync.type === "update") {
          syncUpdateToServer(sync.data);
        } else if (sync.type === "remove") {
          syncRemoveFromServer(sync.data);
        }
      });
      setPendingSync([]);
    }
  }, [isOnline, pendingSync]);

  useEffect(() => {
    if (!debouncedQtyChange) return;

    const { productId, colorId, quantity } = debouncedQtyChange;

    if (quantity <= 0) {
      syncRemoveFromServer({ productId, colorId });
    } else {
      syncUpdateToServer({ productId, colorId, quantity });
    }
  }, [debouncedQtyChange]);

  const { mutate: syncAddToServer } = useMutation<void, NetworkishError, AddVars>({
    mutationFn: async ({ productId, colorId }) => {
      return axios.post(
        `/api/product/addToBag?productId=${productId}&colorId=${colorId}`
      );
    },
    onSuccess: (_data, variables) => {
      const { productId, colorId } = variables || ({} as AddVars);
      setPendingSync((prev) =>
        prev.filter(
          (sync) =>
            !(
              sync.type === "add" &&
              sync.data.productId === productId &&
              sync.data.colorId === colorId
            )
        )
      );
    },
    onError: (error, { productId, colorId }) => {
      console.error("Sync add error:", error);

      if (!isOnline) {
        setPendingSync((prev) => [
          ...prev,
          {
            type: "add",
            data: { productId, colorId },
            timestamp: Date.now(),
          },
        ]);
        toast.info("آفلاین - تغییرات بعد از اتصال به اینترنت اعمال می‌شود");
      } else {
        if (error.code === "NETWORK_ERROR" || (error.response?.status ?? 0) >= 500) {
          setPendingSync((prev) => [
            ...prev,
            {
              type: "add",
              data: { productId, colorId },
              timestamp: Date.now(),
            },
          ]);
          toast.error("خطا در شبکه - تلاش مجدد...");
        } else {
          toast.error("خطا در اضافه کردن به سبد خرید");
        }
      }
    },
    retry: (failureCount, error) => {
      if (error.code === "NETWORK_ERROR" || (error.response?.status ?? 0) >= 500) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { mutate: syncUpdateToServer } = useMutation<void, NetworkishError, UpdateVars>({
    mutationFn: async ({ productId, colorId, quantity }) => {
      return axios.put(
        `/api/product/addToBag?productId=${productId}&colorId=${colorId}`,
        { quantity }
      );
    },
    onSuccess: (_data, variables) => {
      const { productId, colorId } = variables || ({} as UpdateVars);
      setPendingSync((prev) =>
        prev.filter(
          (sync) =>
            !(
              sync.type === "update" &&
              sync.data.productId === productId &&
              sync.data.colorId === colorId
            )
        )
      );
    },
    onError: (error, { productId, colorId, quantity }) => {
      console.error("Sync update error:", error);

      if (!isOnline) {
        setPendingSync((prev) => [
          ...prev,
          {
            type: "update",
            data: { productId, colorId, quantity },
            timestamp: Date.now(),
          },
        ]);
        toast.info("آفلاین - تغییرات بعد از اتصال به اینترنت اعمال می‌شود");
      } else {
        if (error.code === "NETWORK_ERROR" || (error.response?.status ?? 0) >= 500) {
          setPendingSync((prev) => [
            ...prev,
            {
              type: "update",
              data: { productId, colorId, quantity },
              timestamp: Date.now(),
            },
          ]);
          toast.error("خطا در شبکه - تلاش مجدد...");
        } else {
          toast.error("خطا در به‌روزرسانی تعداد");
        }
      }
    },
    retry: (failureCount, error) => {
      if (error.code === "NETWORK_ERROR" || (error.response?.status ?? 0) >= 500) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { mutate: syncRemoveFromServer } = useMutation<void, NetworkishError, RemoveVars>({
    mutationFn: async ({ productId, colorId }) => {
      return axios.delete(
        `/api/product/addToBag?productId=${productId}&colorId=${colorId}`
      );
    },
    onSuccess: (_data, variables) => {
      const { productId, colorId } = variables || ({} as RemoveVars);
      setPendingSync((prev) =>
        prev.filter(
          (sync) =>
            !(
              sync.type === "remove" &&
              sync.data.productId === productId &&
              sync.data.colorId === colorId
            )
        )
      );
    },
    onError: (error, { productId, colorId }) => {
      console.error("Sync remove error:", error);

      if (!isOnline) {
        setPendingSync((prev) => [
          ...prev,
          {
            type: "remove",
            data: { productId, colorId },
            timestamp: Date.now(),
          },
        ]);
        toast.info("آفلاین - تغییرات بعد از اتصال به اینترنت اعمال می‌شود");
      } else {
        if (error.code === "NETWORK_ERROR" || (error.response?.status ?? 0) >= 500) {
          setPendingSync((prev) => [
            ...prev,
            {
              type: "remove",
              data: { productId, colorId },
              timestamp: Date.now(),
            },
          ]);
          toast.error("خطا در شبکه - تلاش مجدد...");
        } else {
          toast.error("خطا در حذف از سبد خرید");
        }
      }
    },
    retry: (failureCount, error) => {
      if (error.code === "NETWORK_ERROR" || (error.response?.status ?? 0) >= 500) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const addToCart = (
    product: Parameters<typeof addItem>[0],
    colorId: Parameters<typeof addItem>[1],
    quantity: Parameters<typeof addItem>[2] = 1
  ) => {
    addItem(product, colorId, quantity);
    syncAddToServer({ productId: product.id as Id, colorId });
  };

  const removeFromCart = (
    productId: Parameters<typeof removeItem>[0],
    colorId: Parameters<typeof removeItem>[1]
  ) => {
    removeItem(productId, colorId);
    syncRemoveFromServer({ productId, colorId });
  };

  const updateCartQuantity = (
    productId: Parameters<typeof updateQuantity>[0],
    colorId: Parameters<typeof updateQuantity>[1],
    quantity: Parameters<typeof updateQuantity>[2]
  ) => {
    updateQuantity(productId, colorId, quantity);
    setLastQtyChange({ productId: productId as Id, colorId: colorId as Id, quantity, t: Date.now() });
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    isOnline,
    pendingSyncCount: pendingSync.length,
    hasHydrated: _hasHydrated,
    totalDiscount,
    originalTotalPrice,
    restoreFromServer
  };
};