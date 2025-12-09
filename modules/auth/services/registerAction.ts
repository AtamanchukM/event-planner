"use server";
import { prisma } from "@/lib/prisma/prisma";
import { hash } from "bcryptjs";

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: "Користувач з таким email вже існує" };
    }
    const hashedPassword = await hash(password, 10);
    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    return { success: true, message: "Реєстрація успішна!" };
  } catch (err: unknown) {
    return { success: false, message: "Помилка: " + (err instanceof Error ? err.message : "Невідома помилка") };
  }
}
