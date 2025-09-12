import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
  console.log("🚀 ~ ProtectedPage ~ data:", data);

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <Button>
        <Avatar>
          <AvatarImage src={data.claims.user_metadata.avatar_url} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span>{data.claims.user_metadata.name}</span>
      </Button>
      <LogoutButton />
    </div>
  );
}
