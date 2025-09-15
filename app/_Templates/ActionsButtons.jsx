"use client";

import { Share } from "lucide-react";
import Link from "next/link";
import React from "react";

function ActionsButtons({ username }) {
  const handleShare = async () => {
    const url = `${window.location.origin}/${username}`;
    const title = "شوف البروفايل دا";
    const text = "اتفرج على البروفايل بتاعي من اللينك ده 👇";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log("تمت عملية الشير بنجاح");
      } catch (err) {
        console.error("المستخدم قفل الشير:", err);
      }
    } else {
      // fallback للمتصفحات اللي مش بتدعم Web Share API
      try {
        await navigator.clipboard.writeText(url);
        alert("تم نسخ الرابط، ابعته لأي حد ✨");
      } catch (err) {
        console.error("فشل نسخ الرابط:", err);
      }
    }
  };

  return (
    <div className="w-full absolute top-0 left-0 flex justify-between items-center p-4 mt-4 md:mt-1">
      {/* زر الشير */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center p-2 bg-white/50 rounded-full backdrop-blur-2xl transition-all opacity-90 hover:opacity-100 hover:bg-white/80 hover:scale-[1.08] cursor-pointer"
      >
        <Share size={24} />
      </button>

      {/* زر اللوجو */}
      <Link
        href="/"
        target="_blank"
        className="flex items-center justify-center p-2 bg-white/50 rounded-full backdrop-blur-2xl transition-all opacity-90 hover:opacity-100 hover:bg-white/80 hover:scale-[1.08]"
      >
        <img
          src="/logoBionestlyBase.svg"
          alt="Bionestly Logo"
          className="w-7 h-7"
        />
      </Link>
    </div>
  );
}

export default ActionsButtons;
