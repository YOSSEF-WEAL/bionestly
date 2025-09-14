"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "../_blocks/Profile";
import Links from "../_blocks/Links";
import Templates from "../_blocks/Templates";
import {
  ChartColumn,
  LayoutPanelTop,
  Link as LinkIcon,
  User,
} from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function AccountPage() {
  const [accountData, setAccountData] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/account", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل في جلب البيانات");
      }
      const data = await response.json();
      if (!data || !data.user) {
        throw new Error(
          "لم يتم العثور على المستخدم. يرجى تسجيل الدخول مرة أخرى."
        );
      }
      setAccountData(data);
      setTemplates(data.templates);
      setLoading(false);
    } catch (e) {
      setError(e.message || "حدث خطأ أثناء جلب البيانات.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!accountData || !accountData.profile) {
    return (
      <div className="text-center mt-10">
        <h1>جاري إعداد حسابك...</h1>
        <p>إذا استمرت هذه الرسالة، يرجى تحديث الصفحة.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center px-4">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className={"w-full"}>
          <TabsTrigger value="analytics">
            <span className="hidden md:block">احصائيات</span>
            <ChartColumn />
          </TabsTrigger>
          <TabsTrigger value="templates">
            <span className="hidden md:block">القالب</span>
            <LayoutPanelTop />
          </TabsTrigger>
          <TabsTrigger value="links">
            <span className="hidden md:block">الروابط</span>
            <LinkIcon />
          </TabsTrigger>
          <TabsTrigger value="account">
            <span className="hidden md:block">الملف الشخصي</span>
            <User />
          </TabsTrigger>
        </TabsList>

        <TabsContent className={"w-full"} value="account">
          <Profile profileData={accountData.profile} />
        </TabsContent>
        <TabsContent className={"w-full"} value="links">
          <Links linksData={accountData.links} onRefresh={fetchAccountData} />
        </TabsContent>
        <TabsContent className={"w-full"} value="analytics">
          احصائيات
        </TabsContent>
        <TabsContent className={"w-full"} value="templates">
          <Templates
            templatesData={templates}
            myTemplate={accountData.profile?.template}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
