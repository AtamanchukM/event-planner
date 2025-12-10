import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PaymentType } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse("Webhook error", { status: 400 });
  }

  const resolveUserId = async (
    metadataUserId?: string,
    email?: string,
    customerId?: string
  ): Promise<number | null> => {
    if (metadataUserId) return Number(metadataUserId);

    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) return user.id;
    }

    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      const customerEmail = (customer as any).email as string | undefined;
      if (customerEmail) {
        const user = await prisma.user.findUnique({ where: { email: customerEmail } });
        if (user) return user.id;
      }
    }

    return null;
  };

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    const email = session.customer_details?.email as string | undefined;
    const customerId = session.customer as string | undefined;
    const userId = await resolveUserId(session.metadata?.userId, email, customerId);
    const purchaseType = session.metadata?.type as string | undefined;
    const quantity = session.metadata?.quantity
      ? Number(session.metadata.quantity)
      : undefined;

    if (userId) {
      if (purchaseType !== "socks") {
        await prisma.user.update({
          where: { id: userId },
          data: { premium: true, stripeId: customerId ?? undefined },
        });
      } else if (quantity) {
        await prisma.user.update({
          where: { id: userId },
          data: { socks: { increment: quantity } },
        });
      }

      await prisma.payment.create({
        data: {
          userId,
          type: PaymentType.ONE_TIME,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          stripeSessionId: session.id,
          stripeCustomerId: customerId,
          status: session.payment_status ?? "unknown",
          // store quantity for socks purchases
          ...(quantity ? { quantity } : {}),
        },
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice: any = event.data.object;
    const customerId = invoice.customer as string | undefined;
    const email = invoice.customer_email as string | undefined;
    const userId = await resolveUserId(invoice.metadata?.userId, email, customerId);

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { premium: true, stripeId: customerId ?? undefined },
      });

      await prisma.payment.create({
        data: {
          userId,
          type: PaymentType.SUBSCRIPTION,
          amount: invoice.amount_paid ?? 0,
          currency: invoice.currency ?? "usd",
          stripeInvoiceId: invoice.id,
          stripeCustomerId: customerId,
          status: invoice.status ?? "succeeded",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
