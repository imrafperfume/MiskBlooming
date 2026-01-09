import Stripe from "stripe";
import { STRIPE_CONFIG } from "./stripe-config";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_CONFIG.API_VERSION,
  typescript: true,
});
