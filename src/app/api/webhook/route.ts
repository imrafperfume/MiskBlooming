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
    console.error("Missing Stripe signature or webhook secret");
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  // Read request body as string
  let body: string;
  try {
    body = await req.text();
  } catch (err) {
    console.error("Failed to read request body:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent & {
          charges?: Stripe.ApiList<Stripe.Charge>;
        };

        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.error("Order ID missing in payment_intent.succeeded event");
          console.log("PaymentIntent metadata:", paymentIntent.metadata);
          break;
        }

        let last4: string | null = null;

        const charge = paymentIntent.charges?.data?.[0];
        if (charge?.payment_method_details?.type === "card") {
          last4 = charge.payment_method_details.card?.last4 || null;
        }

        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              paymentMethod: "STRIPE",
              stripePaymentId: paymentIntent.id,
              cardLast4: last4 || null,
              status: "PROCESSING",
            },
          });
          console.log(`Order ${orderId} marked as PAID`);
        } catch (err) {
          console.error(`Failed to update order ${orderId}:`, err);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.error(
            "Order ID missing in payment_intent.payment_failed event"
          );
          break;
        }

        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "FAILED",
              stripePaymentId: paymentIntent.id,
              status: "CANCELLED",
            },
          });
          console.log(`Order ${orderId} marked as FAILED`);
        } catch (err) {
          console.error(`Failed to update order ${orderId}:`, err);
        }
        break;
      }

      default:
        console.warn(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook handler error:", error.message || error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
