"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithCredentials } from "@/components/auth/services/loginService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await loginWithCredentials(email, password);
    if (!res.success) {
      setMessage("Невірний email або пароль");
      return;
    }
    setMessage("");
    router.push("/events");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl border border-white/10 shadow-2xl p-8 text-white">
        <h1 className="text-2xl font-semibold mb-2">Вхід</h1>
        <p className="text-sm text-slate-200 mb-6">Увійди, щоб керувати подіями.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="name@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-200">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-2.5 transition shadow-lg shadow-emerald-500/20"
          >
            Увійти
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        <div className="mt-6 text-sm text-slate-200">
          Немає акаунту?{" "}
          <Link href="/register" className="text-emerald-300 hover:text-emerald-200 font-semibold">
            Зареєструватися
          </Link>
        </div>
      </div>
    </main>
  );
}
