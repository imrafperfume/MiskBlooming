import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "AED", orderId, email, shipping, items } = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Create Stripe Checkout Session
   const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: items.map((item: any) => ({
    price_data: {
      currency: currency.toLowerCase(),
      product_data: {
        name: item.product.name,
        images: [item.product.image], // array of image URLs
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: Number(item.quantity),
  })),
  mode: "payment",
  success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderId}`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout?orderId=${orderId}`,
  customer_email: email,
  shipping_address_collection: { allowed_countries: ["AE"] },
  metadata: {
    orderId,
    email,
  },
});

    return NextResponse.json({ checkoutUrl: session.url });

  } catch (error: any) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Stripe checkout session creation failed" },
      { status: 500 }
    );
  }
}
