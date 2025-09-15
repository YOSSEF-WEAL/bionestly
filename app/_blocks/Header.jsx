"use client";

import { Button } from "@/components/ui/button";
import { LogInIcon, UserPlusIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserMenu from "./UserMenu";

function Header({ session }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="h-22 header" />
      <header className="bg-secondary/20 backdrop-blur-lg shadow-md py-3 fixed top-0 left-0 w-full z-9 header">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full justify-between">
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <XIcon /> : <MenuIcon />}
              </button>
              <Link href="/" className="inline-flex items-center gap-2">
                {/* <Image src="/logo.svg" alt="Logo" width={28} height={28} /> */}
                <h1 className="text-lg font-semibold text-foreground">
                  BioNestly
                </h1>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">
                الرئيسية
              </Link>
              <Link
                href="/features"
                className="hover:text-primary transition-colors"
              >
                المميزات
              </Link>
              <Link
                href="/pricing"
                className="hover:text-primary transition-colors"
              >
                الأسعار
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                تواصل
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {session?.user ? (
                <UserMenu user={session.user} />
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">
                      <LogInIcon />
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button>
                      <UserPlusIcon />
                      إنشاء حساب
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {open && (
            <div className="md:hidden mt-3 rounded-md border border-border bg-background shadow-sm">
              <nav className="flex flex-col divide-y">
                <Link
                  href="/"
                  className="px-4 py-3 hover:bg-accent/20"
                  onClick={() => setOpen(false)}
                >
                  الرئيسية
                </Link>
                <Link
                  href="/features"
                  className="px-4 py-3 hover:bg-accent/20"
                  onClick={() => setOpen(false)}
                >
                  المميزات
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-3 hover:bg-accent/20"
                  onClick={() => setOpen(false)}
                >
                  الأسعار
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-3 hover:bg-accent/20"
                  onClick={() => setOpen(false)}
                >
                  تواصل
                </Link>
                <div className="px-4 py-3 flex items-center gap-3">
                  {session?.user ? (
                    <UserMenu
                      user={session.user}
                      mobile
                      onAction={() => setOpen(false)}
                    />
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="flex-1"
                        onClick={() => setOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          <LogInIcon />
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="flex-1"
                        onClick={() => setOpen(false)}
                      >
                        <Button className="w-full">
                          <UserPlusIcon />
                          إنشاء حساب
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
