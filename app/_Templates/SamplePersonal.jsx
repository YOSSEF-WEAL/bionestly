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
    <div className="w-full px-4 pb-5 flex flex-row justify-center flex-wrap gap-4">
      {social_links?.map((social, idx) => {
        const iconName = social.platforms.icon_name_lucide;
        const Icon = LucideIcons[toPascalCase(iconName)] || LucideIcons.Globe;
        const name = social?.platforms?.name;

        return (
          <a
            key={idx}
            href={social.url_link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:shadow-lg transition border-2 border-gray-400/20 rounded-sm overflow-hidden bg-gray-400/20 backdrop-blur-2xl cursor-pointer w-[45%] md:w-[48%] flex flex-col items-center justify-center py-5"
          >
            <Icon size={40} className="text-white" />
            <div className="text-base text-center font-normal line-clamp-1 text-white">
              {name}
            </div>
          </a>
        );
      })}
    </div>
  );
}

function LinkItem({ link, profileId }) {
  const handleClick = () => {
    window.open(link.url, "_blank", "noopener,noreferrer");

    addClick(link.id, profileId).catch((error) => {
      console.error("خطأ في تسجيل النقرة:", error);
    });
  };

  return (
    <div
      style={{ order: link?.order }}
      className="hover:shadow-lg transition border-2 border-gray-400/20 rounded-sm overflow-hidden bg-gray-400/20 backdrop-blur-2xl py-2 cursor-pointer w-[45%] md:w-[48%]"
      onClick={handleClick}
    >
      <div className="px-3 py-3 flex flex-col justify-center items-center gap-2">
        {link.image_url && (
          <img
            src={link.image_url}
            alt={link.title}
            className="w-18 h-18 object-cover rounded-sm"
          />
        )}
        <div className="text-base text-center font-normal line-clamp-1 text-gray-200">
          {link.title}
        </div>
      </div>
    </div>
  );
}

function SamplePersonal({ data }) {
  const { profile, links, social_links } = data;

  return (
    <div
      className="w-full md:max-w-[500px] md:mb-10 mx-auto md:rounded-2xl overflow-hidden flex flex-col items-center relative -mt-2 md:mt-5 bg-cover bg-center "
      style={{ backgroundImage: `url(${profile.caver_url})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/35  " />

      <ActionsButtons username={profile.username} />

      {/* Avatar + Info */}
      <div className="flex flex-row items-center mt-20 justify-start px-4 gap-3 w-full z-10">
        <Avatar className="w-25 h-25">
          <AvatarImage
            className="object-cover"
            src={profile.avatar_url}
            alt={profile.display_name}
          />
          <AvatarFallback className="text-2xl">
            {profile.display_name?.[0] || "AV"}
          </AvatarFallback>
        </Avatar>
        <div className="">
          <h1 className=" text-2xl font-bold line-clamp-1 text-gray-100">
            {profile.display_name}
          </h1>
          <p className="text-gray-200 line-clamp-2">{profile.bio}</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="w-full p-2 mt-4 mb-4 text-center z-10">
        <p className="text-[22px] text-gray-200 font-bold">
          مواقع التواصل الاجتماعي
        </p>
      </div>
      <SocialLinks social_links={social_links} />
      <div className="w-full p-2 mt-4 mb-4 text-center z-10">
        <p className="text-[22px] text-gray-200 font-bold">لينكات اخري </p>
      </div>
      {/* Links */}
      <div className="w-full px-4 mt-4 pb-5 flex flex-row justify-center flex-wrap gap-4 z-10">
        {links?.map((link) => (
          <LinkItem key={link.id} link={link} profileId={profile.id} />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default SamplePersonal;
