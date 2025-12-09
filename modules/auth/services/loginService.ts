import { signIn } from "next-auth/react";

export async function loginWithCredentials(email: string, password: string) {
  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (res?.error) {
    return { success: false, error: res.error };
  }

  return { success: true };
}
