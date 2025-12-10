import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const usePremium = () => {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user && !data.user.premium && !data.user.subscription) {
      router.push("/premium");
    }
  }, [data]);
};
