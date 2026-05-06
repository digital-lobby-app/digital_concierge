import { Router } from 'express';
import { z } from 'zod';
import { supabase, createSessionClient } from '../lib/supabase';

const router = Router();

// Login validation: only that email is well-formed and password is non-empty.
// Signup-time complexity rules (length, character classes) don't belong here —
// the user is checking an existing credential, not creating a new one.
const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Log the real Supabase error server-side for debugging, but return a
    // generic message — don't reveal whether the email exists or the password
    // was wrong. Both cases get the same response.
    console.error('Supabase signIn error:', error.message);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { access_token, refresh_token, expires_at, user } = data.session;
  return res.json({ access_token, refresh_token, expires_at, user });
});

// Logout requires both tokens because Supabase's signOut needs an active
// session on the client. The frontend sends back what we gave it at login.
const logoutSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

router.post('/logout', async (req, res) => {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const sessionClient = createSessionClient();
  await sessionClient.auth.setSession(parsed.data);
  const { error } = await sessionClient.auth.signOut();

  if (error) {
    // Best-effort: log the failure but tell the frontend it's done. The user
    // has already decided they want out — the frontend will clear local state
    // regardless, and a stuck server-side session expires on its own.
    console.error('Supabase signOut error:', error.message);
  }

  return res.status(204).send();
});

export default router;
