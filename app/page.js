import { Button } from "@/components/ui/button";
import supabase from "./_services/supabase";

export default async function Home() {
  let { data: profiles, error } = await supabase.from("profiles").select("*");
  console.log("🚀 ~ Home ~ profiles:", profiles);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>
        {profiles.map((item) => (
          <div key={item.id}>
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
