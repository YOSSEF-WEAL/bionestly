import Image from "next/image";
import { signInAction } from "../_services/actions";
import { Button } from "@/components/ui/button";

function SignInButton() {
  return (
    <form action={signInAction}>
      <Button type="submit">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="18"
          width="18"
        />
        <span>Continue with Google</span>
      </Button>
    </form>
  );
}

export default SignInButton;
