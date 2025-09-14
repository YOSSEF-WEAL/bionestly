import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request)
{
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/account";

    console.log("OAuth callback received:", { code: !!code, next });

    if (!code)
    {
        console.error("No code in OAuth callback");
        return NextResponse.redirect(
            new URL("/auth/login?error=no_code", url.origin)
        );
    }

    // Create response first
    const response = NextResponse.redirect(new URL(next, url.origin));

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
                    {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    try
    {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error)
        {
            console.error("OAuth exchange error:", error);
            return NextResponse.redirect(
                new URL(
                    `/auth/login?error=${encodeURIComponent(error.message)}`,
                    url.origin
                )
            );
        }

        if (data.user)
        {
            console.log("OAuth success for user:", data.user.email);

            // Check if profile exists
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("user_id", data.user.id)
                .maybeSingle();

            // If no profile exists, create one
            if (!existingProfile)
            {
                const email = data.user.email || "";
                const defaultUsername = email.includes("@")
                    ? email.split("@")[0]
                    : `user_${data.user.id.slice(0, 6)}`;

                const { error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        user_id: data.user.id,
                        email: data.user.email,
                        username: defaultUsername, // auto-generate username from email
                        display_name: data.user.user_metadata?.full_name || "",
                        avatar_url: data.user.user_metadata?.avatar_url || null,
                    });

                if (insertError)
                {
                    console.error("Error creating profile:", insertError);
                } else
                {
                    console.log("Profile created successfully");
                }
            }
        }

        return response;
    } catch (error)
    {
        console.error("OAuth catch error:", error);
        return NextResponse.redirect(
            new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, url.origin)
        );
    }
}
