import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, Coupon } from '../types';

interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  titleBn: string;
  titleEn: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  coupon: AppliedCoupon | null;
  deliveryCharge: number;
  freeDeliveryThreshold: number;

  // Actions
  addItem: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;

  // Computed Getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      coupon: null,
      deliveryCharge: 60,
      freeDeliveryThreshold: 1500,

      addItem: (menuItem, quantity = 1, notes) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.menuItem._id === menuItem._id
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            if (notes) updated[existingIndex].notes = notes;
            return { items: updated, isCartOpen: true };
          }

          return {
            items: [...state.items, { menuItem, quantity, notes }],
            isCartOpen: true,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItem._id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem._id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal === 0) return 0;

        if (coupon.discountType === 'percentage') {
          return Math.round((subtotal * coupon.discountValue) / 100);
        }
        return coupon.discountValue;
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const { deliveryCharge, freeDeliveryThreshold } = get();
        if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
          return 0;
        }
        return deliveryCharge;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const deliveryFee = get().getDeliveryFee();
        return Math.max(0, subtotal + deliveryFee - discount);
      },
    }),
    {
      name: 'gharowa_cart_storage',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);
