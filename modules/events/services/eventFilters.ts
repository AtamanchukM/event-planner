import { EventType } from "../types/event";
import { Importance } from "../types/event";

export function filterEvents(
  events: EventType[],
  importanceFilter: Importance | "ALL",
  search: string
) {
  const normalizedSearch = search.trim().toLowerCase();
  return events.filter((ev) => {
    const matchesImportance =
      importanceFilter === "ALL" || ev.importance === importanceFilter;
    const matchesSearch =
      normalizedSearch === "" ||
      ev.title.toLowerCase().includes(normalizedSearch) ||
      (ev.content && ev.content.toLowerCase().includes(normalizedSearch));
    return matchesImportance && matchesSearch;
  });
}
