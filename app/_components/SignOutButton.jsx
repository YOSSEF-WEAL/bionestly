import { signOtAction } from "../_services/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function SignOutButton() {
  return (
    <form action={signOtAction}>
      <Button>
        LogOut
        <LogOut />
      </Button>
    </form>
  );
}

export default SignOutButton;
