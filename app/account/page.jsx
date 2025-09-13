import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getProfileWithLinksByEmail,
  getTemplates,
} from "@/app/_services/data-services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "../_blocks/Profile";
import { ChartColumn, LayoutPanelTop, Link, User } from "lucide-react";
import Links from "../_blocks/Links";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Get profile and links data using the user's email
  const userEmail = data.claims.email;
  const profileData = await getProfileWithLinksByEmail(userEmail);

  // Get all available templates
  const templates = await getTemplates();

  // console.log("🚀 ~ ProtectedPage ~ templates data:", templates);

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
            <span className="hidden md:block">اللينكات</span>
            <Link />
          </TabsTrigger>
          <TabsTrigger value="account">
            <span className="hidden md:block">الملف الشخصي</span>

            <User />
          </TabsTrigger>
        </TabsList>
        <TabsContent className={"w-full"} value="account">
          <Profile profileData={profileData?.profile} />
        </TabsContent>
        <TabsContent className={"w-full"} value="links">
          <Links linksData={profileData?.links} />
        </TabsContent>
        <TabsContent className={"w-full"} value="analytics">
          analytics
        </TabsContent>
        <TabsContent className={"w-full"} value="templates">
          templates
        </TabsContent>
      </Tabs>
    </div>
  );
}
