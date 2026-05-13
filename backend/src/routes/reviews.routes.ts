import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { getSupabaseUserIdFromHeader, isAdminOfHotel } from '../lib/adminGuard';
import { reviewCreateSchema, reviewListFilterSchema } from '../schemas/review.schema';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const slug = (req.params as { slug?: string }).slug ?? '';
  const parsed = reviewListFilterSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid filter', issues: parsed.error.flatten() });
  }
  const reviews = await prisma.review.findMany({
    where: {
      hotel: { slug },
      type: parsed.data.type,
      ...(parsed.data.type === 'map' ? { poiId: parsed.data.poiId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(reviews);
});

router.post('/', async (req, res) => {
  const slug = (req.params as { slug?: string }).slug ?? '';

  const parsed = reviewCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  const hotel = await prisma.hotel.findUnique({ where: { slug } });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  if (parsed.data.type === 'map') {
    const poi = await prisma.poi.findFirst({
      where: { id: parsed.data.poiId, hotelId: hotel.id },
    });
    if (poi === null) return res.status(404).json({ error: 'POI not found' });
  }

  try {
    const review = await prisma.review.create({
      data:
        parsed.data.type === 'map'
          ? {
              hotelId: hotel.id,
              type: 'map',
              poiId: parsed.data.poiId,
              rating: parsed.data.rating,
              comment: parsed.data.comment,
              reviewerName: parsed.data.reviewerName ?? null,
            }
          : {
              hotelId: hotel.id,
              type: 'guestbook',
              poiId: null,
              rating: null,
              comment: parsed.data.comment,
              reviewerName: parsed.data.reviewerName ?? null,
            },
    });
    return res.status(201).json(review);
  } catch (err) {
    console.error('createReview failed:', err);
    return res.status(500).json({ error: 'Failed to create review' });
  }
});

router.delete('/:reviewId', async (req, res) => {
  const { slug, reviewId } = req.params as { slug?: string; reviewId: string };
  const slugStr = slug ?? '';

  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (supabaseUserId === null) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const hotel = await prisma.hotel.findUnique({ where: { slug: slugStr } });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  const isAdmin = await isAdminOfHotel(supabaseUserId, hotel.id);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  try {
    await prisma.review.delete({ where: { id: reviewId } });
    return res.status(204).end();
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: 'Review not found' });
    }
    console.error('deleteReview failed:', err);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
