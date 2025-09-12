import { Button } from "@/components/ui/button";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="bg-blue-100 shadow-md py-4 h-15">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center ">
          <Link href="/">
            {/* <Image src="/logo.svg" alt="Logo" width={100} height={100} /> */}
            <h1>BioNestly</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button>
                <LogInIcon />
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>
                <UserPlusIcon />
                انشاء حساب{" "}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
