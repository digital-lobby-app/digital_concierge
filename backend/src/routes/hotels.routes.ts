import { Router } from 'express';

const router = Router();

// MOCK — replace when /hotels endpoint ships from db layer
const hotels: Record<string, { id: string; name: string; latitude: number; longitude: number; mapZoom: number }> = {
  'lepaindore': {
    id: 'H001',
    name: 'Le Pain Doré',
    latitude: 48.85367587564214,
    longitude: 2.3364627421438335,
    mapZoom: 14,
  },
  'adalinos': {
    id: 'H002',
    name: "Adalino's Bunny Hotelino",
    latitude: 46.77694526380854,
    longitude: 12.917673716739909,
    mapZoom: 14,
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
