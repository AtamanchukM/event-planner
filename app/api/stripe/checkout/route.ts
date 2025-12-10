import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Premium Access" },
          unit_amount: 500, // $5
        },
        quantity: 1,
      },
    ],
    metadata: { userId: String(session.user.id), type: "premium_one_time" },
    success_url: `${process.env.NEXT_PUBLIC_URL}/premium?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
