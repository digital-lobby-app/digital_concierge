import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { poiCreateSchema, reviewCreateSchema } from '../schemas/poi.schema';
import * as poiStore from '../lib/poiMockStore';

const router = Router({ mergeParams: true });

function getSupabaseUserIdFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const id = authHeader.slice('Bearer '.length).trim();
  return id || null;
}

async function isAdminOfHotel(supabaseUserId: string | null, hotelId: string): Promise<boolean> {
  if (supabaseUserId === null) return false;
  const user = await prisma.user.findUnique({ where: { supabaseUserId } });
  return user !== null && user.hotelId === hotelId;
}

router.get('/', async (req, res) => {
  const slug = (req.params as { slug?: string }).slug ?? '';
  const pois = await poiStore.listPoisBySlug(slug);
  return res.json(pois);
});

router.post('/', async (req, res) => {
  const slug = (req.params as { slug?: string }).slug ?? '';

  const parsed = poiCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  const hotel = await prisma.hotel.findUnique({ where: { slug } });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  const isAdmin = await isAdminOfHotel(supabaseUserId, hotel.id);

  if (!isAdmin && (parsed.data.rating === undefined || parsed.data.comment === undefined)) {
    return res.status(400).json({ error: 'Guest POIs require both rating and comment' });
  }

  try {
    const poi = await poiStore.createPoi({
      slug,
      hotelId: hotel.id,
      category: parsed.data.category,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      name: parsed.data.name,
      isAdmin,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      reviewerName: parsed.data.reviewerName,
    });
    return res.status(201).json(poi);
  } catch (err) {
    console.error('createPoi failed:', err);
    return res.status(500).json({ error: 'Failed to create POI' });
  }
});

router.delete('/:poiId', async (req, res) => {
  const { slug, poiId } = req.params as { slug?: string; poiId: string };
  const slugStr = slug ?? '';

  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (supabaseUserId === null) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const hotel = await prisma.hotel.findUnique({ where: { slug: slugStr } });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  const isAdmin = await isAdminOfHotel(supabaseUserId, hotel.id);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  const deleted = await poiStore.deletePoi(slugStr, poiId);
  if (!deleted) return res.status(404).json({ error: 'POI not found' });
  return res.status(204).end();
});

router.post('/:poiId/reviews', async (req, res) => {
  const { slug, poiId } = req.params as { slug?: string; poiId: string };
  const slugStr = slug ?? '';

  const parsed = reviewCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  try {
    const review = await poiStore.createReview(slugStr, poiId, parsed.data);
    if (review === null) return res.status(404).json({ error: 'POI not found' });
    return res.status(201).json(review);
  } catch (err) {
    console.error('createReview failed:', err);
    return res.status(500).json({ error: 'Failed to create review' });
  }
});

router.delete('/:poiId/reviews/:reviewId', async (req, res) => {
  const { slug, poiId, reviewId } = req.params as { slug?: string; poiId: string; reviewId: string };
  const slugStr = slug ?? '';

  const supabaseUserId = getSupabaseUserIdFromHeader(req.headers.authorization);
  if (supabaseUserId === null) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const hotel = await prisma.hotel.findUnique({ where: { slug: slugStr } });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  const isAdmin = await isAdminOfHotel(supabaseUserId, hotel.id);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  const deleted = await poiStore.deleteReview(slugStr, poiId, reviewId);
  if (!deleted) return res.status(404).json({ error: 'Review not found' });
  return res.status(204).end();
});

export default router;
