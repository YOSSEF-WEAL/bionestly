import { createClient } from "@/lib/server";

// Get profile data by email
export async function getProfileByEmail(email)
{
    const supabase = await createClient();

    try
    {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error)
        {
            console.error('Error fetching profile:', error);
            return null;
        }

        return profile;
    } catch (error)
    {
        console.error('Error in getProfileByEmail:', error);
        return null;
    }
}

// Get all links for a specific profile by profile ID
export async function getLinksByProfileId(profileId)
{
    const supabase = await createClient();

    try
    {
        const { data: links, error } = await supabase
            .from('links')
            .select('*')
            .eq('profile_id', profileId)
            .eq("is_deleted", false)
            .order('created_at', { ascending: false });

        if (error)
        {
            console.error('Error fetching links:', error);
            return [];
        }

        return links || [];
    } catch (error)
    {
        console.error('Error in getLinksByProfileId:', error);
        return [];
    }
}

// Get profile with all associated links by email
export async function getProfileWithLinksByEmail(email)
{
    const supabase = await createClient();

    try
    {
        // First get the profile
        const profile = await getProfileByEmail(email);

        if (!profile)
        {
            return null;
        }

        // Then get the links for this profile
        const links = await getLinksByProfileId(profile.id);

        return {
            profile,
            links
        };
    } catch (error)
    {
        console.error('Error in getProfileWithLinksByEmail:', error);
        return null;
    }
}

// Get all available templates
export async function getTemplates()
{
    const supabase = await createClient();

    try
    {
        const { data: templates, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error)
        {
            console.error('Error fetching templates:', error);
            return [];
        }

        return templates || [];
    } catch (error)
    {
        console.error('Error in getTemplates:', error);
        return [];
    }
}

// Get template by ID
export async function getTemplateById(templateId)
{
    const supabase = await createClient();

    try
    {
        const { data: template, error } = await supabase
            .from('templates')
            .select('*')
            .eq('id', templateId)
            .single();

        if (error)
        {
            console.error('Error fetching template:', error);
            return null;
        }

        return template;
    } catch (error)
    {
        console.error('Error in getTemplateById:', error);
        return null;
    }
}