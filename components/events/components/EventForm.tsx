import React from "react";
import { EventFormType, Importance } from "../types/event";

type Props = {
  form: EventFormType;
  setForm: React.Dispatch<React.SetStateAction<EventFormType>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function EventForm({ form, setForm, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Назва"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        required
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="datetime-local"
        value={form.date}
        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        required
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="Опис"
        value={form.content}
        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <select
        value={form.importance}
        onChange={(e) => setForm((f) => ({ ...f, importance: e.target.value as Importance }))}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="NORMAL">Звичайна</option>
        <option value="IMPORTANT">Важлива</option>
        <option value="CRITICAL">Критична</option>
      </select>
      <button
        type="submit"
        className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
      >
        {form.id ? "Оновити" : "Додати"}
      </button>
    </form>
  );
}
