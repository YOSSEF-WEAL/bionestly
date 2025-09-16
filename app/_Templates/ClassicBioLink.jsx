"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import * as LucideIcons from "lucide-react";
import ActionsButtons from "./ActionsButtons";
import Footer from "./Footer";
import { addClick } from "../_services/actionLinks";

function toPascalCase(str) {
  return str
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");
}

function SocialLinks({ social_links }) {
  return (
    <div className="w-full flex flex-row justify-center gap-2 mt-5 pb-4 border-b-2 border-gray-200">
      {social_links?.map((social, idx) => {
        const iconName = social.platforms.icon_name_lucide;
        const Icon = LucideIcons[toPascalCase(iconName)] || LucideIcons.Globe;

        return (
          <a
            key={idx}
            href={social.url_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-2 w-fit rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <Icon size={25} />
          </a>
        );
      })}
    </div>
  );
}

// مكون للتعامل مع الرابط الفردي
function LinkItem({ link, profileId }) {
  const handleClick = () => {
    // فتح الرابط فوراً
    window.open(link.url, "_blank", "noopener,noreferrer");

    // تسجيل النقرة في الخلفية (لا ننتظر النتيجة)
    addClick(link.id, profileId).catch((error) => {
      console.error("خطأ في تسجيل النقرة:", error);
    });
  };

  return (
    <div
      style={{ order: link?.order }}
      className="hover:shadow-lg transition border-2 border-gray-400/20 rounded-full overflow-hidden bg-white py-2 cursor-pointer"
      onClick={handleClick}
    >
      <div className="px-3 py-1 flex flex-row items-center gap-2">
        {link.image_url && (
          <img
            src={link.image_url}
            alt={link.title}
            className="w-15 h-15 object-cover rounded-full"
          />
        )}
        <div className="text-base font-medium line-clamp-1">{link.title}</div>
      </div>
    </div>
  );
}

function ClassicBioLink({ data }) {
  const { profile, links, social_links } = data;

  return (
    <div className="w-full md:max-w-[500px] mb-10 mx-auto md:rounded-2xl overflow-hidden flex flex-col items-center bg-gray-50 relative -mt-2 md:mt-5">
      <ActionsButtons username={profile.username} />

      {/* Cover */}
      <div
        className="w-full h-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.caver_url})` }}
      />

      {/* Avatar + Info */}
      <div className="flex flex-col items-center -mt-12 px-4">
        <Avatar className="w-40 h-40 border-4 border-white shadow-md">
          <AvatarImage
            className="object-cover"
            src={profile.avatar_url}
            alt={profile.display_name}
          />
          <AvatarFallback className="text-2xl">
            {profile.display_name?.[0] || "AV"}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-4 text-2xl font-bold">{profile.display_name}</h1>
        <p className="text-gray-600">{profile.bio}</p>
      </div>

      {/* Social Links */}
      <SocialLinks social_links={social_links} />

      {/* Links */}
      <div className="w-full max-w-md px-4 mt-4 pb-5 flex flex-col gap-4">
        {links?.map((link) => (
          <LinkItem key={link.id} link={link} profileId={profile.id} />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default ClassicBioLink;
