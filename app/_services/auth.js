import NextAuth from "next-auth";
import { createProfile, ensureSupabaseAuthUser } from "./data-srvices";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request })
    {
      return !!auth?.user;
    },
    async signIn({ user })
    {
      try
      {
        const email = user?.email?.toLowerCase().trim();
        const username = user?.name || email?.split("@")[0] || "";
        const avatar_url = user?.image || null;

        console.log("Sign in attempt for:", email);

        // Run idempotent operations in parallel to avoid race/ordering issues
        const results = await Promise.allSettled([
          ensureSupabaseAuthUser({ email, username, avatar_url }),
          createProfile({ email, username, avatar_url }),
        ]);

        for (const r of results)
        {
          if (r.status === "rejected") console.error("post-signin op failed:", r.reason);
        }

        return true;
      } catch (error)
      {
        console.error("Sign in error:", error);
        // Don't block sign in if profile creation fails
        return true;
      }
    }
  },

  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
