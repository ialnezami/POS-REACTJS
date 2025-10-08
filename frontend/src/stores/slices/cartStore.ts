import { create } from 'zustand';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,

  addItem: (product: Product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      get().updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        subtotal: product.price * quantity,
      };
      set({ items: [...items, newItem] });
      get().calculateTotals();
    }
  },

  removeItem: (productId: string) => {
    const items = get().items.filter((item) => item.product.id !== productId);
    set({ items });
    get().calculateTotals();
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const items = get().items.map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            subtotal: item.product.price * quantity,
          }
        : item,
    );
    set({ items });
    get().calculateTotals();
  },

  clearCart: () => {
    set({ items: [], subtotal: 0, tax: 0, total: 0 });
  },

  calculateTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;
    set({ subtotal, tax, total });
  },
}));


