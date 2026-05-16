"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderItem } from "./supabase";

type CartItem = OrderItem & { image?: string };

function cartKey(item: CartItem): string {
  return item.product_id + (item.selected_variants ? JSON.stringify(item.selected_variants) : "");
}

interface CartState {
  items: CartItem[];
  note: string;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  setNote: (note: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalQuantity: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      note: "",
      addItem: (item) => {
        const key = cartKey(item);
        const existing = get().items.find((i) => cartKey(i) === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              cartKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId, selectedVariants) => {
        const key = productId + (selectedVariants ? JSON.stringify(selectedVariants) : "");
        set({ items: get().items.filter((i) => cartKey(i) !== key) });
      },
      updateQuantity: (productId, quantity, selectedVariants) => {
        const key = productId + (selectedVariants ? JSON.stringify(selectedVariants) : "");
        if (quantity <= 0) {
          get().removeItem(productId, selectedVariants);
          return;
        }
        set({
          items: get().items.map((i) =>
            cartKey(i) === key ? { ...i, quantity } : i
          ),
        });
      },
      setNote: (note) => set({ note }),
      clearCart: () => set({ items: [], note: "" }),
      totalItems: () => get().items.length,
      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "jozuf-diesel-cart",
    }
  )
);
