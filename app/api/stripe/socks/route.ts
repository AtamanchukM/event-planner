import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_PRICE_SOKCS) {
    return NextResponse.json({ error: "Missing STRIPE_PRICE_SOKCS" }, { status: 500 });
  }

  let quantity = 1;
  try {
    const body = await req.json();
    const q = Number(body?.quantity);
    if (Number.isFinite(q) && q > 0 && q <= 50) {
      quantity = Math.floor(q);
    }
  } catch (_) {
    // ignore malformed body; default quantity stays 1
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_SOKCS,
        quantity,
      },
    ],
    metadata: { userId: String(session.user.id), type: "socks", quantity: String(quantity) },
    success_url: `${process.env.NEXT_PUBLIC_URL}/premium?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
