import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface SessionUser {
  id?: number;
  name?: string | null;
  email?: string | null;
}

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  const userId: number | undefined = (session?.user as SessionUser | undefined)?.id;
  return { session, status, userId };
}
