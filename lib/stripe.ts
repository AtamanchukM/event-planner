import Stripe from "stripe";

// Use account default API version to avoid invalid version errors.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
