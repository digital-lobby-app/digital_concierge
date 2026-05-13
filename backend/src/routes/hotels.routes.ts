import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { hotelPatchSchema } from '../schemas/hotel.schema';
import { getSupabaseUserIdFromHeader } from '../lib/adminGuard';

const router = Router();

router.get('/me', async (req, res) => {
  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (!supabaseUserId) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const user = await prisma.user.findUnique({
    where: { supabaseUserId },
    include: { hotel: { select: { slug: true } } },
  });
  if (!user?.hotel) return res.status(404).json({ error: 'User not found' });
  return res.json(user.hotel.slug);
});

router.patch('/me', async (req, res) => {
  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (!supabaseUserId) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const parsed = hotelPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { supabaseUserId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const hotel = await prisma.hotel.update({
    where: { id: user.hotelId },
    data: parsed.data,
  });
  return res.json(hotel);
});

router.get('/:slug', async (req, res) => {
  const hotel = await prisma.hotel.findUnique({
    where: { slug: req.params.slug },
    include: {
      settings: true,
      modules: { orderBy: { position: 'asc' } },
    },
  });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
  return res.json(hotel);
});

export default router;
