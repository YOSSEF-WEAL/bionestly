// File: app/api/account/route.js

import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

// This export is still good practice, but we will add more explicit headers.
export const dynamic = 'force-dynamic';

export async function GET()
{
    const supabase = await createClient();

    try
    {
        // ... (The data fetching logic remains the same)
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

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116')
        {
            throw new Error(`Error fetching profile: ${profileError.message}`);
        }

        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .eq("is_deleted", false)
            .order('order', { ascending: true });

        if (linksError)
        {
            throw new Error(`Error fetching links: ${linksError.message}`);
        }

        // Create the response object
        const response = NextResponse.json({
            user,
            profile,
            links: links || [],
            templates: templatesResult.data || []
        });

        // Step 2: Add explicit no-cache headers to the response.
        // This is the most definitive way to prevent caching.
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error)
    {
        const errorResponse = NextResponse.json({ error: error.message }, { status: 500 });
        // Also add no-cache headers to error responses
        errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        errorResponse.headers.set('Pragma', 'no-cache');
        errorResponse.headers.set('Expires', '0');
        return errorResponse;
    }
}
