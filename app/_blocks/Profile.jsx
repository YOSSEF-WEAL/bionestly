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

function Profile({ profileData }) {
  const [formData, setFormData] = React.useState({
    display_name: profileData?.display_name || "",
    bio: profileData?.bio || "",
    facebook_url: profileData?.facebook_url || "",
    instagram_url: profileData?.instagram_url || "",
    twitter_url: profileData?.twitter_url || "",
    whatsapp_url: profileData?.whatsapp_url || "",
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Define social media platforms
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
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-end gap-6">
      {/* Basic Info section */}
      <div className="w-full">
        <h3 className="w-full text-end mb-2 font-medium text-2xl">
          المعلومات الأساسية
        </h3>
        <div className="flex gap-4 items-center justify-between w-full mt-2">
          <div className="flex w-full md:w-[75%] gap-4 flex-row items-end justify-end">
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
          {/* Avatar & Email */}
          <div className="flex items-center justify-end gap-4 p-3 bg-white shadow-lg rounded-lg w-full md:w-fit">
            <div>
              <h1 className="text-2xl font-bold text-end">
                {profileData?.display_name}
              </h1>
              <p className="text-end">{profileData?.email}</p>
            </div>
            <div className="relative rounded-full w-20 h-20 overflow-hidden">
              <Image
                alt="avatar"
                src={profileData?.avatar_url}
                fill
                className=" transition-all duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media section */}
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

      {/* Save / Cancel buttons */}
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
