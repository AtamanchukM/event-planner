"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PremiumResult() {
  const searchParams = useSearchParams();

  const getParam = (key: string) => searchParams.get(key) ?? undefined;

  const successParam = getParam("success");
  const subParam = getParam("sub");
  const canceledParam = getParam("canceled");

  const success = successParam !== undefined;
  const canceled = canceledParam !== undefined;
  const subSuccess = subParam === "success";
  const subCancel = subParam === "cancel";

  let title = "Статус платежу";
  let message = "";
  let isOk = false;

  if (success || subSuccess) {
    title = "Оплату прийнято";
    message = "Дякуємо! Преміум має бути активовано. Перевір дані акаунта.";
    isOk = true;
  } else if (canceled || subCancel) {
    title = "Оплату скасовано";
    message = "Платіж не завершено. Спробуй ще раз, якщо потрібно.";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-sm text-slate-300 mb-6">{message || "Перенаправлено з Stripe."}</p>

        <div className={`rounded-lg p-4 border ${isOk ? "border-emerald-500 bg-emerald-500/10" : "border-amber-400 bg-amber-400/10"}`}>
          <p className="text-sm">
            {isOk
              ? "Якщо преміум ще не відобразився — зачекай кілька секунд, вебхук може йти із затримкою."
              : "Якщо це помилка, повернись і спробуй оплатити знову."}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/events"
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition"
          >
            Повернутись до подій
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          >
            На головну
          </Link>
        </div>
      </div>
    </main>
  );
}