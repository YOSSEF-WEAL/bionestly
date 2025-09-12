import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "../_services/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SmollSpinner from "../_ui/SmollSpinner";

async function UserAvatar() {
  const session = await auth();

  return (
    <>
      {session?.user.image ? (
        <Link href="/">
          <Button variant="outline" size="lg">
            {session.user.name}
            <Avatar>
              <AvatarImage src={session?.user?.image} />
              <AvatarFallback>
                <SmollSpinner />
              </AvatarFallback>
            </Avatar>
          </Button>
        </Link>
      ) : (
        <Link href="login">
          <Button variant="outline" size="lg">
            login
          </Button>
        </Link>
      )}
    </>
  );
}

export default UserAvatar;
