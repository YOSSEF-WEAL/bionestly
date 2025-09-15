import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// -------------------- Profiles --------------------
export async function getProfileByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getProfileByEmail:", error);
    return null;
  }
}

export async function getLinksByProfileId(profileId) {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", profileId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching links:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getLinksByProfileId:", error);
    return [];
  }
}

export async function getProfileWithLinksByEmail(email) {
  try {
    const profile = await getProfileByEmail(email);
    if (!profile) return null;

    const links = await getLinksByProfileId(profile.id);
    return { profile, links };
  } catch (error) {
    console.error("Error in getProfileWithLinksByEmail:", error);
    return null;
  }
}

// -------------------- Templates --------------------
export async function getTemplates() {
  try {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching templates:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTemplates:", error);
    return [];
  }
}

export async function getTemplateById(templateId) {
  try {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) {
      console.error("Error fetching template:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getTemplateById:", error);
    return null;
  }
}

// -------------------- Platforms --------------------
export async function getPlatforms() {
  try {
    const { data, error } = await supabase
      .from("platforms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching platforms:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getPlatforms:", error);
    return [];
  }
}

export async function getPlatformById(platformId) {
  try {
    const { data, error } = await supabase
      .from("platforms")
      .select("*")
      .eq("id", platformId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching platform by id:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getPlatformById:", error);
    return null;
  }
}

// -------------------- Social Links --------------------
export async function getSocialLinksById(profile_id) {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("profile", profile_id);

    if (error) {
      console.error("Error fetching social links:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getSocialLinksById:", error);
    return [];
  }
}
