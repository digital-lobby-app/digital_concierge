import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { hotelPatchSchema } from '../schemas/hotel.schema';
import { aboutModulePatchSchema } from '../schemas/modules.schema'

const router = Router();

function getSupabaseUserIdFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const id = authHeader.slice('Bearer '.length).trim();
  return id || null;
}

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

// updates db based on settings menu
router.patch('/me/modules/about', async (req, res) => {
  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (!supabaseUserId) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const parsed = aboutModulePatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { supabaseUserId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (parsed.data.hotelName) {
    await prisma.hotel.update({
      where: { id: user.hotelId },
      data: { name: parsed.data.hotelName },
    });
  }

  const updated = await prisma.module.updateMany({
    where: { hotelId: user.hotelId, view: 'about' },
    data: { content: parsed.data.content },
  });

  if (updated.count === 0) {
    return res.status(404).json({ error: 'About module not found' });
  }

  const mod = await prisma.module.findFirst({
    where: { hotelId: user.hotelId, view: 'about' },
  });

  return res.json(mod);
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
