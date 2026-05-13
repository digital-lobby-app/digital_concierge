import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { getSupabaseUserIdFromHeader, isAdminOfHotel } from '../lib/adminGuard';
import { poiCreateSchema } from '../schemas/poi.schema';
import * as poiStore from '../lib/poiMockStore';
import * as reviewStore from '../lib/reviewMockStore';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const slug = (req.params as { slug?: string }).slug ?? '';
  const pois = await poiStore.listPoisBySlug(slug);
  const hydrated = await Promise.all(
    pois.map(async (p) => ({
      ...p,
      reviews: await reviewStore.listReviews(slug, { type: 'map', poiId: p.id }),
    })),
  );
  return res.json(hydrated);
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
      source: isAdmin ? 'admin' : 'guest',
      comment: isAdmin ? (parsed.data.comment ?? null) : null,
    });

    let reviews: Awaited<ReturnType<typeof reviewStore.listReviews>> = [];
    if (!isAdmin) {
      const review = await reviewStore.createReview(slug, hotel.id, {
        type: 'map',
        poiId: poi.id,
        rating: parsed.data.rating as number,
        comment: parsed.data.comment as string,
        reviewerName: parsed.data.reviewerName,
      });
      reviews = [review];
    }
    return res.status(201).json({ ...poi, reviews });
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

export default router;
