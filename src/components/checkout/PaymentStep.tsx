"use client";

import { CreditCard, Banknote, Wallet, Shield, Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/Button";
import { CheckoutStep } from "./CheckoutStep";
import { formatPrice } from "../../lib/utils";
import type { CheckoutFormData } from "../../types/checkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onBack: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
  total: number;
  clientSecret?: string | null;
  orderId?: string;
}

const paymentMethods = [
  {
    id: "STRIPE",
    name: "Card / Apple Pay / Google Pay",
    description: "Secure one‑tap checkout via Stripe",
    icon: CreditCard,
    fee: 0,
    popular: true,
  },
  {
    id: "COD",
    name: "Cash on Delivery",
    description: "Pay when your flowers arrive",
    icon: Banknote,
    fee: 10,
    popular: false,
  },
];

export function PaymentStep({ 
  form, 
  onBack, 
  onSubmit, 
  isProcessing, 
  total,
  clientSecret,
  orderId 
}: PaymentStepProps) {
  console.log("🚀 ~ PaymentStep ~ clientSecret:", clientSecret)
  const { register, watch, setValue } = form;
  const paymentMethod = watch("paymentMethod");
  const router = useRouter();

 const handleStripeClick = async () => {
    try {
      if (!orderId) throw new Error("Order ID missing");
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");

      // Redirect to Stripe Checkout
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: Math.round(total * 100),
          currency: "AED",
          email: form.getValues("email"),
        }),
      });
      const data = await res.json();
      console.log("🚀 ~ handleStripeClick ~ data:", data)
      if (!data.clientSecret) throw new Error("Payment initialization failed");

      const { error } = await stripe.confirmPayment({
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderId}`,
        },
        redirect: "always",
      });

      if (error) {
        console.error("Stripe redirect error:", error.message);
        toast.error(error.message || "Payment failed");
      }
    } catch (err: any) {
      console.error("Stripe handle error:", err.message);
      toast.error(err.message || "Something went wrong");
    }
  };


  return (
    <CheckoutStep>
      <div className="flex items-center mb-6">
        <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-luxury-500 mr-3" />
        <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-charcoal-900">
          Payment Method
        </h2>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-4">
            Choose Payment Method
          </label>
          <div className="space-y-3 relative">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === method.id
                    ? "border-luxury-500 bg-luxury-50"
                    : "border-cream-300 hover:bg-cream-50 hover:border-luxury-300"
                }`}
              >
                <input
                  type="radio"
                  value={method.id}
                  {...register("paymentMethod")}
                  className="mr-3 text-luxury-500 focus:ring-luxury-500"
                  onChange={() => setValue("paymentMethod", method.id as any)}
                />
                <method.icon className="w-6 h-6 text-charcoal-700 mr-3" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-charcoal-900 text-xs sm:text-base">
                      {method.name}
                    </span>
                    {method.popular && (
                      <span className="ml-2 px-2 py-1 sm:relative absolute top-1 right-1 bg-luxury-100 text-luxury-700 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                    {method.fee > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        +{formatPrice(method.fee)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {method.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method Info */}
        {paymentMethod === "COD" && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center mb-2">
              <Banknote className="w-5 h-5 text-amber-600 mr-2" />
              <span className="font-medium text-amber-800">Cash on Delivery</span>
            </div>
            <p className="text-sm text-amber-700">
              Pay with cash when your flowers are delivered. A service fee of AED 10 applies. 
              Please have the exact amount ready for our delivery partner.
            </p>
          </div>
        )}

        {paymentMethod === "STRIPE" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center mb-2">
              <Wallet className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Digital Wallet</span>
            </div>
            <p className="text-sm text-blue-700">
              You'll be redirected to complete payment with your preferred digital wallet. 
              Secure and convenient payment in one tap.
            </p>
          </div>
        )}

        {/* Security Features */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Secure Payment</span>
          </div>
          <p className="text-sm text-green-700">
            Your payment information is encrypted and secure. We never store your card details. 
            All transactions are processed through secure payment gateways.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="order-2 sm:order-1"
        >
          Back to Shipping
        </Button>

        {paymentMethod === "STRIPE" ? (
          <Button
            type="button"
            variant="luxury"
            size="lg"
            onClick={onSubmit}
            className="min-w-[200px] order-1 sm:order-2"
          >
            Complete Order • {formatPrice(total)}
          </Button>
        ) : (
          <Button
            type="button"
            variant="luxury"
            size="lg"
            onClick={onSubmit}
            disabled={isProcessing}
            className="min-w-[200px] order-1 sm:order-2"
          >
            Complete Order • {formatPrice(total)}
          </Button>
        )}
      </div>
    </CheckoutStep>
  );
}
