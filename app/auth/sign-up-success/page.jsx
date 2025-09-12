import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-start justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">شكرًا لانضمامك!</CardTitle>
              <CardDescription>
                تم إنشاء حسابك بنجاح
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدء في استخدام المنصة.
                </p>
                <p className="text-xs text-muted-foreground">
                  إذا كان تأكيد البريد الإلكتروني مفعلاً، يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.
                </p>
                <div className="flex gap-2">
                  <Link href="/auth/login" className="flex-1">
                    <Button className="w-full">
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      الصفحة الرئيسية
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
