import { createClient } from '@supabase/supabase-js';

// Browser/client-side Supabase client (uses anon key)
// This is only instantiated when actually used at runtime
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing required Supabase environment variables. ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  return createClient(url, key);
}

/**
 * Server-side Supabase client (uses service role key — only use in API routes)
 * This function is called at runtime, not during build time.
 */
export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable.'
    );
  }
  if (!key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This is required for server-side Supabase access in API routes.'
    );
  }

  return createClient(url, key);
}

// Backward compatibility export - minimal stub that won't break during build
export const supabase = {} as ReturnType<typeof createClient>;



