"use server";
import { prisma } from "@/lib/prisma/prisma";

interface EventData {
  title: string;
  content: string;
  date: string | Date;
  importance: "NORMAL" | "IMPORTANT" | "CRITICAL";
  authorId: number;
}
// Створити подію
export async function createEvent({ title, content, date, importance, authorId }: EventData) {
  return await prisma.event.create({
    data: { title, content, date, importance, authorId: Number(authorId) },
  });
}

// Отримати всі події користувача
export async function getUserEvents(userId: number) {
  if (!userId) throw new Error("Not authenticated");
  return prisma.event.findMany({
    where: { authorId: Number(userId) }
  });
}

// Оновити подію
export async function updateEvent(
  id: number,
  data: {
    title: string;
    content: string;
    date: string | Date;
    importance: "NORMAL" | "IMPORTANT" | "CRITICAL";
  }
) {
  // Переконаємось, що date у форматі Date
  const updateData = {
    ...data,
    date: typeof data.date === "string" ? new Date(data.date) : data.date,
  };
  return await prisma.event.update({
    where: { id },
    data: updateData,
  });
}

// Видалити подію
export async function deleteEvent(id: number) {
  return await prisma.event.delete({
    where: { id },
  });
}

