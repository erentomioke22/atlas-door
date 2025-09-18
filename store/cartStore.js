// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useCartStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       items: [],
//       totalItems: 0,
//       totalPrice: 0,

//       // Actions
//       addItem: (product, colorId, quantity = 1) => {
//         const existingItemIndex = get().items.findIndex(
//           (item) => item.productId === product.id && item.colorId === colorId
//         );

//         if (existingItemIndex > -1) {
//           // Update existing item
//           set((state) => ({
//             items: state.items.map((item, index) =>
//               index === existingItemIndex
//                 ? { ...item, quantity: item.quantity + quantity }
//                 : item
//             ),
//           }));
//         } else {
//           // Add new item
//           set((state) => ({
//             items: [
//               ...state.items,
//               {
//                 id: `${product.id}-${colorId}`,
//                 productId: product.id,
//                 colorId,
//                 quantity,
//                 product,
//                 color: product.colors.find((c) => c.id === colorId),
//                 price: product.colors.find((c) => c.id === colorId)?.price || 0,
//               },
//             ],
//           }));
//         }

//         get().calculateTotals();
//       },

//       removeItem: (productId, colorId) => {
//         set((state) => ({
//           items: state.items.filter(
//             (item) =>
//               !(item.productId === productId && item.colorId === colorId)
//           ),
//         }));
//         get().calculateTotals();
//       },

//       updateQuantity: (productId, colorId, quantity) => {
//         if (quantity <= 0) {
//           get().removeItem(productId, colorId);
//           return;
//         }

//         set((state) => ({
//           items: state.items.map((item) =>
//             item.productId === productId && item.colorId === colorId
//               ? { ...item, quantity }
//               : item
//           ),
//         }));
//         get().calculateTotals();
//       },

//       clearCart: () => {
//         set({ items: [], totalItems: 0, totalPrice: 0 });
//       },

//       calculateTotals: () => {
//         const items = get().items;
//         const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
//         const totalPrice = items.reduce((sum, item) => {
//           const itemPrice =
//             item.price - (item.price * (item.color?.discount || 0)) / 100;
//           return sum + itemPrice * item.quantity;
//         }, 0);

//         set({ totalItems, totalPrice });
//       },

//       getItemQuantity: (productId, colorId) => {
//         const item = get().items.find(
//           (item) => item.productId === productId && item.colorId === colorId
//         );
//         return item ? item.quantity : 0;
//       },

//       isInCart: (productId, colorId) => {
//         return get().items.some(
//           (item) => item.productId === productId && item.colorId === colorId
//         );
//       },
//     }),
//     {
//       name: "cart-storage", // localStorage key
//       partialize: (state) => ({ items: state.items }), // Only persist items
//     }
//   )
// );

// export default useCartStore;


import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
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
          item => item.productId === product.id && item.colorId === colorId
        );

        if (existingItemIndex > -1) {
          // Update existing item
          set(state => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
        } else {
          // Add new item
          set(state => ({
            items: [
              ...state.items,
              {
                id: `${product.id}-${colorId}`,
                productId: product.id,
                colorId,
                quantity,
                product,
                color: product.colors.find(c => c.id === colorId),
                price: product.colors.find(c => c.id === colorId)?.price || 0,
                discount: product.colors.find(c => c.id === colorId)?.discount || 0
              }
            ]
          }));
        }

        get().calculateTotals();
      },

      removeItem: (productId, colorId) => {
        set(state => ({
          items: state.items.filter(
            item => !(item.productId === productId && item.colorId === colorId)
          )
        }));
        get().calculateTotals();
      },

      updateQuantity: (productId, colorId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.productId === productId && item.colorId === colorId
              ? { ...item, quantity }
              : item
          )
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      calculateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const originalTotalPrice = items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        const totalPrice = items.reduce((sum, item) => {
          const itemPrice = item.price - (item.price * (item.color?.discount || 0) / 100);
          return sum + (itemPrice * item.quantity);
        }, 0);
        const totalDiscount = originalTotalPrice - totalPrice;
        set({ totalItems, totalPrice , totalDiscount , originalTotalPrice});
      },

      getItemQuantity: (productId, colorId) => {
        const item = get().items.find(
          item => item.productId === productId && item.colorId === colorId
        );
        return item ? item.quantity : 0;
      },

      isInCart: (productId, colorId) => {
        return get().items.some(
          item => item.productId === productId && item.colorId === colorId
        );
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      restoreFromServer: async () => {
        try {
          const response = await fetch('/api/product/cart/restore', {
            headers: { 'Cache-Control': 'no-cache' }
          });

          if (response.ok) {
            const { items } = await response.json();
            
            if (items && items.length > 0) {
              // Convert server cart items to local format
              const localItems = items.map(item => ({
                id: `${item.productId}-${item.colorId}`,
                productId: item.productId,
                colorId: item.colorId,
                quantity: item.quantity,
                product: item.product,
                color: item.color,
                price: item.color?.price || 0,
                addedAt: new Date(item.createdAt).getTime()
              }));

              set({ items: localItems });
              get().calculateTotals();
              console.log('Cart restored from server cart items');
              return true;
            }
          }
        } catch (error) {
          console.error('Restore error:', error);
        }
        return false;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.calculateTotals(); // Recalculate totals after hydration

        if (!state?.items || state.items.length === 0) {
          state?.restoreFromServer();
        }
      },
    }
  )
);

export default useCartStore;