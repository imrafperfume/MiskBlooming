import { z } from "zod";

export const checkoutSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Shipping Address
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  emirate: z.string().min(2, "Emirate is required"),
  postalCode: z.string().optional(),

  // Payment Information
  paymentMethod: z.enum(["COD", "STRIPE"]),

  // Delivery Options
  deliveryType: z.enum(["STANDARD", "EXPRESS", "SCHEDULED"]),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  specialInstructions: z.string().optional(),
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
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CheckoutData extends CheckoutFormData {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
}
