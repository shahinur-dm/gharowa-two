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
  addItem: (
    item: MenuItem,
    quantity?: number,
    notes?: string,
    selectedPortion?: { name: string; price: number },
    selectedAddOns?: Array<{ name: string; price: number }>,
    unitPrice?: number
  ) => void;
  removeItem: (itemId: string, portionName?: string) => void;
  updateQuantity: (itemId: string, quantity: number, portionName?: string) => void;
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

      addItem: (menuItem, quantity = 1, notes, selectedPortion, selectedAddOns, unitPrice) => {
        set((state) => {
          const calculatedUnitPrice =
            unitPrice ||
            (selectedPortion ? selectedPortion.price : menuItem.price) +
              (selectedAddOns ? selectedAddOns.reduce((acc, a) => acc + a.price, 0) : 0);

          const portionKey = selectedPortion?.name || 'default';
          const existingIndex = state.items.findIndex(
            (i) =>
              i.menuItem._id === menuItem._id &&
              (i.selectedPortion?.name || 'default') === portionKey
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            if (notes) updated[existingIndex].notes = notes;
            if (selectedAddOns) updated[existingIndex].selectedAddOns = selectedAddOns;
            updated[existingIndex].unitPrice = calculatedUnitPrice;
            return { items: updated, isCartOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                menuItem,
                quantity,
                notes,
                selectedPortion,
                selectedAddOns,
                unitPrice: calculatedUnitPrice,
              },
            ],
            isCartOpen: true,
          };
        });
      },

      removeItem: (itemId, portionName) => {
        set((state) => ({
          items: state.items.filter((i) => {
            if (i.menuItem._id !== itemId) return true;
            if (portionName && i.selectedPortion?.name !== portionName) return true;
            return false;
          }),
        }));
      },

      updateQuantity: (itemId, quantity, portionName) => {
        if (quantity <= 0) {
          get().removeItem(itemId, portionName);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => {
            const matchesId = i.menuItem._id === itemId;
            const matchesPortion = !portionName || i.selectedPortion?.name === portionName;
            if (matchesId && matchesPortion) {
              return { ...i, quantity };
            }
            return i;
          }),
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
        return get().items.reduce((total, item) => {
          const itemPrice = item.unitPrice || item.menuItem.price;
          return total + itemPrice * item.quantity;
        }, 0);
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
