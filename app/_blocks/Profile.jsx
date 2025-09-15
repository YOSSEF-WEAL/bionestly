"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MessageCircleIcon,
  ArrowUpLeft,
  XIcon,
} from "lucide-react";
import {
  updateProfile,
  upsertSocialLink,
  deleteSocialLink,
} from "@/app/_services/actionsProfile";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProfileImageUploader from "@/components/myUI/ProfileImageUploader";
import Link from "next/link";
import SelectPlatforms from "./SelectPlatforms";
import {
  getPlatforms,
  getSocialLinksById,
} from "@/app/_services/data-services";
import * as LucideIcons from "lucide-react";

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function Profile({ profileData }) {
  const [formData, setFormData] = useState({
    display_name: profileData?.display_name || "",
    bio: profileData?.bio || "",
    facebook_url: profileData?.facebook_url || "",
    instagram_url: profileData?.instagram_url || "",
    twitter_url: profileData?.twitter_url || "",
    whatsapp_url: profileData?.whatsapp_url || "",
    avatar_url: profileData?.avatar_url || "",
    caver_url: profileData?.caver_url || "",
    username: profileData?.username || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [platformsData, setPlatformsData] = useState([]);

  // جلب البيانات الأولية
  useEffect(() => {
    const fetchData = async () => {
      // جلب المنصات
      const platforms = await getPlatforms();
      setPlatformsData(platforms);

      // جبل الروابط الاجتماعية الحالية
      if (profileData?.id) {
        const links = await getSocialLinksById(profileData.id);
        setSocialLinks(links);
      }
    };

    fetchData();
  }, [profileData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error("فشل في تحديث البيانات: " + result.error);
      } else {
        toast.success("تم تحديث البيانات بنجاح");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      display_name: profileData?.display_name || "",
      bio: profileData?.bio || "",
      facebook_url: profileData?.facebook_url || "",
      instagram_url: profileData?.instagram_url || "",
      twitter_url: profileData?.twitter_url || "",
      whatsapp_url: profileData?.whatsapp_url || "",
      avatar_url: profileData?.avatar_url || "",
      caver_url: profileData?.caver_url || "",
      username: profileData?.username ?? "",
    });
    setIsEditing(false);
  };

  // دالة إضافة منصة جديدة
  const handlePlatformSelect = (platform) => {
    // التحقق إذا كانت المنصة مضافه already
    if (!socialLinks.some((link) => link.platform === platform.id)) {
      setSocialLinks((prev) => [
        ...prev,
        {
          platform: platform.id,
          url_link: "",
          isNew: true, // علامة أن هذا رابط جديد لم يحفظ بعد
        },
      ]);
    }
  };

  // دالة تغيير رابط
  const handleSocialLinkChange = async (platformId, url) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.platform === platformId ? { ...link, url_link: url } : link
      )
    );

    // حفظ تلقائي عند التغيير
    if (url.trim() !== "") {
      setIsSaving(true);
      const result = await upsertSocialLink(profileData.id, platformId, url);
      if (result?.error) {
        toast.error("فشل في حفظ الرابط: " + result.error);
      } else {
        // تحديث الـ id إذا كان رابط جديد
        if (result.link) {
          setSocialLinks((prev) =>
            prev.map((link) =>
              link.platform === platformId
                ? { ...link, id: result.link.id, isNew: false }
                : link
            )
          );
        }
      }
      setIsSaving(false);
    }
  };

  // دالة إزالة رابط
  const handleRemoveSocialLink = async (linkIdOrPlatformId) => {
    // إذا كان رابط موجود في قاعدة البيانات (لديه id)
    if (typeof linkIdOrPlatformId === "number") {
      const result = await deleteSocialLink(linkIdOrPlatformId);
      if (result?.error) {
        toast.error("فشل في حذف الرابط: " + result.error);
        return;
      }
    }

    // إزالة من الواجهة
    setSocialLinks((prev) =>
      prev.filter(
        (link) =>
          link.id !== linkIdOrPlatformId && link.platform !== linkIdOrPlatformId
      )
    );
  };

  // صورة افتراضية
  const placeholderAvatar =
    "https://ajxeqiiumzuqfljbkhln.supabase.co/storage/v1/object/public/app%20images/user_Placeholder.png";

  return (
    <div className="w-full flex flex-col items-end gap-6 mb-5">
      {/* Basic Info */}
      <div className="w-full mt-4">
        <h3 className="w-full text-end mb-2 font-medium text-2xl">
          المعلومات الأساسية
        </h3>

        <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between w-full mt-2">
          <div className="flex md:flex-row flex-col-reverse flex-wrap w-full md:w-[75%] gap-4  items-end justify-end">
            {/* username */}
            <div
              className="flex flex-col w-full max-w-full md:max-w-sm gap-3 bg-white shadow-lg rounded-lg p-3"
              dir="rtl"
            >
              <Label htmlFor="username">الاسم في المتصفح</Label>
              <div className="flex items-center rounded-md border border-input bg-background gap-2">
                <span className="px-2 ml-1 text-sm text-gray-500 h-full border-l-1 border-gray-500/50">
                  bionestly/
                </span>
                <Input
                  id="username"
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="ادخل اسم المستخدم"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={isSaving}
                />
                <Link target="_blank" href={`/${formData.username}`}>
                  <Button>
                    لايف
                    <ArrowUpLeft />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bio */}
            <div
              className="flex flex-col w-full max-w-full md:max-w-sm gap-3 bg-white shadow-lg rounded-lg p-3"
              dir="rtl"
            >
              <Label htmlFor="bio">الوصف</Label>
              <Input
                id="bio"
                placeholder="اكتب الوصف هنا"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={isSaving}
              />
            </div>

            {/* Display Name */}
            <div
              className="flex flex-col w-full max-w-full md:max-w-sm gap-3 bg-white shadow-lg rounded-lg p-3"
              dir="rtl"
            >
              <Label htmlFor="display_name">الاسم</Label>
              <Input
                id="display_name"
                placeholder="اكتب اسمك هنا"
                value={formData.display_name}
                onChange={(e) => handleChange("display_name", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-[40%]">
            {/* Cover */}
            <div className="flex flex-col items-center gap-2 p-3 bg-white shadow-lg rounded-lg w-full">
              <div className="text-center">
                <h1 className="text-base font-bold">صورة الغلاف</h1>
              </div>

              <div className="relative rounded-full w-24 h-24 overflow-hidden">
                <Image
                  alt="cover"
                  src={formData.caver_url || placeholderAvatar}
                  fill
                  className="object-cover transition-all duration-300 hover:scale-110"
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    تغيير صورة
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-right">
                      تغيير صورة الغلاف
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <ProfileImageUploader
                    fieldKey="caver_url"
                    label="رفع صورة جديدة للغلاف"
                    onUploaded={(url) =>
                      setFormData((prev) => ({ ...prev, caver_url: url }))
                    }
                  />
                  <AlertDialogCancel className="mt-4">إغلاق</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Avatar & Email */}
            <div className="flex flex-col items-center gap-2 p-3 bg-white shadow-lg rounded-lg w-full">
              <div className="text-center">
                <h1 className="text-base font-bold">
                  {formData?.display_name}
                </h1>
              </div>

              <div className="relative rounded-full w-24 h-24 overflow-hidden">
                <Image
                  alt="avatar"
                  src={formData.avatar_url || placeholderAvatar}
                  fill
                  className="object-cover transition-all duration-300 hover:scale-110"
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    تغيير الصورة
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-right">
                      تغيير الصورة الشخصية
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <ProfileImageUploader
                    fieldKey="avatar_url"
                    label="رفع صورة شخصية جديدة"
                    onUploaded={(url) =>
                      setFormData((prev) => ({ ...prev, avatar_url: url }))
                    }
                  />
                  <AlertDialogCancel className="mt-4">إغلاق</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      {/* Save / Cancel */}
      {isEditing && (
        <div className="flex justify-end gap-3 mt-4 w-full mb-5">
          <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      )}

      {/* Social Media - الجزء المعدل */}

      <div className="flex flex-col-reverse md:flex-row justify-between gap-4 w-full">
        {/* منصة اختيارية جديدة */}
        <div className=" flex justify-end w-full">
          <SelectPlatforms
            profile_id={profileData.id}
            onPlatformSelect={handlePlatformSelect}
          />
        </div>
      </div>
      <div className="flex w-full justify-between items-center"></div>
    </div>
  );
}

export default Profile;
