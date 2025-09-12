import UserAvatar from "@/app/_components/UserAvatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignOutButton from "@/app/_components/SignOutButton";

function Header() {
  return (
    <header className="flex justify-between gap-2 items-center h-20 px-5 bg-blue-100">
      <UserAvatar />
      <SignOutButton />
      <Link href={"account"}>
        <Button size="lg">Account</Button>
      </Link>
      <Link href={"login"}>
        <Button size="lg">login</Button>
      </Link>
    </header>
  );
}

export default Header;
