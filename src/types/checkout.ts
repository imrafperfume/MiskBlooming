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
}).refine((data) => {
  // If delivery type is SCHEDULED, delivery date and time are required
  if (data.deliveryType === "SCHEDULED") {
    return data.deliveryDate && data.deliveryTime;
  }
  return true;
}, {
  message: "Delivery date and time are required for scheduled delivery",
  path: ["deliveryDate"],
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
