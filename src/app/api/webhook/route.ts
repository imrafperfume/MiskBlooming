import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil", // type override
});

export async function POST(req: Request) {
  const h = await headers();
  const sig = h.get("stripe-signature");
  const buf = await req.text(); // raw body required

  try {
    const event = stripe?.webhooks?.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("EVENT", event);
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event?.data.object as Stripe.PaymentIntent;
        console.log(pi);
        const orderId = pi.metadata?.orderId;
        // TODO: call GraphQL/DB to mark orderId as PAID
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              stripePaymentId: pi.id,
              // paymentStatus: "PAID",
            },
          });
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.orderId;
        // TODO: mark order failed
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "FAILED",
              status: "CANCELLED",
              stripePaymentId: pi.id,
            },
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
