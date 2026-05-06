import { Router } from 'express';
import { z } from 'zod';
import { supabase, createSessionClient } from '../lib/supabase';

const router = Router();

// Email format only — not full pw validation.
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
    console.error('Supabase signIn error:', error.message);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { access_token, refresh_token, expires_at, user } = data.session;
  return res.json({ access_token, refresh_token, expires_at, user });
});

// signOut needs an active session — frontend sends both tokens back.
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
    // Best-effort — frontend clears local state regardless.
    console.error('Supabase signOut error:', error.message);
  }

  return res.status(204).send();
});

export default router;
