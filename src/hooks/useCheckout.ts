"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "../store/cartStore";
import { CREATE_ORDER } from "../modules/order/operations";
import { GET_STORE_SETTINGS } from "../modules/system/opration";
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
  const router = useRouter();
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

  // Fetch store settings for fee configuration
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const settings = settingsData?.getStoreSettings;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "STANDARD",
      paymentMethod: "COD",
      hasGiftCard: false,
    },
  });

  const { watch } = form;
  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");
  const hasGiftCard = watch("hasGiftCard");

  const calculateTotals = useCallback((): CheckoutCalculations => {
    const subtotal = getTotalPrice();

    // Dynamic Delivery Fee
    let deliveryFee = 0;
    if (deliveryType === "EXPRESS") {
      deliveryFee = Number(settings?.expressDeliveryFee || 30);
    } else if (deliveryType === "SCHEDULED") {
      deliveryFee = Number(settings?.scheduledDeliveryFee || 10);
    } else {
      // STANDARD
      const threshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null;
      if (threshold !== null && subtotal >= threshold) {
        deliveryFee = 0;
      } else {
        deliveryFee = Number(settings?.deliveryFlatRate || 15);
      }
    }

    // Apply free shipping coupon
    if (appliedCoupon?.discountType === "FREE_SHIPPING") {
      deliveryFee = 0;
    }

    // Gift Card Fee
    const giftCardFee = (hasGiftCard && settings?.isGiftCardEnabled) ? Number(settings.giftCardFee) : 0;

    const vatRate = Number(settings?.vatRate || 5) / 100;
    const tax = Number(((subtotal - couponDiscount) * vatRate).toFixed(2));
    const codFee = paymentMethod === "COD" ? Number(settings?.codFee || 10) : 0;
    const total = Number((subtotal - couponDiscount + deliveryFee + tax + codFee + giftCardFee).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      tax,
      codFee: Number(codFee.toFixed(2)),
      total,
      couponDiscount: Number(couponDiscount.toFixed(2)),
      giftCardFee: Number(giftCardFee.toFixed(2))
    };
  }, [
    deliveryType,
    paymentMethod,
    hasGiftCard,
    settings,
    getTotalPrice,
    appliedCoupon,
    couponDiscount,
  ]);

  // useCheckout.ts (handleSubmit অংশ)
  const handleSubmit = useCallback(
    async (data: CheckoutFormData) => {
      setIsProcessing(true);

      try {
        const { total, deliveryFee, codFee, couponDiscount, tax, giftCardFee } =
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
            size: item.size, // Pass size
            color: item.color, // Pass color
          })),
          deliveryCost: Number(deliveryFee.toFixed(2)),
          codFee: Number(codFee.toFixed(2)),
          vatAmount: Number(tax.toFixed(2)),
          discount: Number(couponDiscount?.toFixed(2)),
          giftCardFee: Number((giftCardFee || 0).toFixed(2)),
          hasGiftCard: !!data.hasGiftCard,
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
          const successUrl = `/checkout/success?orderId=${order.id
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
            giftCardFee: giftCardFee, // Pass gift card fee to Stripe intent creation if needed
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
    settings, // Expose settings for UI
  };
}
