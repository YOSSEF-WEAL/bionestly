import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="w-full p-4 bg-white flex justify-center items-center mt-2 border-t-2 border-gray-400/35 z-999">
      <Link
        href={"/"}
        className="flex items-center justify-center flex-row gap-2"
        target="_blank"
      >
        <Image
          width={80}
          height={80}
          src="/logo Bionestly.png"
          alt="logo Bionestly"
          className="w-8 h-8 "
        />
        <span className="font-bold text-[#730000]">Join Bionestly</span>
      </Link>
    </div>
  );
}

export default Footer;
