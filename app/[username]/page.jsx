import { createClient } from "@supabase/supabase-js";

// ✅ Add SEO Metadata (runs on server before rendering)
export async function generateMetadata({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data } = await supabase.functions.invoke("get-profile-data", {
    body: { username: params.username },
  });

  if (!data?.profile) {
    return {
      title: "User not found | Bionestly",
      description: "This profile could not be found.",
    };
  }

  return {
    title: `${data.profile.display_name || params.username} | Bionestly`,
    description: data.profile.bio || "Discover this profile on Bionestly.",
    openGraph: {
      title: `${data.profile.display_name || params.username} | Bionestly`,
      description: data.profile.bio || "Discover this profile on Bionestly.",
      images: data.profile.avatar_url
        ? [{ url: data.profile.avatar_url, alt: "Profile Avatar" }]
        : [],
    },
  };
}

export default async function Page({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch profile & links
  const { data, error } = await supabase.functions.invoke("get-profile-data", {
    body: { username: params.username },
  });

  if (error) {
    console.error("❌ Error fetching profile:", error);
  } else {
    console.log("✅ Profile data:", data);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profile Page</h1>
    </div>
  );
}
