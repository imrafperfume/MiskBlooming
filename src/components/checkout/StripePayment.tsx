"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/Button";
import { Loader2, CreditCard, Shield } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  clientSecret: string;
  amountLabel: string;
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function StripePayment({
  clientSecret,
  amountLabel,
  orderId,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#d4af37",
        colorBackground: "#fdf5e6",
        colorText: "#2c2c2c",
        borderRadius: "8px",
      },
    },
  };
    console.log("🚀 ~ StripePayment ~ clientSecret:", clientSecret)
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        amountLabel={amountLabel}
        orderId={orderId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

function PaymentForm({
  amountLabel,
  orderId,
  onSuccess,
  onError,
}: Omit<StripePaymentProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Payment system not ready");
      return;
    }

    setIsLoading(true);

    try {
      // Submit the form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message || "Form validation failed");
        return;
      }

      // Confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderId}`,
        },
      });

      if (error) {
        onError(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <CreditCard className="w-5 h-5 text-luxury-500" />
        <h3 className="text-lg font-semibold text-charcoal-900">
          Complete Your Payment
        </h3>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-cream-50 border border-cream-300 rounded-xl">
          <PaymentElement />
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Secure Payment</span>
          </div>
          <p className="text-green-700 text-sm">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          variant="luxury"
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing Payment...
            </div>
          ) : (
            `Complete Payment • ${amountLabel}`
          )}
        </Button>
      </form>
    </div>
  );
}
