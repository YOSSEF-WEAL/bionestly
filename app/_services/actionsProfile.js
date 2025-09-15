"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(updates)
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

    // إنشاء كائن يحتوي فقط على الحقول المسموح بها
    const allowedUpdates = {};
    const allowedFields = [
        'username',
        'display_name',
        'bio',
        'avatar_url',
        'template',
        'caver_url',
        'email'
    ];

    Object.keys(updates).forEach(key =>
    {
        if (allowedFields.includes(key))
        {
            allowedUpdates[key] = updates[key];
        }
    });

    const { data, error } = await supabase
        .from("profiles")
        .update(allowedUpdates)
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

    if (error)
    {
        console.error("Update error:", error);
        return { error: error.message };
    }

    revalidatePath("/account");
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
        .maybeSingle();

    if (error)
    {
        console.error("Update error:", error);
        return { error: error.message };
    }

    revalidatePath("/account");
    return { data };
}

// إضافة أو تحديث رابط اجتماعي
export async function upsertSocialLink(profile_id, platform_id, url_link)
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

    // التحقق إذا كان الرابط موجوداً بالفعل
    const { data: existingLink } = await supabase
        .from("social_links")
        .select("*")
        .eq("profile", profile_id)
        .eq("platform", platform_id)
        .maybeSingle();

    if (existingLink)
    {
        // تحديث الرابط الموجود
        const { data, error } = await supabase
            .from("social_links")
            .update({ url_link })
            .eq("id", existingLink.id)
            .select()
            .single();

        if (error)
        {
            console.error("Error updating social link:", error);
            return { error: error.message };
        }

        revalidatePath("/account");
        return { success: true, link: data };
    } else
    {
        // إضافة رابط جديد
        const { data, error } = await supabase
            .from("social_links")
            .insert({
                profile: profile_id,
                platform: platform_id,
                url_link,
            })
            .select()
            .single();

        if (error)
        {
            console.error("Error adding social link:", error);
            return { error: error.message };
        }

        revalidatePath("/account");
        return { success: true, link: data };
    }
}

// حذف رابط اجتماعي
export async function deleteSocialLink(linkId)
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

    const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", linkId);

    if (error)
    {
        console.error("Error deleting social link:", error);
        return { error: error.message };
    }

    revalidatePath("/account");
    return { success: true };
}