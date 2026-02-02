import { z } from "zod";

export const checkoutSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  email: z.string().email("Please enter a valid email address").max(100, "Email is too long"),
  phone: z.string().min(10, "Please enter a valid phone number").max(20, "Phone number is too long"),

  // Shipping Address
  address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address is too long"),
  city: z.string().min(2, "City is required").max(50, "City name is too long"),
  emirate: z.string().min(2, "Emirate is required"),
  postalCode: z.string().max(10, "Postal code is too long").optional(),

  // Payment Information
  paymentMethod: z.enum(["COD", "STRIPE"]),

  // Delivery Options
  deliveryType: z.enum(["STANDARD", "EXPRESS", "SCHEDULED"]),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  specialInstructions: z.string().max(500, "Special instructions are too long").optional(),

  // Gift Card
  hasGiftCard: z.boolean().optional(),
  giftCardSize: z.string().optional(),
  giftCardTheme: z.string().optional(),
  giftRecipient: z.string().optional(),
  giftSender: z.string().optional(),
  giftMessage: z.string().max(300, "Message is too long").optional(),
}).refine((data) => {
  // If delivery type is SCHEDULED, delivery date and time are required
  if (data.deliveryType === "SCHEDULED") {
    return !!(data.deliveryDate && data.deliveryTime);
  }
  return true;
}, {
  message: "Delivery date and time are required for scheduled delivery",
  path: ["deliveryDate"],
}).refine((data) => {
  if (data.hasGiftCard) {
    return !!(data.giftCardSize && data.giftCardTheme && data.giftRecipient && data.giftSender && data.giftMessage);
  }
  return true;
}, {
  message: "Please complete all gift card details",
  path: ["giftCardSize"], // Pointing to first field, or could be general
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export type PaymentMethod = "COD" | "STRIPE";
export type DeliveryType = "STANDARD" | "EXPRESS" | "SCHEDULED";

export interface CheckoutCalculations {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  codFee: number;
  total: number;
  couponDiscount?: number;
  giftCardFee?: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CheckoutData extends CheckoutFormData {
  userId?: string; // Optional for guest checkout
  items: OrderItem[];
  couponCode?: string;
  totalAmount: number;
  isGuest?: boolean; // Flag to identify guest checkout
}
