"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserIcon,
  BarChart3Icon,
  LogOutIcon,
  ChevronDownIcon,
} from "lucide-react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";

export default function UserMenu({ user, mobile = false, onAction }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const closeAll = () => {
    setOpen(false);
    onAction?.();
  };

  const onLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    closeAll();
    // Force refresh to update the session state
    window.location.href = "/auth/login";
  };

  if (mobile) {
    return (
      <div className="flex items-center gap-3 w-full">
        <Link href="/profile" className="flex-1" onClick={closeAll}>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
          >
            <UserIcon />
            الملف الشخصي
          </Button>
        </Link>
        <Link href="/analytics" className="flex-1" onClick={closeAll}>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
          >
            <BarChart3Icon />
            الإحصائيات
          </Button>
        </Link>
        <Button
          type="button"
          onClick={onLogout}
          className="flex-1 w-full flex items-center gap-2 justify-center"
        >
          <LogOutIcon />
          تسجيل الخروج
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-ring">
        <Image
          src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
          alt={user?.name || "User"}
          width={32}
          height={32}
          className="rounded-full border border-border"
        />
        <span className="text-sm font-medium max-w-[160px] truncate">
          {user?.name || ""}
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Image
            src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
            alt={user?.name || "User"}
            width={36}
            height={36}
            className="rounded-full border border-border"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/account" onClick={closeAll}>
          <DropdownMenuItem className={"w-full flex-row-reverse"}>
            <UserIcon />
            الملف الشخصي
          </DropdownMenuItem>
        </Link>
        <Link href="/analytics" onClick={closeAll}>
          <DropdownMenuItem className={"w-full flex-row-reverse"}>
            <BarChart3Icon />
            الإحصائيات
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem className={"w-full flex-row-reverse"} asChild>
          <Button type="button" variant={"outline"} onClick={onLogout}>
            <LogOutIcon />
            تسجيل الخروج
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
