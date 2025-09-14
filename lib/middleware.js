// File: lib/middleware.ts

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request)
{
  let supabaseResponse = NextResponse.next({
    request,
  });

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
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user)
  {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id') // Check for the profile using the correct column
      .eq('user_id', user.id) // Match against the user_id column
      .single();

    if (!profile)
    {
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

      // Correctly insert the user's UUID into the 'user_id' column
      const { error: insertError } = await supabase.from('profiles').insert({
        user_id: user.id, // THIS IS THE CRITICAL FIX
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
      });

      if (insertError)
      {
        console.error('Error creating profile in middleware:', insertError);
      }
    }
  }

  const protectedRoutes = ['/account', '/profile', '/dashboard', '/analytics'];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && isProtectedRoute)
  {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
