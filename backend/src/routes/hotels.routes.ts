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

// MOCK — Supabase userId → hotel slug (mirrors Prisma User.hotelId join)
const userIdToHotelSlug: Record<string, string> = {
  '02e9ddd3-a38f-44f7-adee-db4f4ab3a0e7': 'lepaindore', // alfred@lepaindore.fr
  '5ffdde55-255b-46d2-9b21-56c7925e7e21': 'adalinos',   // alfred@adalinos.com
};

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const userId = authHeader.slice('Bearer '.length);

  const slug = userIdToHotelSlug[userId];
  if (slug === undefined) {
    return res.status(404).json({ error: 'User not found' });
  }

  const hotel = hotels[slug];
  if (hotel === undefined) {
    return res.status(500).json({ error: 'Hotel mapping inconsistent' });
  }

  return res.json(hotel);
});

router.get('/:slug', (req, res) => {
  const hotel = hotels[req.params.slug];
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  return res.json(hotel);
});

export default router;
