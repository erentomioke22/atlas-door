"use client";
import useCartStore from "../store/cartStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

export const useCart = () => {
  const [pendingSync, setPendingSync] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  const [lastQtyChange, setLastQtyChange] = useState(null);
  const debouncedQtyChange = useDebounce(lastQtyChange, 1600);

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

  const { mutate: syncAddToServer } = useMutation({
    mutationFn: async ({ productId, colorId }) => {
      return axios.post(
        `/api/product/addToBag?productId=${productId}&colorId=${colorId}`
      );
    },
    onSuccess: (_data, variables) => {
      const { productId, colorId } = variables || {};
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
        if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
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
      if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { mutate: syncUpdateToServer } = useMutation({
    mutationFn: async ({ productId, colorId, quantity }) => {
      return axios.put(
        `/api/product/addToBag?productId=${productId}&colorId=${colorId}`,
        { quantity }
      );
    },
    onSuccess: (_data, variables) => {
      const { productId, colorId } = variables || {};
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
        if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
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
      if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { mutate: syncRemoveFromServer } = useMutation({
    mutationFn: async ({ productId, colorId }) => {
      return axios.delete(
        `/api/product/addToBag?productId=${productId}&colorId=${colorId}`
      );
    },
    onSuccess: (_data, variables) => {
      const { productId, colorId } = variables || {};
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
        if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
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
      if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const addToCart = (product, colorId, quantity = 1) => {
    addItem(product, colorId, quantity);
    syncAddToServer({ productId: product.id, colorId });
  };

  const removeFromCart = (productId, colorId) => {
    removeItem(productId, colorId);
    syncRemoveFromServer({ productId, colorId });
  };

  const updateCartQuantity = (productId, colorId, quantity) => {
    updateQuantity(productId, colorId, quantity);
    setLastQtyChange({ productId, colorId, quantity, t: Date.now() });
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