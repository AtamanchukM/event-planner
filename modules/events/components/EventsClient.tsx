"use client";

import { useState } from "react";
import Calendar from "react-calendar";
// @ts-expect-error CSS side-effect import
import "react-calendar/dist/Calendar.css";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  deleteEventWithConfirm,
  startEditEvent,
  submitEvent,
} from "@/modules/events/services/eventHandlers";
import { EventType } from "@/modules/events/types/event";
import EventForm from "@/modules/events/components/EventForm";
import EventList from "@/modules/events/components/EventList";
import EventFilters from "@/modules/events/components/EventFilters";
import {
  getEventsForDate,
  getTileClassName,
} from "@/modules/events/services/calendarUtils";
import { filterEvents } from "@/modules/events/services/eventFilters";
import { useEvents } from "@/modules/events/hooks/useEvents";
import { useEventForm } from "@/modules/events/hooks/useEventForm";
import { useFilters } from "@/modules/events/hooks/useFilters";

interface Props {
  userId: number;
  initialEvents: EventType[];
  premium: boolean;
  socks: number;
}

export function EventsClient({ userId, initialEvents, premium, socks }: Props) {
  const router = useRouter();
  const { events, fetchEvents } = useEvents(userId, initialEvents);
  const { form, setForm } = useEventForm();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [message, setMessage] = useState("");
  const [socksQty, setSocksQty] = useState(1);
  const { importanceFilter, setImportanceFilter, search, setSearch } =
    useFilters();

  const premiumActive = premium;
  const premiumLabel = premiumActive ? "Преміум активний" : "Без преміуму";

  async function handleCheckout(url: string) {
    try {
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Помилка ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Несподівана відповідь від сервера");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error("Не отримано URL для оплати");
      }
    } catch (err: any) {
      setMessage(err?.message || "Не вдалося створити сесію оплати");
    }
  }

  async function handleSocksCheckout() {
    try {
      const res = await fetch("/api/stripe/socks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: socksQty }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Помилка ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Несподівана відповідь від сервера");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error("Не отримано URL для оплати");
      }
    } catch (err: any) {
      setMessage(err?.message || "Не вдалося створити сесію оплати");
    }
  }

  const filteredEvents = filterEvents(events, importanceFilter, search);
  const eventsForSelectedDate = getEventsForDate(filteredEvents, selectedDate);
  const tileClassName = getTileClassName(events);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submitEvent(form, userId, setForm, setMessage, fetchEvents);
  }

  function handleEdit(ev: EventType) {
    startEditEvent(ev, setForm);
  }

  async function handleDelete(id: number) {
    await deleteEventWithConfirm(id, setMessage, fetchEvents);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Мої події</h1>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm px-3 py-1 rounded-full border ${
              premiumActive
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                : "border-slate-300 bg-white text-slate-600"
            }`}
          >
            {premiumLabel}
          </span>
          <button
            onClick={() => {
              signOut();
              router.push("/login");
            }}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold"
          >
            Вийти
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
        <div className="flex flex-col items-center ">
          <div className="bg-white rounded-xl shadow p-4 mb-4 w-full">
            <Calendar
              onChange={(date) => setSelectedDate(date as Date)}
              value={selectedDate}
              tileClassName={tileClassName}
              locale="en-US"
            />
          </div>
          <EventFilters
            importanceFilter={importanceFilter}
            setImportanceFilter={setImportanceFilter}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="flex-1 ">
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <b className="block mb-2 text-lg text-blue-600">
              Події на {selectedDate.toLocaleDateString()}:
            </b>
            <EventList
              events={eventsForSelectedDate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <EventForm form={form} setForm={setForm} onSubmit={handleSubmit} />
            {message && <p className="text-green-600 mt-2">{message}</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <b className="block mb-2 text-lg text-blue-600">
            Всі події (фільтр):
          </b>
          <EventList
            events={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          className={`py-2 px-3 border rounded transition-all cursor-pointer ${
            premiumActive
              ? "border-emerald-400 bg-emerald-100 text-emerald-700 cursor-not-allowed"
              : "border-green-600 bg-green-400 text-white hover:bg-green-500"
          }`}
          disabled={premiumActive}
          onClick={() => handleCheckout("/api/stripe/checkout")}
        >
          {premiumActive ? "Преміум активний" : "Разовий платіж ($5)"}
        </button>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={50}
            value={socksQty}
            onChange={(e) => setSocksQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-20 border rounded px-2 py-1"
          />
          <button
            className={`py-2 px-3 border rounded transition-all cursor-pointer ${
              "border-blue-600 bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleSocksCheckout}
          >
            {"Купити шкарпетки"}
          </button>
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-600">Куплено шкарпеток: {socks}</div>
    </main>
  );
}

export default EventsClient;
