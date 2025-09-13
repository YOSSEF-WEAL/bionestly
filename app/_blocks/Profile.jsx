import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MessageCircleIcon,
  MailIcon,
  User,
} from "lucide-react";

function Profile({ profileData }) {
  console.log("🚀 ~ Profile ~ profileData:", profileData);

  // Define social media platforms with their icons and labels
  const socialMediaPlatforms = [
    {
      key: "facebook_url",
      label: "فيسبوك",
      icon: FacebookIcon,
      value: profileData?.facebook_url,
      type: "url",
      placeholder: "رابط فيسبوك",
    },
    {
      key: "instagram_url",
      label: "إنستغرام",
      icon: InstagramIcon,
      value: profileData?.instagram_url,
      type: "url",
      placeholder: "رابط إنستغرام",
    },
    {
      key: "twitter_url",
      label: "تويتر",
      icon: TwitterIcon,
      value: profileData?.twitter_url,
      type: "url",
      placeholder: "رابط تويتر",
    },
    {
      key: "whatsapp_url",
      label: "واتساب",
      icon: MessageCircleIcon,
      value: profileData?.whatsapp_url,
      type: "url",
      placeholder: " رقم الموبايل عليه واتساب مع كود الدوله",
    },
  ];

  return (
    <div className="w-full flex flex-col items-end gap-6">
      <div className="flex items-center justify-end gap-4 p-3 bg-white shadow-lg rounded-lg w-full md:w-fit mt-2">
        <div className="">
          <h1 className="text-2xl font-bold  text-end">
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
      <div className="flex justify-end gap-3 flex-row flex-wrap w-full">
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
                type={platform.type}
                id={platform.key}
                placeholder={platform.placeholder}
                defaultValue={platform.value || ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
