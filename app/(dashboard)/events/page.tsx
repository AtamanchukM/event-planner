"use client";
import { useState } from "react";
import Calendar from "react-calendar";
// @ts-expect-error CSS side-effect import
import "react-calendar/dist/Calendar.css";
import { signOut } from "next-auth/react";
import {
  submitEvent,
  startEditEvent,
  deleteEventWithConfirm,
} from "@/components/events/services/eventHandlers";
import { EventType } from "@/components/events/types/event";
import EventForm from "@/components/events/components/EventForm";
import EventList from "@/components/events/components/EventList";
import EventFilters from "@/components/events/components/EventFilters";
import {
  getEventsForDate,
  getTileClassName,
} from "@/components/events/services/calendarUtils";
import { filterEvents } from "@/components/events/services/eventFilters";
import { useEvents } from "@/components/events/hooks/useEvents";
import { useEventForm } from "@/components/events/hooks/useEventForm";
import { useFilters } from "@/components/events/hooks/useFilters";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/components/auth/hooks/useRequireAuth";

export default function EventsPage() {
  const router = useRouter();
  const { session, status, userId } = useRequireAuth();
  const { events, fetchEvents } = useEvents(userId);
  const { form, setForm } = useEventForm();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [message, setMessage] = useState("");
  const { importanceFilter, setImportanceFilter, search, setSearch } =
    useFilters();

  if (status === "loading" || !session) return null;

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
    </main>
  );
}
