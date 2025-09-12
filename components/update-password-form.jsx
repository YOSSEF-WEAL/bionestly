"use client";

import { cn } from "@/lib/utils";
import { updateUserPassword } from "@/app/_services/actions";
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
import { useState, useActionState } from "react";
import React from "react";

export function UpdatePasswordForm({ className, ...props }) {
  const [error, setError] = useState(null);
  const [state, formAction, isPending] = useActionState(updateUserPassword, null);

  // Check for server action errors
  React.useEffect(() => {
    if (state?.error) {
      setError(state.error);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription>
            يرجى إدخال كلمة المرور الجديدة أدناه.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور الجديدة</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
