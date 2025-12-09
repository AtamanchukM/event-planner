import React from "react";
import { EventType } from "../types/event";

type Props = {
  events: EventType[];
  onEdit: (ev: EventType) => void;
  onDelete: (id: number) => void;
};

export default function EventList({ events, onEdit, onDelete }: Props) {
  if (events.length === 0)
    return <ul><li className="text-gray-400 italic">Немає подій</li></ul>;
  return (
    <ul className="flex flex-col gap-3">
      {events.map((ev) => (
        <li
          key={ev.id}
          className="border rounded-lg shadow-sm p-4 bg-gray-50 flex flex-col gap-1 relative hover:shadow-md transition"
        >
          <div className="flex items-center gap-2 mb-1">
            <strong className="text-lg text-blue-800">{ev.title}</strong>
            <span className={
              ev.importance === "CRITICAL"
                ? "bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs"
                : ev.importance === "IMPORTANT"
                ? "bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs"
                : "bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs"
            }>
              {ev.importance}
            </span>
          </div>
          {ev.content && <div className="text-gray-700 mb-1">{ev.content}</div>}
          <div className="text-xs text-gray-500 mb-2">{new Date(ev.date).toLocaleString()}</div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(ev)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              Редагувати
            </button>
            <button
              onClick={() => onDelete(ev.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Видалити
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
