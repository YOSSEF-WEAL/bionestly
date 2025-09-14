// File: app/api/account/route.js

import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET()
{
    const supabase = await createClient();

    try
    {
        const [
            userResult,
            templatesResult
        ] = await Promise.all([
            supabase.auth.getUser(),
            supabase.from('templates').select('*')
        ]);

        const { data: { user } } = userResult;

        if (!user)
        {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Fetch profile using the correct 'user_id' column
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id) // THIS IS THE CRITICAL FIX
            .single();

        if (profileError && profileError.code !== 'PGRST116')
        {
            // The error you saw previously would have been thrown here.
            // Now it should work correctly.
            throw new Error(`Error fetching profile: ${profileError.message}`);
        }

        // Fetch links using the correct 'user_id' column
        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id) // Assuming 'links' table also uses 'user_id'
            .eq("is_deleted", false)
            .order('order', { ascending: true });

        if (linksError)
        {
            throw new Error(`Error fetching links: ${linksError.message}`);
        }

        return NextResponse.json({
            user,
            profile,
            links: links || [],
            templates: templatesResult.data || []
        });

    } catch (error)
    {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
