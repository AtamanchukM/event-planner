export type Importance = "NORMAL" | "IMPORTANT" | "CRITICAL";

export type EventType = {
  id: number;
  title: string;
  content: string;
  date: string;
  importance: Importance;
  authorId: number;
  createdAt: string;
};

export type EventFormType = {
  id: number | null;
  title: string;
  content: string;
  date: string;
  importance: Importance;
};
