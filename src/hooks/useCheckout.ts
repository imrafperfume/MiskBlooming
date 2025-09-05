"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "../store/cartStore";
import { CREATE_ORDER } from "../modules/order/operations";
import { checkoutSchema, type CheckoutFormData, type CheckoutCalculations } from "../types/checkout";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export function useCheckout(userId: string) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [createOrder] = useMutation(CREATE_ORDER);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "STANDARD",
      paymentMethod: "COD",
    },
  });

  const { watch } = form;
  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");

  const calculateTotals = useCallback((): CheckoutCalculations => {
    const subtotal = getTotalPrice();
    const deliveryFee =
      deliveryType === "EXPRESS"
        ? 50
        : deliveryType === "SCHEDULED"
        ? 25
        : subtotal > 1000
        ? 0
        : 25;
    const tax = subtotal * 0.05; // 5% VAT
    const codFee = paymentMethod === "COD" ? 10 : 0;
    const total = subtotal + deliveryFee + tax + codFee;

    return { subtotal, deliveryFee, tax, codFee, total };
  }, [deliveryType, paymentMethod, getTotalPrice]);

// useCheckout.ts (handleSubmit অংশ)
const handleSubmit = useCallback(async (data: CheckoutFormData) => {
  setIsProcessing(true);

  try {
    const { total } = calculateTotals();

    const checkoutData = {
      ...data,
      userId,
      items: items.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: total,
    };

    // 1️⃣ Create Order
    const res = await createOrder({ variables: { input: checkoutData } });
    const order = (res as any)?.data?.createOrder;
    if (!order) throw new Error("Failed to create order");
    setOrderId(order.id);

    // 2️⃣ COD handling
    if (data.paymentMethod === "COD") {
      clearCart();
      toast.success("Order Successful");
      router.push(`/checkout/success?orderId=${order.id}`);
      return;
    }

    // 3️⃣ Stripe handling: create PaymentIntent via backend
    const piRes = await fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        currency: "AED",
        orderId: order.id,
        email: checkoutData.email,
        items: items.map((item: any) => ({
      product: {
        name: item.product.name,
        image: item.product.image,
      },
      price: item.product.price,
      quantity: item.quantity,
    })),
        shipping: {
          name: `${checkoutData.firstName} ${checkoutData.lastName}`,
          phone: checkoutData.phone,
          address: {
            line1: checkoutData.address,
            city: checkoutData.city,
            state: checkoutData.emirate,
            postal_code: checkoutData.postalCode || "",
            country: "AE",
          },
        },
      }),
    });

    const { checkoutUrl } = await piRes.json();
    if (!checkoutUrl) throw new Error("Failed to create Stripe session");

    // 4️⃣ Redirect user to Stripe Checkout
    window.location.href = checkoutUrl;

  } catch (error: any) {
    console.error("Checkout error:", error);
    toast.error(error.message || "Checkout failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
}, [userId, items, calculateTotals, createOrder, clearCart, router]);



  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    form,
    currentStep,
    isProcessing,
    orderId,
    clientSecret,
    calculateTotals,
    handleSubmit,
    nextStep,
    prevStep,
  };
}
