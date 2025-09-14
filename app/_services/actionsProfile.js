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

    // هنا updates ممكن تحتوي avatar_url أو caver_url أو باقي الحقول
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .maybeSingle(); // أفضل من single() علشان ما يعملش error لو مفيش record

    if (error)
    {
        console.error("Update error:", error);
        return { error: error.message };
    }

    // نعمل revalidate للصفحة عشان البيانات تتحدث
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
