import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Id = string | number;

type Color = {
  id: Id;
  price: number;
  discount?: number;
  // You can extend with: name?: string; hexCode?: string; stocks?: number;
};

type Product = {
  id: Id;
  colors: Color[];
  // Extend as needed: name?: string; images?: string[]; etc.
};




export type CartItem = {
  id: string;
  productId: Id;
  colorId: Id;
  quantity: number;
  product: Product;
  color?: Color;
  price: number;
  discount?: number;
  addedAt?: number;
};

type CartState = {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  originalTotalPrice: number;
  _hasHydrated: boolean;

  // Actions
  addItem: (product: Product, colorId: Id, quantity?: number) => void;
  removeItem: (productId: Id, colorId: Id) => void;
  updateQuantity: (productId: Id, colorId: Id, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  getItemQuantity: (productId: Id, colorId: Id) => number;
  isInCart: (productId: Id, colorId: Id) => boolean;
  setHasHydrated: (state: boolean) => void;
  restoreFromServer: () => Promise<boolean>;
};

const useCartStore = create<CartState>()(
  persist<CartState>(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalPrice: 0,
      totalDiscount: 0,
      originalTotalPrice: 0,
      _hasHydrated: false,

      // Actions
      addItem: (product, colorId, quantity = 1) => {
        const existingItemIndex = get().items.findIndex(
          (item) => item.productId === product.id && item.colorId === colorId
        );

        if (existingItemIndex > -1) {
          // Update existing item
          set((state) => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const color = product.colors.find((c) => c.id === colorId);
          set((state) => ({
            items: [
              ...state.items,
              {
                id: `${product.id}-${colorId}`,
                productId: product.id,
                colorId,
                quantity,
                product,
                color,
                price: color?.price ?? 0,
                discount: color?.discount ?? 0,
              },
            ],
          }));
        }

        get().calculateTotals();
      },

      removeItem: (productId, colorId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.colorId === colorId)
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
            item.productId === productId && item.colorId === colorId
              ? { ...item, quantity }
              : item
          ),
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0, totalDiscount: 0, originalTotalPrice: 0 });
      },

      calculateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const originalTotalPrice = items.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0);
        const totalPrice = items.reduce((sum, item) => {
          const discount = item.color?.discount ?? 0;
          const itemPrice = item.price - (item.price * discount) / 100;
          return sum + itemPrice * item.quantity;
        }, 0);
        const totalDiscount = originalTotalPrice - totalPrice;
        set({ totalItems, totalPrice, totalDiscount, originalTotalPrice });
      },

      getItemQuantity: (productId, colorId) => {
        const item = get().items.find(
          (item) => item.productId === productId && item.colorId === colorId
        );
        return item ? item.quantity : 0;
      },

      isInCart: (productId, colorId) => {
        return get().items.some(
          (item) => item.productId === productId && item.colorId === colorId
        );
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      restoreFromServer: async () => {
        try {
          const response = await fetch("/api/product/cart/restore", {
            headers: { "Cache-Control": "no-cache" },
          });

          if (response.ok) {
            const { items } = (await response.json()) as {
              items: Array<{
                productId: Id;
                colorId: Id;
                quantity: number;
                product: Product;
                color?: Color;
                createdAt: string | number | Date;
              }>;
            };

            const localItems: CartItem[] = items.map((item) => ({
              id: `${item.productId}-${item.colorId}`,
              productId: item.productId,
              colorId: item.colorId,
              quantity: item.quantity,
              product: item.product,
              color: item.color,
              price: item.color?.price ?? 0,
              addedAt: new Date(item.createdAt).getTime(),
            }));

            set({ items: localItems });
            get().calculateTotals();
            return true;
          }
        } catch (error) {
          // console.error("Restore error:", error);
        }
        return false;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage<CartState>(() => localStorage),
      partialize: (state) => ({ items: state.items }) as any ,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.calculateTotals();

        if (!state?.items || state.items.length === 0) {
          state?.restoreFromServer();
        }
      },
    }
  )
);

export default useCartStore;