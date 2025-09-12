import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/account";

    console.log("OAuth callback received:", { code: !!code, next });

    if (!code) {
        console.error("No code in OAuth callback");
        return NextResponse.redirect(new URL("/auth/login?error=no_code", url.origin));
    }

    // Create response first
    const response = NextResponse.redirect(new URL(next, url.origin));

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error("OAuth exchange error:", error);
            return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, url.origin));
        }

        if (data.user) {
            console.log("OAuth success for user:", data.user.email);
        }

        return response;
    } catch (error) {
        console.error("OAuth catch error:", error);
        return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, url.origin));
    }
}


