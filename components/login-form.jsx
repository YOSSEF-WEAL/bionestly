"use client";

import { cn } from "@/lib/utils";
import { signInWithPassword } from "@/app/_services/actions";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useActionState } from "react";
import React from "react";
import Image from "next/image";

export function LoginForm({ className, ...props }) {
  const [error, setError] = useState(null);
  const [state, formAction, isPending] = useActionState(signInWithPassword, null);

  // Check for OAuth errors in URL and server action errors
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setError(`خطأ OAuth: ${decodeURIComponent(errorParam)}`);
    }
    
    if (state?.error) {
      setError(state.error);
    }
  }, [state]);

  const handleOAuthLogin = async () => {
    try {
      setError(null);
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/account`,
        },
      });
      
      if (error) {
        console.error("OAuth error:", error);
        setError("فشل في تسجيل الدخول بـ Google: " + error.message);
      }
    } catch (err) {
      console.error("OAuth catch error:", err);
      setError("حدث خطأ أثناء تسجيل الدخول بـ Google");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    هل نسيت كلمة المرور؟
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ليس لديك حساب؟{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                إنشاء حساب
              </Link>
            </div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  أو المتابعة عبر
                </span>
              </div>
            </div>

            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={handleOAuthLogin}
            >
              <Image
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google logo"
                height={18}
                width={18}
              />
              <span>المتابعة باستخدام Google</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
