import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { settingsPatchSchema } from '../schemas/settings.schema';
import { requireAuth } from '../middleware/requireAuth';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const email = req.user?.email;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const user = await prisma.user.findUnique({
    where: { email },
    include: { hotel: { include: { settings: true } } },
  });
  if (!user?.hotel?.settings) return res.status(404).json({ error: 'Settings not found' });
  return res.json(user.hotel.settings);
});

router.patch('/me', requireAuth, async (req, res) => {
  const email = req.user?.email;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const parsed = settingsPatchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request body' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'Settings not found' });

  const settings = await prisma.settings.update({
    where: { hotelId: user.hotelId },
    data: parsed.data,
  });
  return res.json(settings);
});

export default router;
