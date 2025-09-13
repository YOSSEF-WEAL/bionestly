"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function updateSocialMedia(formData)
{
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user)
    {
        return { error: "لم يتم العثور على مستخدم مسجل دخول" };
    }

    const { data, error } = await supabase
        .from("profiles")
        .update({
            facebook_url: formData.facebook_url,
            instagram_url: formData.instagram_url,
            twitter_url: formData.twitter_url,
            whatsapp_url: formData.whatsapp_url,
        })
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
    {
        console.error("Update error:", error);
        return { error: error.message };
    }

    revalidatePath('/account');

    return { data };
}


export async function updateTemplate(templateId)
{
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user)
    {
        return { error: "لم يتم العثور على مستخدم مسجل دخول" };
    }

    const { data, error } = await supabase
        .from("profiles")
        .update({
            template: templateId,
        })
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
    {
        console.error("Update error:", error);
        return { error: error.message };
    }

    revalidatePath("/account");

    return { data };
}