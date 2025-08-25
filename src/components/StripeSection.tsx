// StripeSection.tsx
"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function StripeSection({
  clientSecret,
  amountLabel,
}: {
  clientSecret: string;
  amountLabel: string;
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
      <Inner amountLabel={amountLabel} />
    </Elements>
  );
}

function Inner({ amountLabel }: { amountLabel: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      },
      redirect: "if_required",
    });

    // if (error) alert(error.message);
    console.log("Strip section", error);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <button
        onClick={handlePay}
        disabled={!stripe || loading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg w-full"
      >
        {loading ? "Processing…" : `Pay ${amountLabel}`}
      </button>
    </div>
  );
}
