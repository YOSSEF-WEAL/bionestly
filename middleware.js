import { updateSession } from '@/lib/middleware'
import { auth } from "@/app/_services/auth";

export async function middleware(request)
{
  // Refresh Supabase session cookies
  const supabaseResponse = await updateSession(request);
  // Ensure NextAuth auth runs to populate session for protected routes (if you add matchers)
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
