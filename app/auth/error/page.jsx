import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({ searchParams }) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-start justify-center p-6 md:p-10 ">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">عذرًا، حدث خطأ ما.</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  رمز الخطأ: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  حدث خطأ غير محدد.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
