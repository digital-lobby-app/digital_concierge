import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
}

// Stateless server client: no localStorage, no auto-refresh.
const authOptions = { persistSession: false, autoRefreshToken: false } as const;

// Shared client for calls without a user session (e.g. signInWithPassword).
export const supabase = createClient(url, anonKey, { auth: authOptions });

// Per-request client for calls needing an active user session (e.g. signOut).
export function createSessionClient(): SupabaseClient {
  return createClient(url!, anonKey!, { auth: authOptions });
}
