import { Dispatch, SetStateAction } from "react";
import { createEvent, updateEvent, deleteEvent } from "./eventActions";
import { EventFormType, EventType } from "../types/event";

export async function submitEvent(
  form: EventFormType,
  userId: number | undefined,
  setForm: Dispatch<SetStateAction<EventFormType>>,
  setMessage: Dispatch<SetStateAction<string>>,
  fetchEvents: () => Promise<void>
) {
  if (!userId) return;

  if (form.id) {
    await updateEvent(form.id, {
      title: form.title,
      content: form.content,
      date: form.date,
      importance: form.importance,
    });
    setMessage("Подію оновлено!");
  } else {
    await createEvent({
      title: form.title,
      content: form.content,
      date: new Date(form.date),
      importance: form.importance,
      authorId: userId,
    });
    setMessage("Подію додано!");
  }

  setForm({
    id: null,
    title: "",
    content: "",
    date: "",
    importance: "NORMAL",
  });

  await fetchEvents();
}

export function startEditEvent(
  ev: EventType,
  setForm: Dispatch<SetStateAction<EventFormType>>
) {
  setForm({
    id: ev.id,
    title: ev.title,
    content: ev.content || "",
    date: new Date(ev.date).toISOString().slice(0, 16),
    importance: ev.importance,
  });
}

export async function deleteEventWithConfirm(
  id: number,
  setMessage: Dispatch<SetStateAction<string>>,
  fetchEvents: () => Promise<void>
) {
  if (!confirm("Видалити подію?")) return;
  await deleteEvent(id);
  setMessage("Подію видалено!");
  await fetchEvents();
}
