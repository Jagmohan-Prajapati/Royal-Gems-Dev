import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // or productId
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  stoneType?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingNode = currentItems.find((i) => i.productId === item.productId);
        if (existingNode) {
          set({
            items: currentItems.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, id: item.productId, quantity: item.quantity || 1 }],
          });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },
      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: qty } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      subtotal: () => {
        return get().items.reduce((total, i) => total + (i.price * i.quantity), 0);
      },
      shipping: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        if (sub >= 4000) return 0;
        return 299;
      },
      total: () => {
        return get().subtotal() + get().shipping();
      },
    }),
    {
      name: 'royalgems-cart',
    }
  )
);
export default useCartStore;
