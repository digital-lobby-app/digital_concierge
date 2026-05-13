import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { settingsPatchSchema } from '../schemas/settings.schema';
import { getSupabaseUserIdFromHeader } from '../lib/adminGuard';

const router = Router();

router.get('/:slug', async (req, res) => {
  const hotel = await prisma.hotel.findUnique({
    where: { slug: req.params.slug },
    include: { settings: true },
  });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
  if (!hotel.settings) return res.status(404).json({ error: 'Settings not found' });
  return res.json(hotel.settings);
});

router.patch('/me', async (req, res) => {
  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (!supabaseUserId) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const parsed = settingsPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { supabaseUserId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const settings = await prisma.settings.update({
    where: { hotelId: user.hotelId },
    data: parsed.data,
  });
  return res.json(settings);
});

export default router;
