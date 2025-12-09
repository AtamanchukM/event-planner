
import { EventType } from "../types/event";

export function getEventsForDate(events: EventType[], date: Date) {
  return events.filter((ev) => {
    const evDate = new Date(ev.date);
    return (
      evDate.getFullYear() === date.getFullYear() &&
      evDate.getMonth() === date.getMonth() &&
      evDate.getDate() === date.getDate()
    );
  });
}

export function getTileClassName(events: EventType[]) {
  return ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const hasEvent = events.some((ev) => {
        const evDate = new Date(ev.date);
        return (
          evDate.getFullYear() === date.getFullYear() &&
          evDate.getMonth() === date.getMonth() &&
          evDate.getDate() === date.getDate()
        );
      });
      return hasEvent ? "react-calendar__tile--hasEvent" : null;
    }
  };
}
