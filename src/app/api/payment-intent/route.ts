import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency = "AED",
      orderId,
      email,
      shipping,
    }: {
      amount: number;
      currency?: string;
      orderId: string;
      email?: string;
      shipping?: {
        name: string;
        address: {
          line1: string;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
        };
        phone?: string;
      };
    } = await req.json();

    const intent = await stripe.paymentIntents.create({
      amount, // in minor units
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: "Purchase of flowers for UAE customer",
      metadata: { orderId },
      shipping,
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
