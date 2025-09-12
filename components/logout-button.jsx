"use client";

import { logout } from "@/app/_services/actions";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logout();
      // The server action will handle the redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect to home page
      window.location.href = "/";
    }
  };

  return (
    <Button onClick={handleLogout}>
      <LogOutIcon />
      تسجيل الخروج
    </Button>
  );
}
