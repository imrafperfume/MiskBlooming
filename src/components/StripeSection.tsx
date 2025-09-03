// StripeSection.tsx
"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function StripeSection({
  clientSecret,
  amountLabel,
  orderId,
}: {
  clientSecret: string;
  amountLabel: string;
  orderId: string;
}) {
  if (!clientSecret) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  } as const;

  return (
    <Elements stripe={stripePromise} options={options}>
      <Inner amountLabel={amountLabel} orderId={orderId} />
    </Elements>
  );
}

function Inner({
  amountLabel,
  orderId,
}: {
  amountLabel: string;
  orderId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // State for Apple Pay / Google Pay
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (!stripe) return;

    // Initialize Payment Request for Apple Pay / Google Pay
    const pr = stripe.paymentRequest({
      country: "AE", // UAE country code
      currency: "aed", // AED currency
      total: {
        label: "Order Payment",
        amount: Number(amountLabel.replace(/[^0-9]/g, "")) * 100, // Convert to fils
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Apple Pay / Google Pay is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });
  }, [stripe, amountLabel]);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderId}`,
      },
    });

    if (error) {
      console.error("Payment error:", error.message);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Apple Pay / Google Pay Button */}
      {paymentRequest && (
        <div className="w-full">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "default", // "buy", "donate" etc.
                  theme: "dark", // "light", "light-outline"
                  height: "48px",
                },
              },
            }}
          />
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or pay with card</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>
      )}

      {/* Card Payment Element */}
      <PaymentElement />

      {/* Pay Button */}
      <button
        onClick={handlePay}
        disabled={!stripe || loading}
        className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium rounded-xl w-full shadow-md hover:from-green-700 hover:to-emerald-600 transition disabled:opacity-50"
      >
        {loading ? "Processing…" : `Pay ${amountLabel}`}
      </button>
    </div>
  );
}
