import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read env vars once at module load. If they're missing we crash here, so the
// problem is obvious — better than surfacing as a vague 500 from inside a route.
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
}

// persistSession + autoRefreshToken are off because the client runs server-side
// per request. There's no browser localStorage and no long-lived session — we
// just call Supabase auth methods and forward the result to the frontend.
const authOptions = { persistSession: false, autoRefreshToken: false } as const;

// Shared stateless client. Use for calls that don't need an authenticated user
// (e.g. signInWithPassword — the user supplies credentials, not a token).
export const supabase = createClient(url, anonKey, { auth: authOptions });

// Per-request client used when we need to act AS a specific user. signOut, for
// example, needs the user's session set on the client object before calling.
// The `!` is safe — we throw above if either env var is missing.
export function createSessionClient(): SupabaseClient {
  return createClient(url!, anonKey!, { auth: authOptions });
}
