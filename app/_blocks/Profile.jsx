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
import { updateSocialMedia } from "@/app/_services/actionsProfile";

function Profile({ profileData }) {
  const [formData, setFormData] = React.useState({
    facebook_url: profileData?.facebook_url || "",
    instagram_url: profileData?.instagram_url || "",
    twitter_url: profileData?.twitter_url || "",
    whatsapp_url: profileData?.whatsapp_url || "",
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Define social media platforms with their icons and labels
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
      const result = await updateSocialMedia(formData);
      if (result?.error) {
        toast.error("فشل في تحديث الروابط: " + result.error);
      } else {
        toast.success("تم تحديث روابط السوشيال بنجاح");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating social media:", error);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      facebook_url: profileData?.facebook_url || "",
      instagram_url: profileData?.instagram_url || "",
      twitter_url: profileData?.twitter_url || "",
      whatsapp_url: profileData?.whatsapp_url || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-end gap-6">
      {/* Profile header */}
      <div className="flex items-center justify-end gap-4 p-3 bg-white shadow-lg rounded-lg w-full md:w-fit mt-2">
        <div className="">
          <h1 className="text-2xl font-bold text-end">
            {profileData?.display_name}
          </h1>
          <p className="text-end">{profileData?.email}</p>
        </div>
        <div className="w-fit">
          <Image
            alt="avatar"
            src={profileData?.avatar_url}
            width={80}
            height={80}
            className="rounded-full transition-all duration-300 hover:scale-110"
          />
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
