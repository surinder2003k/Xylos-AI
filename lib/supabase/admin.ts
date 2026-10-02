import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazily-created service-role client.
 *
 * These clients must not be built at module scope: `createClient` throws when
 * NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing, and next
 * build imports every route while collecting page data. A module-scope call
 * therefore fails the entire build on any environment that does not have
 * production credentials, including a fresh CI runner.
 *
 * Use this instead of creating service-role clients at the top level of a file.
 */
let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!admin) {
    admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return admin;
}

/**
 * Same credentials, falling back to the anon key so public reads (sitemap,
 * OpenGraph images) still work when only the public key is configured.
 */
export function getSupabasePublic(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}