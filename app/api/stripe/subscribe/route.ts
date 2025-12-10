import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 500 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // monthly subscription price id
        quantity: 1,
      },
    ],
    metadata: { userId: String(session.user.id) },
    success_url: `${process.env.NEXT_PUBLIC_URL}/premium?sub=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium?sub=cancel`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
