import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/db";

export const config = {
  runtime: "nodejs", // or 'nodejs' if you prefer server runtime
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Convert request body to ArrayBuffer
 const buf = Buffer.from(await req.arrayBuffer());
  // const bodyUint8 = new Uint8Array(buf);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf, // pass Uint8Array
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          const charges = (paymentIntent as any).charges?.data ?? [];
          const last4 = charges[0]?.payment_method_details?.card?.last4 || null;

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
          console.log(`Order ${orderId} marked as PAID`);
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
          console.log(`Order ${orderId} marked as FAILED`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
