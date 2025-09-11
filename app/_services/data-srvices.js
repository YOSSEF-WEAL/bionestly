import supabase from "./supabase";
import supabaseAdmin from "./supabase-admin";

export async function getProfile(email)
{
    // Use admin client to avoid RLS issues when checking existence
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

    if (error)
    {
        console.error("getProfile error:", error);
        return null;
    }

    return data;
}

export async function createProfile(newProfile)
{
    console.log("createProfile called with:", newProfile);

    // Validate required fields
    if (!newProfile.email)
    {
        console.error("createProfile: email is required");
        return null;
    }

    // Try UPSERT first (expects UNIQUE on email)
    const upsertRes = await supabaseAdmin
        .from("profiles")
        .upsert([newProfile], { onConflict: "email" })
        .select()
        .single();

    if (!upsertRes.error)
    {
        console.log("createProfile success (upsert):", upsertRes.data);
        return upsertRes.data;
    }

    // If ON CONFLICT failed due to missing UNIQUE constraint, fallback to manual select/insert/update
    if (upsertRes.error && upsertRes.error.code === "42P10")
    {
        console.warn("createProfile: missing UNIQUE(email). Falling back to manual flow.");

        const existing = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", newProfile.email)
            .maybeSingle();

        if (existing.error && existing.error.code !== "PGRST116")
        {
            console.error("createProfile select error:", existing.error);
            return null;
        }

        if (existing.data?.id)
        {
            const updateRes = await supabaseAdmin
                .from("profiles")
                .update(newProfile)
                .eq("id", existing.data.id)
                .select()
                .single();

            if (updateRes.error)
            {
                console.error("createProfile update error:", updateRes.error);
                return null;
            }

            console.log("createProfile success (update):", updateRes.data);
            return updateRes.data;
        }

        const insertRes = await supabaseAdmin
            .from("profiles")
            .insert([newProfile])
            .select()
            .single();

        if (insertRes.error)
        {
            console.error("createProfile insert error:", insertRes.error);
            return null;
        }

        console.log("createProfile success (insert):", insertRes.data);
        return insertRes.data;
    }

    console.error("createProfile error:", upsertRes.error);
    console.error("createProfile error details:", {
        message: upsertRes.error.message,
        details: upsertRes.error.details,
        hint: upsertRes.error.hint,
        code: upsertRes.error.code
    });
    return null; // Don't throw, just return null
}

// Ensure a Supabase Auth user exists (auth.users) for the given email.
// Uses service role key; safe only on the server.
export async function ensureSupabaseAuthUser({ email, username, avatar_url })
{
    try
    {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: {
                username,
                avatar_url,
                source: "nextauth-google",
            },
        });

        if (error)
        {
            // If user already exists, ignore
            if (typeof error.message === "string" && error.message.toLowerCase().includes("already"))
            {
                return null;
            }
            console.error("ensureSupabaseAuthUser error:", error);
            return null;
        }

        return data;
    } catch (err)
    {
        console.error("ensureSupabaseAuthUser exception:", err);
        return null;
    }
}