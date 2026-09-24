import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Id = string | number;

export type Color = {
  id: Id;
  name: string;
  hexCode: string;
  price: number;
  discount: number | null;
  stocks: number;
  status: 'EXISTENT' | 'NON-EXISTENT';
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  colors: Color[];
};

export type CartItem = {
  id: string; // `${productId}-${colorId}`
  productId: string;
  colorId: string;
  quantity: number;
  product: Product;
  color: Color;
  price: number;
  discount: number;
  finalPrice: number;
  addedAt?: number;
};

export type SyncResult = {
  removed: CartItem[];
  updated: CartItem[];
  outOfStock: CartItem[];
};

type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  originalTotalPrice: number;
  _hasHydrated: boolean;
  _lastSyncResult: SyncResult | null;

  // Actions
  addItem: (product: Product, colorId: Id, quantity?: number) => void;
  removeItem: (productId: Id, colorId: Id) => void;
  removeItems: (itemsToRemove: Array<{ productId: string; colorId: string }>) => void;
  updateQuantity: (productId: Id, colorId: Id, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  getItemQuantity: (productId: Id, colorId: Id) => number;
  isInCart: (productId: Id, colorId: Id) => boolean;
  setHasHydrated: (state: boolean) => void;
  clearSyncResult: () => void;

  // ✅ Sync از Sanity
  syncWithSanity: (
    freshProducts: Array<{
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
    }>
  ) => SyncResult;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      totalDiscount: 0,
      originalTotalPrice: 0,
      _hasHydrated: false,
      _lastSyncResult: null,

      addItem: (product, colorId, quantity = 1) => {
        const color = product.colors.find((c) => c.id === colorId);
        if (!color) return;

        const existingIndex = get().items.findIndex(
          (item) => item.productId === product._id && item.colorId === String(colorId)
        );

        const discount = color.discount ?? 0;
        const finalPrice = color.price - (color.price * discount) / 100;

        if (existingIndex > -1) {
          set((state) => ({
            items: state.items.map((item, index) =>
              index === existingIndex
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    // ✅ آپدیت قیمت و تخفیف در صورت تغییر
                    price: color.price,
                    discount,
                    finalPrice,
                    color,
                  }
                : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: `${product._id}-${colorId}`,
            productId: product._id,
            colorId: String(colorId),
            quantity,
            product: {
              _id: product._id,
              name: product.name,
              slug: product.slug,
              images: product.images,
              colors: product.colors,
            },
            color,
            price: color.price,
            discount,
            finalPrice,
            addedAt: Date.now(),
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }

        get().calculateTotals();
      },

      removeItem: (productId, colorId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.colorId === String(colorId)
              )
          ),
        }));
        get().calculateTotals();
      },

      // ✅ حذف چندتایی (برای sync)
      removeItems: (itemsToRemove) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !itemsToRemove.some(
                (r) =>
                  r.productId === item.productId &&
                  r.colorId === item.colorId
              )
          ),
        }));
        get().calculateTotals();
      },

      updateQuantity: (productId, colorId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.colorId === String(colorId)
              ? { ...item, quantity }
              : item
          ),
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          totalDiscount: 0,
          originalTotalPrice: 0,
          _lastSyncResult: null,
        });
      },

      calculateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const originalTotalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const totalPrice = items.reduce(
          (sum, item) => sum + item.finalPrice * item.quantity,
          0
        );
        const totalDiscount = originalTotalPrice - totalPrice;
        set({ totalItems, totalPrice, totalDiscount, originalTotalPrice });
      },

      getItemQuantity: (productId, colorId) => {
        const item = get().items.find(
          (item) =>
            item.productId === productId && item.colorId === String(colorId)
        );
        return item ? item.quantity : 0;
      },

      isInCart: (productId, colorId) => {
        return get().items.some(
          (item) =>
            item.productId === productId && item.colorId === String(colorId)
        );
      },

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      clearSyncResult: () => set({ _lastSyncResult: null }),

      // ✅ Sync با Sanity
      syncWithSanity: (freshProducts) => {
        const currentItems = get().items;
        const removed: CartItem[] = [];
        const updated: CartItem[] = [];
        const outOfStock: CartItem[] = [];
        const newItems: CartItem[] = [];

        for (const item of currentItems) {
          const freshProduct = freshProducts.find(
            (p) => p._id === item.productId
          );

          // ❌ محصول کاملاً حذف شده
          if (!freshProduct) {
            removed.push(item);
            continue;
          }

          const freshColor = freshProduct.colors.find(
            (c) => c._key === item.colorId
          );

          // ❌ رنگ حذف شده
          if (!freshColor) {
            removed.push(item);
            continue;
          }

          // ❌ موجودی صفر
          if (freshColor.stock <= 0) {
            outOfStock.push(item);
            continue;
          }

          const newDiscount = freshColor.discount ?? 0;
          const newFinalPrice =
            freshColor.price - (freshColor.price * newDiscount) / 100;

          // ✅ کاهش quantity اگه بیشتر از موجودی باشه
          const newQuantity = Math.min(item.quantity, freshColor.stock);

          const hasChanges =
            item.price !== freshColor.price ||
            item.discount !== newDiscount ||
            item.quantity !== newQuantity ||
            item.color.name !== freshColor.color ||
            item.product.name !== freshProduct.name ||
            JSON.stringify(item.product.images) !==
              JSON.stringify(freshProduct.images);

          const updatedItem: CartItem = {
            ...item,
            quantity: newQuantity,
            price: freshColor.price,
            discount: newDiscount,
            finalPrice: newFinalPrice,
            color: {
              ...item.color,
              name: freshColor.color,
              price: freshColor.price,
              discount: newDiscount,
              stocks: freshColor.stock,
              status: freshColor.stock > 0 ? 'EXISTENT' : 'NON-EXISTENT',
            },
            product: {
              ...item.product,
              name: freshProduct.name,
              slug: freshProduct.slug,
              images: freshProduct.images,
            },
          };

          if (hasChanges) {
            updated.push(updatedItem);
          }

          newItems.push(updatedItem);
        }

        const result: SyncResult = { removed, updated, outOfStock };

        set({
          items: newItems,
          _lastSyncResult: result,
        });
        get().calculateTotals();

        return result;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({
          items: state.items,
        }) as any,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.calculateTotals();
      },
    }
  )
);

export default useCartStore;