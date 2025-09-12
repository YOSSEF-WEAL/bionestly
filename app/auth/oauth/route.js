import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request)
{
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/account";

    const response = NextResponse.redirect(new URL(next, url.origin));

    if (!code) return response;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll()
                {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet)
                {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    try
    {
        await supabase.auth.exchangeCodeForSession(code);
    } catch
    {
        // ignore and still redirect
    }

    return response;
}


