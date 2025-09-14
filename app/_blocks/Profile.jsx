"use client";

import React from "react";
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
} from "lucide-react";
import { updateProfile } from "@/app/_services/actionsProfile";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProfileImageUploader from "@/components/myUI/ProfileImageUploader";

function Profile({ profileData }) {
  console.log("🚀 ~ Profile ~ profileData:", profileData);
  const [formData, setFormData] = React.useState({
    display_name: profileData?.display_name || "",
    bio: profileData?.bio || "",
    facebook_url: profileData?.facebook_url || "",
    instagram_url: profileData?.instagram_url || "",
    twitter_url: profileData?.twitter_url || "",
    whatsapp_url: profileData?.whatsapp_url || "",
    avatar_url: profileData?.avatar_url || "",
    caver_url: profileData?.caver_url || "",
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const socialMediaPlatforms = [
    {
      key: "facebook_url",
      label: "فيسبوك",
      icon: FacebookIcon,
      placeholder: "رابط فيسبوك",
    },
    {
      key: "instagram_url",
      label: "إنستغرام",
      icon: InstagramIcon,
      placeholder: "رابط إنستغرام",
    },
    {
      key: "twitter_url",
      label: "تويتر",
      icon: TwitterIcon,
      placeholder: "رابط تويتر",
    },
    {
      key: "whatsapp_url",
      label: "واتساب",
      icon: MessageCircleIcon,
      placeholder: "رقم الموبايل مع كود الدولة",
    },
  ];

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
          <div className="flex flex-row flex-wrap w-full md:w-[75%] gap-4  items-end justify-end">
            {/* username */}
            <div
              className="flex flex-col w-full max-w-full md:max-w-sm gap-3 bg-white shadow-lg rounded-lg p-3"
              dir="rtl"
            >
              <Label htmlFor="username">الاسم في المتصفح</Label>
              <div className="flex items-center rounded-md border border-input bg-background">
                <span className="px-3 text-sm text-gray-500 border-r">
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
      {/* Social Media */}
      <div className="flex flex-row flex-wrap justify-end gap-4 w-full">
        <h3 className="w-full text-end mb-2 font-medium text-2xl">
          مواقع التواصل الاجتماعي
        </h3>
        {socialMediaPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <div
              key={platform.key}
              className="flex flex-col w-full max-w-full md:max-w-sm gap-3 bg-white shadow-lg rounded-lg p-3"
              dir="rtl"
            >
              <Label htmlFor={platform.key} className="flex items-center gap-2">
                <IconComponent size={20} />
                {platform.label}
              </Label>
              <Input
                type="url"
                id={platform.key}
                placeholder={platform.placeholder}
                value={formData[platform.key]}
                onChange={(e) => handleChange(platform.key, e.target.value)}
                disabled={isSaving}
              />
            </div>
          );
        })}
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
    </div>
  );
}

export default Profile;
