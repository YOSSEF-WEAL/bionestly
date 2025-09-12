"use client";

import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Force refresh to update the session state
    window.location.href = "/auth/login";
  };

  return (
    <Button onClick={logout}>
      <LogOutIcon />
      تسجيل الخروج
    </Button>
  );
}
