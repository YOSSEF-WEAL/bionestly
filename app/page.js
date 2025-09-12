import { Button } from "@/components/ui/button";
import supabase from "./_services/supabase";
import { auth } from "./_services/auth";

export default async function Home()
{
  const session = await auth();

  let { data: profiles, error } = await supabase.from("profiles").select("*");
  console.log("🚀 ~ Home ~ profiles:", profiles);

  return (
    <div className="">
      <h1>
        {profiles.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <h1>{item.display_name}</h1>
            <h1>{item.bio}</h1>
          </div>
        ))}
      </h1>
      <Button size="lg" variant="destructive">
        Home page{" "}
      </Button>
    </div>
  );
}
