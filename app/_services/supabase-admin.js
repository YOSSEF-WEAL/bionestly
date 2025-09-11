import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key.
// NEVER import this in client components.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export default supabaseAdmin;


