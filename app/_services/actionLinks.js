"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

// Helper to get the authenticated user securely
async function getAuthenticatedUser()
{
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user)
    {
        throw new Error("User not authenticated");
    }
    return user;
}

// Add new link
export async function addLink(linkData)
{
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("links")
        .insert({
            user_id: user.id, // Use user.id directly
            title: linkData.title,
            url: linkData.url,
            image_url: linkData.image_url,
            order: linkData.order || 1,
        })
        .select()
        .single(); // Return the newly created link

    if (error)
    {
        return { error: error.message };
    }

    revalidatePath("/account"); // Keep for cache invalidation
    return { success: true, link: data }; // Return the new link
}

// Update existing link
export async function updateLink(linkId, linkData)
{
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('links')
        .update(linkData)
        .eq('id', linkId)
        .eq('user_id', user.id)
        .select() // Return the updated link
        .single();

    if (error)
    {
        return { error: error.message };
    }

    revalidatePath('/account');
    return { success: true, link: data }; // Return the updated link
}

// Soft delete link
export async function deleteLink(linkId)
{
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("links")
        .update({ is_deleted: true })
        .eq("id", linkId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
    {
        return { error: error.message };
    }

    revalidatePath("/account");
    return { success: true, deletedLink: data }; // Return the deleted link's ID
}




export async function addClick(link_id, profile_id)
{
    const supabase = await createClient();
    const { error } = await supabase
        .from("clicks")
        .insert([{ link_id, profile_id }]);

    if (error)
    {
        console.error("Error adding click:", error);
        throw new Error(error.message);
    }

    return true;
}
