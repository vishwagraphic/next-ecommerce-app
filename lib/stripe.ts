import "server-only";
import Stripe from "stripe";

export const getStripe = () => {
  const secretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey, { maxNetworkRetries: 4 });
};