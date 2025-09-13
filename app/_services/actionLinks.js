"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

// Add new link
export async function addLink(linkData, email)
{
    const supabase = await createClient();

    try
    {
        // Get the profile by email
        const profile = await getProfileByEmail(email);
        console.log("🚀 ~ addLink ~ profile:", profile)

        if (!profile)
        {
            return { error: "Profile not found" };
        }

        // Insert link
        const { data, error } = await supabase
            .from("links")
            .insert({
                profile_id: profile.id,
                user_id: profile.user_id,
                title: linkData.title,
                url: linkData.url,
                image_url: linkData.image_url,
                order: linkData.order || 1,
            })
            .select();

        if (error)
        {
            console.error("Error adding link:", error);
            return { error: error.message };
        }

        // Revalidate account page
        revalidatePath("/account");
        return { success: true, link: data[0] };
    } catch (err)
    {
        console.error("Unexpected error adding link:", err);
        return { error: err.message || "حدث خطأ أثناء إضافة الرابط" };
    }
}

// Helper function to fetch profile by email
async function getProfileByEmail(email)
{
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

    if (error)
    {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data;
}


// Update existing link
export async function updateLink(linkId, linkData)
{
    const supabase = await createClient();

    try
    {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return { error: 'User not authenticated' };

        // تأكد أن الرابط موجود وغير محذوف
        const { data: existingLink, error: checkError } = await supabase
            .from('links')
            .select('id')
            .eq('id', linkId)
            .eq('user_id', user.id)
            .eq('is_deleted', false)
            .single();

        if (checkError || !existingLink)
        {
            return { error: 'Link not found, deleted, or you do not have permission to update it' };
        }

        const { error } = await supabase
            .from('links')
            .update({
                title: linkData.title,
                url: linkData.url,
                image_url: linkData.image_url,
                order: linkData.order
            })
            .eq('id', linkId)
            .eq('user_id', user.id);

        if (error) return { error: error.message };

        revalidatePath('/account');
        return { success: true };
    } catch (error)
    {
        console.error('Error updating link:', error);
        return { error: error.message || 'An error occurred while updating the link' };
    }
}

// Soft delete link
export async function deleteLink(linkId)
{
    const supabase = await createClient();


    try
    {
        const { data, error } = await supabase
            .from("links")
            .update({ is_deleted: true })
            .eq("id", linkId)
            .select();

        if (error) return { error: error.message || "فشل الحذف" };
        if (!data || data.length === 0) return { error: "لم يتم حذف أي صف. تحقق من صلاحياتك أو الـ id." };

        revalidatePath("/account");
        return { success: true, deletedLink: data[0] };
    } catch (err)
    {
        console.error("💥 Unexpected error soft deleting link:", err);
        return { error: err.message || "حدث خطأ أثناء حذف الرابط" };
    }
}
