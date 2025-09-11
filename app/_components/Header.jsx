import UserAvatar from "@/app/_components/UserAvatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignOutButton from "@/app/_components/SignOutButton";

function Header() {
  return (
    <header>
      <UserAvatar />
      <SignOutButton />
      <Button size="lg">
        <Link href={"account"}>Account</Link>
      </Button>
      <Button size="lg">
        <Link href={"login"}>login</Link>
      </Button>
    </header>
  );
}

export default Header;
