'use client'
import { useRouter } from "next/navigation";
export default function mainPage() {
  const router = useRouter();
  router.push("/login");
}
