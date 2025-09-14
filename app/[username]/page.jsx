import { createClient } from "@supabase/supabase-js";

// ✅ Shared function to fetch profile data
async function getProfileData(username) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase.functions.invoke(
      "get-profile-data",
      {
        body: { username },
      }
    );

    if (error) {
      console.error("❌ Error fetching profile:", error.message);
      if (error.context) {
        console.error("📩 Edge Function response:", error.context);
      }
      return null;
    }

    return data;
  } catch (err) {
    console.error("🔥 Exception calling Edge Function:", err);
    return null;
  }
}

// ✅ Add SEO Metadata
export async function generateMetadata({ params }) {
  const data = await getProfileData(params.username);

  if (!data?.profile) {
    return {
      title: "User not found | Bionestly",
      description: "This profile could not be found.",
    };
  }

  return {
    title: `${data.profile.display_name || params.username} | Bionestly`,
    description: data.profile.bio || "Discover this profile on Bionestly.",
  };
}

// ✅ Page component
export default async function Page({ params }) {
  const data = await getProfileData(params.username);

  console.log("🚀 ~ Page ~ data:", data);

  if (!data?.profile) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">User not found</h1>
        <p>This profile does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        {data.profile.display_name || params.username}
      </h1>
      <p>{data.profile.bio}</p>
    </div>
  );
}
