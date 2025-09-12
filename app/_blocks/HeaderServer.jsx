import Header from "./Header";
import { createClient } from "@/lib/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HeaderServer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const session = claims
    ? {
        user: {
          name: claims.user_metadata?.full_name || claims.user_metadata?.name,
          email: claims.email,
          image:
            claims.user_metadata?.picture || claims.user_metadata?.avatar_url,
        },
        expires: new Date((claims.exp || 0) * 1000).toISOString(),
      }
    : null;

  return <Header session={session} />;
}
