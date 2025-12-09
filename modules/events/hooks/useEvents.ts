import { useState, useEffect } from "react";
import { EventType } from "@/modules/events/types/event";
import { getUserEvents } from "../services/eventActions";

export function useEvents(userId: number | undefined) {
  const [events, setEvents] = useState<EventType[]>([]);

  async function fetchEvents() {
    if (!userId) return;
    const data = await getUserEvents(userId);
    setEvents(
      data.map((ev: any) => ({
        ...ev,
        content: ev.content ?? "",
        date:
          typeof ev.date === "string"
            ? ev.date
            : new Date(ev.date).toISOString(),
        createdAt:
          typeof ev.createdAt === "string"
            ? ev.createdAt
            : new Date(ev.createdAt).toISOString(),
      }))
    );
  }

  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
    // eslint-disable-next-line
  }, [userId]);

  return { events, setEvents, fetchEvents };
}
