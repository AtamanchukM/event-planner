import { useState } from "react";
import { EventFormType } from "@/components/events/types/event";

export function useEventForm() {
  const [form, setForm] = useState<EventFormType>({
    id: null,
    title: "",
    content: "",
    date: "",
    importance: "NORMAL",
  });
  return { form, setForm };
}
