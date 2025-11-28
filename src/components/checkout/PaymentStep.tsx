"use client";

import { CreditCard, Banknote, Wallet, Shield, Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/Button";
import { CheckoutStep } from "./CheckoutStep";
import { formatPrice } from "../../lib/utils";
import type { CheckoutFormData } from "../../types/checkout";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@apollo/client";
import { GET_PAYMENT_SETTINGS } from "@/src/modules/payment/operation";

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
}: // clientSecret,
// orderId,
PaymentStepProps) {
  const { register, watch, setValue } = form;
  const paymentMethod = watch("paymentMethod");
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_PAYMENT_SETTINGS);
  console.log("🚀 ~ PaymentStep ~ data:", data);

  if (loading) return <p>Loading payment settings...</p>;
  if (error) return <p>Failed to load payment settings</p>;

  const payments = data?.getPaymentSettings;
  // Filter payment methods based on enabled flags
  const availablePaymentMethods = paymentMethods.filter((method) => {
    if (method.id === "STRIPE" && !payments?.stripeEnabled) return false;
    if (method.id === "COD" && !payments?.codEnabled) return false;
    return true;
  });
  return (
    <CheckoutStep>
      <div className="flex items-center mb-6">
        <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-primary  mr-3" />
        <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-foreground ">
          Payment Method
        </h2>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground  mb-4">
            Choose Payment Method
          </label>
          <div className="space-y-3 relative">
            {payments ? (
              availablePaymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === method.id
                      ? "border-border bg-primary "
                      : "border-border  hover:bg-primary hover:border-border"
                  }`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    {...register("paymentMethod")}
                    className="mr-3 text-primary  focus:ring-ring"
                    onChange={() => setValue("paymentMethod", method.id as any)}
                  />
                  <method.icon className="w-6 h-6 text-foreground mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-foreground  text-xs sm:text-base">
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
                    <div className="text-sm text-foreground">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <p className="mt-4 items-center text-center text-sm text-red-600">
                No payment methods available.
              </p>
            )}
          </div>
        </div>

        {/* Payment Method Info */}
        {paymentMethod === "COD" && (
          <div className="p-4 bg-primary-foreground border border-amber-200 rounded-xl">
            <div className="flex items-center mb-2">
              <Banknote className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium text-primary">Cash on Delivery</span>
            </div>
            <p className="text-sm text-primary">
              Pay with cash when your flowers are delivered. A service fee of
              AED 10 applies. Please have the exact amount ready for our
              delivery partner.
            </p>
          </div>
        )}

        {paymentMethod === "STRIPE" && (
          <div className="p-4 bg-primary-foreground border border-border rounded-xl">
            <div className="flex items-center mb-2">
              <Wallet className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium text-primary">Digital Wallet</span>
            </div>
            <p className="text-sm text-primary">
              You'll be redirected to complete payment with your preferred
              digital wallet. Secure and convenient payment in one tap.
            </p>
          </div>
        )}

        {/* Security Features */}
        <div className="bg-primary-foreground border border-border rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Secure Payment</span>
          </div>
          <p className="text-sm text-green-700">
            Your payment information is encrypted and secure. We never store
            your card details. All transactions are processed through secure
            payment gateways.
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
