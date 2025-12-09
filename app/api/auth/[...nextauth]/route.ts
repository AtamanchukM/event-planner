
import NextAuth, { Session, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma/prisma";
import { compare } from "bcryptjs";

interface Credentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined): Promise<AuthUser | null> {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.password && await compare(credentials.password, user.password)) {
          return { id: String(user.id), email: user.email, name: user.name };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: (() => {
        if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is not set");
        return process.env.GOOGLE_CLIENT_ID;
      })(),
      clientSecret: (() => {
        if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET is not set");
        return process.env.GOOGLE_CLIENT_SECRET;
      })(),
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        (session.user as typeof session.user & { id?: string }).id = token.sub as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
