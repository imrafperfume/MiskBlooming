import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types";
import type { Coupon } from "../types/coupon";

type AddItemResult = {
  success: boolean;
  message: string;
};
interface CartStore {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getDiscountedTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponDiscount: 0,

      addItem: (product, quantity = 1) => {
        let result = { success: true, message: "Item added to cart" };

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.quantity) {
              result = {
                success: false,
                message: `Only ${product.quantity} items available in stock.`,
              };
              return state; // return previous state
            }

            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }

          if (quantity > product.quantity) {
            result = {
              success: false,
              message: `Only ${product.quantity} items available in stock.`,
            };
            return state;
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });

        return result;
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, couponDiscount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      applyCoupon: (coupon) => {
        const total = get().getTotalPrice();
        let discount = 0;

        if (coupon.discountType === "PERCENTAGE") {
          discount = (total * coupon.discountValue) / 100;
          if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
          }
        } else if (coupon.discountType === "FIXED_AMOUNT") {
          discount = coupon.discountValue;
        } else if (coupon.discountType === "FREE_SHIPPING") {
          // Free shipping will be handled in checkout calculations
          discount = 0;
        }

        set({
          appliedCoupon: coupon,
          couponDiscount: Math.min(discount, total), // Don't exceed total amount
        });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, couponDiscount: 0 });
      },

      getDiscountedTotal: () => {
        const total = get().getTotalPrice();
        return Math.max(0, total - get().couponDiscount);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
