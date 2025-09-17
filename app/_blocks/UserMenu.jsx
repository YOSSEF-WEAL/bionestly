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
import { logout } from "@/app/_services/actions";

export default function UserMenu({ user, mobile = false, onAction }) {
  console.log("🚀 ~ UserMenu ~ user:", user);
  const [open, setOpen] = React.useState(false);

  // Define a placeholder image URL
  const placeholderAvatar =
    "https://ajxeqiiumzuqfljbkhln.supabase.co/storage/v1/object/public/app%20images/user_Placeholder.png";
  const closeAll = () => {
    setOpen(false);
    onAction?.();
  };

  const onLogout = async () => {
    try {
      await logout();
      closeAll();
      // The server action will handle the redirect to home page
    } catch (error) {
      console.error("Logout error:", error);
      closeAll();
      // Fallback redirect to home page
      window.location.href = "/";
    }
  };

  if (mobile) {
    return (
      <div className="flex items-center gap-3 w-full ">
        <DropdownMenu className="w-full">
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-ring w-full">
            <Image
              src={user?.image || placeholderAvatar}
              alt={user?.name || "User"}
              width={32}
              height={32}
              className="rounded-full border border-border"
            />
            <span className="text-sm font-medium max-w-[160px] truncate">
              {user?.name || ""}
            </span>
            <ChevronDownIcon className="size-5 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel className="flex items-center gap-3">
              <Image
                src={user?.image || placeholderAvatar}
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
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-ring">
        <Image
          // src={
          //   user?.image ||
          //   `https://ui-avatars.com/api/?name=${encodeURIComponent(
          //     user?.name || "User"
          //   )}&background=0D8ABC&color=fff`
          // }
          src={user?.image || placeholderAvatar}
          alt={user?.name || "User"}
          width={32}
          height={32}
          className="rounded-full border border-border"
        />
        <span className="text-sm font-medium max-w-[160px] truncate">
          {user?.name || ""}
        </span>
        <ChevronDownIcon className="size-5 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Image
            // src={
            //   user?.image ||
            //   `https://ui-avatars.com/api/?name=${encodeURIComponent(
            //     user?.name || "User"
            //   )}&background=0D8ABC&color=fff`
            // }
            src={user?.image || placeholderAvatar}
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
