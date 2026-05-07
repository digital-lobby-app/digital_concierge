import { Router } from 'express';

const router = Router();

// MOCK — replace when /hotels endpoint ships from db layer
const hotels: Record<string, { id: string; name: string; latitude: number; longitude: number }> = {
  'jon-hotel': {
    id: 'H001',
    name: 'Villa des Pres',
    latitude: 48.85367587564214,
    longitude: 2.3364627421438335,
  },
};

router.get('/:slug', (req, res) => {
  const hotel = hotels[req.params.slug];
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  return res.json(hotel);
});

export default router;
