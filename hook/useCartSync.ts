'use client';

import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import useCartStore from '@/store/cartStore';

interface FreshProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  colors: Array<{
    _key: string;
    color: string;
    price: number;
    discount: number;
    stock: number;
  }>;
}

export function useCartSync() {
  const items = useCartStore((s) => s.items);
  const syncWithSanity = useCartStore((s) => s.syncWithSanity);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const isSyncing = useRef(false);
  const hasSyncedRef = useRef(false);

  const sync = useCallback(async () => {
    if (isSyncing.current) return;
    if (items.length === 0) return;

    isSyncing.current = true;

    try {
      const productIds = Array.from(
        new Set(items.map((item) => item.productId))
      );

      const res = await fetch('/api/product/sync-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });

      if (!res.ok) throw new Error('Failed to sync');

      const { products } = (await res.json()) as {
        products: FreshProduct[];
      };

      // ✅ snapshot از items قبل از sync
      const beforeSync = items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
        discount: i.discount,
        name: i.product.name,
      }));

      const result = syncWithSanity(products);

      // ====== نوتیفیکیشن‌ها ======
      if (result.removed.length > 0) {
        toast.warning(
          `${result.removed.length} محصول از سبد خرید حذف شد (محصول یا رنگ حذف شده)`,
          { duration: 5000 }
        );
      }

      if (result.outOfStock.length > 0) {
        toast.warning(
          `${result.outOfStock.length} محصول ناموجود شد و از سبد حذف شد`,
          { duration: 5000 }
        );
      }

      if (result.updated.length > 0) {
        const priceChanges = result.updated.filter((u) => {
          const before = beforeSync.find((b) => b.id === u.id);
          return before && before.price !== u.price;
        });

        const discountChanges = result.updated.filter((u) => {
          const before = beforeSync.find((b) => b.id === u.id);
          return before && before.discount !== u.discount;
        });

        const qtyChanges = result.updated.filter((u) => {
          const before = beforeSync.find((b) => b.id === u.id);
          return before && before.quantity !== u.quantity;
        });

        if (priceChanges.length > 0) {
          toast.info(`قیمت ${priceChanges.length} محصول به‌روز شد`);
        }

        if (discountChanges.length > 0) {
          toast.info(
            `تخفیف ${discountChanges.length} محصول تغییر کرد و اعمال شد`
          );
        }

        if (qtyChanges.length > 0) {
          toast.warning(
            `تعداد ${qtyChanges.length} محصول به دلیل کمبود موجودی کاهش یافت`
          );
        }
      }
    } catch (error) {
      console.error('Cart sync error:', error);
    } finally {
      isSyncing.current = false;
    }
  }, [items, syncWithSanity]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (hasSyncedRef.current) return;
    if (items.length === 0) return;

    hasSyncedRef.current = true;
    sync();
  }, [hasHydrated, items.length, sync]);

  return { sync };
}