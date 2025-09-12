"use client";

import { cn } from "@/lib/utils";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export function SignUpForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });
      
      if (error) throw error;
      
      // If user is immediately confirmed (email confirmation disabled)
      if (data.user && !data.user.email_confirmed_at) {
        router.push("/auth/sign-up-success");
      } else if (data.user && data.user.email_confirmed_at) {
        // User is confirmed, redirect to account
        window.location.href = "/account";
      } else {
        router.push("/auth/sign-up-success");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
          <CardDescription>قم بإنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">كلمة المرور</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">تأكيد كلمة المرور</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                تسجيل الدخول
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
              onClick={async () => {
                try {
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
              }}
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
