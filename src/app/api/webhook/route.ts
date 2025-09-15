// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/db";

export const config = {
  runtime: "nodejs",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  // Read request body as string
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(
      "⚠️ Stripe webhook signature verification failed:",
      err.message
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          // Safe way to get last4
          let last4: string | null = null;
          const paymentMethodDetails =
            paymentIntent.payment_method_types?.includes("card")
              ? (paymentIntent as any).charges?.data?.[0]
                  ?.payment_method_details?.card?.last4
              : null;

          last4 = last4 || null;

          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              paymentMethod: "STRIPE",
              stripePaymentId: paymentIntent.id,
              cardLast4: last4,
              status: "PROCESSING",
            },
          });

          console.log(` Order ${orderId} marked as PAID`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "FAILED",
              stripePaymentId: paymentIntent.id,
              status: "CANCELLED",
            },
          });

          console.log(` Order ${orderId} marked as FAILED`);
        }
        break;
      }

      default:
        console.log(` Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error(" Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
