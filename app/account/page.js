import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "../_services/auth";
import { Button } from "@/components/ui/button";
async function page() {
  const session = await auth();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button variant="outline" size="lg">
        {session.user.name}
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
    </div>
  );
}

export default page;
