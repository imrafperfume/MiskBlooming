"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "../store/cartStore";
import { CREATE_ORDER } from "../modules/order/operations";
import {
  checkoutSchema,
  type CheckoutFormData,
  type CheckoutCalculations,
} from "../types/checkout";

// Initialize Stripe
export function useCheckout(userId?: string) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { items, getTotalPrice, clearCart, appliedCoupon, couponDiscount } =
    useCartStore();
  console.log("🚀 ~ useCheckout ~ appliedCoupon:", appliedCoupon);
  const router = useRouter();
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

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
    let deliveryFee =
      deliveryType === "EXPRESS"
        ? 50
        : deliveryType === "SCHEDULED"
        ? 25
        : subtotal > 500
        ? 0
        : 25;

    // Apply free shipping coupon
    if (appliedCoupon?.discountType === "FREE_SHIPPING") {
      deliveryFee = 0;
    }

    const tax = (subtotal - couponDiscount) * 0.05; // 5% VAT on discounted amount
    const codFee = paymentMethod === "COD" ? 10 : 0;
    const total = subtotal - couponDiscount + deliveryFee + tax + codFee;

    return { subtotal, deliveryFee, tax, codFee, total, couponDiscount };
  }, [
    deliveryType,
    paymentMethod,
    getTotalPrice,
    appliedCoupon,
    couponDiscount,
  ]);

  // useCheckout.ts (handleSubmit অংশ)
  const handleSubmit = useCallback(
    async (data: CheckoutFormData) => {
      setIsProcessing(true);

      try {
        const { total, deliveryFee, codFee, couponDiscount, tax } =
          calculateTotals();

        const isGuest = !userId || userId === "";
        const checkoutData = {
          ...data,

          userId: isGuest ? undefined : userId,
          couponCode: appliedCoupon?.code,
          totalAmount: Number(total.toFixed(2)),
          items: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          deliveryCost: Number(deliveryFee.toFixed(2)),
          codFee: Number(codFee.toFixed(2)),
          vatAmount: Number(tax.toFixed(2)),
          discount: Number(couponDiscount?.toFixed(2)),
          isGuest,
        };

        // 1 Create Order
        const res = await createOrder({ variables: { input: checkoutData } });
        const order = (res as any)?.data?.createOrder;
        if (!order) throw new Error("Failed to create order");
        setOrderId(order.id);

        // 2 COD handling
        if (data.paymentMethod === "COD") {
          clearCart();
          toast.success("Order Successful");
          // Always redirect to guest success page since we're using guest checkout by default
          const successUrl = `/checkout/success?orderId=${
            order.id
          }&email=${encodeURIComponent(data.email)}`;
          router.push(successUrl);
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
              product: { name: item.product.name, image: item.product.image },
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
            deliveryFee: deliveryFee,
            tax: tax,
            couponDiscount: couponDiscount,
          }),
        });

        const { checkoutUrl } = await piRes.json();
        if (!checkoutUrl) throw new Error("Failed to create Stripe session");
        clearCart();

        // 4 Redirect user to Stripe Checkout
        window.location.href = checkoutUrl;
      } catch (error: any) {
        console.error("Checkout error:", error);

        // Handle specific error types
        if (error.message?.includes("Invalid coupon")) {
          toast.error(
            "The coupon code is invalid or has expired. Please try again."
          );
        } else if (error.message?.includes("Minimum order amount")) {
          toast.error(
            "Your order doesn't meet the minimum amount requirement for this coupon."
          );
        } else if (error.message?.includes("usage limit")) {
          toast.error("This coupon has reached its usage limit.");
        } else if (error.message?.includes("Stripe")) {
          toast.error(
            "Payment processing failed. Please try again or use a different payment method."
          );
        } else if (
          error.message?.includes("network") ||
          error.message?.includes("fetch")
        ) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else {
          toast.error(error.message || "Checkout failed. Please try again.");
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [userId, items, calculateTotals, createOrder, clearCart, router]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
