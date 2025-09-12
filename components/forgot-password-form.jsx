"use client";

import { cn } from "@/lib/utils";
import { resetPasswordForEmail } from "@/app/_services/actions";
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

export function ForgotPasswordForm({ className, ...props }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [state, formAction, isPending] = useActionState(resetPasswordForEmail, null);

  // Check for server action results
  React.useEffect(() => {
    if (state?.error) {
      setError(state.error);
    } else if (state?.success) {
      setSuccess(true);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">تحقق من بريدك الإلكتروني</CardTitle>
            <CardDescription>
              تم إرسال تعليمات إعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              إذا قمت بالتسجيل باستخدام بريدك الإلكتروني وكلمة مرور، ستصلك رسالة
              لإعادة تعيين كلمة المرور.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
            <CardDescription>
              اكتب بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
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
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "جاري الإرسال..." : "إرسال بريد إعادة التعيين"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                هل لديك حساب بالفعل؟{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
