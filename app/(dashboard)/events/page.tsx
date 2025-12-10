import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserEvents } from "@/modules/events/services/eventActions";
import { EventType } from "@/modules/events/types/event";
import EventsClient from "@/modules/events/components/EventsClient";
import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);
  if (!userId) {
    redirect("/login");
  }

  const events = await getUserEvents(userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const initialEvents: EventType[] = events.map((ev: any) => ({
    ...ev,
    content: ev.content ?? "",
    date:
      typeof ev.date === "string" ? ev.date : new Date(ev.date).toISOString(),
    createdAt:
      typeof ev.createdAt === "string"
        ? ev.createdAt
        : new Date(ev.createdAt).toISOString(),
  }));

  return (
    <EventsClient
      userId={userId}
      initialEvents={initialEvents}
      premium={user?.premium ?? false}
      socks={user?.socks ?? 0}
    />
  );
}
