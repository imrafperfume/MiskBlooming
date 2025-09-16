import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const {
      items,
      amount,
      currency = "AED",
      orderId,
      email,
      shipping,
    } = await req.json();

    if (!amount || amount <= 0)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    if (!orderId)
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Order #${orderId}` },
            unit_amount: Number(amount),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout?orderId=${orderId}`,
      customer_email: email,
      shipping_address_collection: { allowed_countries: ["AE"] },
      metadata: {
        orderId: orderId.toString(),
        email,
        finalAmount: amount.toString(),
      },
      payment_intent_data: {
        metadata: {
          orderId: orderId.toString(),
          email,
          finalAmount: amount.toString(),
        },
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
