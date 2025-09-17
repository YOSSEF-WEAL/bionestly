import { createClient } from "@supabase/supabase-js";
import ClassicBioLink from "../_Templates/ClassicBioLink";

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

  const { display_name, bio, avatar_url } = data.profile;

  return {
    title: `${display_name || params.username} | Bionestly`,
    description: bio || "Discover this profile on Bionestly.",
    openGraph: {
      title: display_name || params.username,
      description: bio || "Discover this profile on Bionestly.",
      images: avatar_url ? [avatar_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: display_name || params.username,
      description: bio || "Discover this profile on Bionestly.",
      images: avatar_url ? [avatar_url] : [],
    },
  };
}

// ✅ Page component
export default async function Page({ params }) {
  const data = await getProfileData(params.username);
  console.log(data.profile.template);

  if (!data?.profile) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold h-full">User not found</h1>
        <p>This profile does not exist.</p>
      </div>
    );
  }
  const templateName = data.profile.template;

  const TemplateComponent = (
    await import(`@/app/_Templates/${templateName}.jsx`)
  ).default;

  return (
    <div className="profile-page">
      <style>{`
        header , .header, footer {
          display: none !important;
        }
      `}</style>
      <TemplateComponent data={data} />
    </div>
  );
}
