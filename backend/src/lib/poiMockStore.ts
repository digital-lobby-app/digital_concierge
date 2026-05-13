import { randomUUID } from 'crypto';
import type { PoiCategory, PoiSource } from '../schemas/poi.schema';

export type Poi = {
  id: string;
  hotelId: string;
  category: PoiCategory;
  latitude: number;
  longitude: number;
  name: string;
  comment: string | null;
  source: PoiSource;
  createdAt: Date;
  updatedAt: Date;
};

const seedNow = new Date();

const runtime: Record<string, Poi[]> = {
  lepaindore: [
    { id: 'P001', hotelId: 'H003', category: 'restaurant', latitude: 48.8556, longitude: 2.3350, name: 'Café de Flore', comment: 'Our favourite spot for morning coffee — try the croissants.', source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P002', hotelId: 'H003', category: 'sports', latitude: 48.8480, longitude: 2.3338, name: 'Tennis du Luxembourg', comment: 'Friendly courts in the Jardin du Luxembourg. Reservations available at reception.', source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P003', hotelId: 'H003', category: 'attraction', latitude: 48.8606, longitude: 2.3376, name: 'Louvre Museum', comment: 'Skip the queue with our hotel ticket service.', source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P004', hotelId: 'H003', category: 'shopping', latitude: 48.85122019977861, longitude: 2.324485051407109, name: 'Le Bon Marché', comment: "Paris's oldest department store — perfect for unique gifts.", source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P009', hotelId: 'H003', category: 'attraction', latitude: 48.828471574957554, longitude: 2.3215688284456877, name: 'Jon Nilsen residence', comment: 'The famous artist Jon lived here - beware of the queue', source: 'admin', createdAt: seedNow, updatedAt: seedNow },
  ],
  adalinos: [
    { id: 'P005', hotelId: 'H001', category: 'restaurant', latitude: 46.7782, longitude: 12.9203, name: 'Berghütte Alpenrose', comment: 'Traditional mountain hut with excellent local cuisine and Alpine views.', source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P006', hotelId: 'H001', category: 'sports', latitude: 46.7801, longitude: 12.9250, name: 'Skischule Lienz', comment: 'Our preferred ski school. Mention our hotel for a discount.', source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P007', hotelId: 'H001', category: 'attraction', latitude: 46.7745, longitude: 12.9102, name: 'Schloss Bruck', comment: "Medieval castle with stunning views. Don't miss the regional museum.", source: 'admin', createdAt: seedNow, updatedAt: seedNow },
    { id: 'P008', hotelId: 'H001', category: 'shopping', latitude: 46.7762, longitude: 12.9157, name: 'Lienz Hauptmarkt', comment: "Weekly farmers' market with regional produce and Tirolean crafts.", source: 'admin', createdAt: seedNow, updatedAt: seedNow },
  ],
};

export async function listPoisBySlug(slug: string): Promise<Poi[]> {
  return runtime[slug] ?? [];
}

type CreatePoiArgs = {
  slug: string;
  hotelId: string;
  category: PoiCategory;
  latitude: number;
  longitude: number;
  name: string;
  source: PoiSource;
  comment: string | null;
};

export async function createPoi(args: CreatePoiArgs): Promise<Poi> {
  const now = new Date();
  const poi: Poi = {
    id: randomUUID(),
    hotelId: args.hotelId,
    category: args.category,
    latitude: args.latitude,
    longitude: args.longitude,
    name: args.name,
    comment: args.comment,
    source: args.source,
    createdAt: now,
    updatedAt: now,
  };
  runtime[args.slug] = [...(runtime[args.slug] ?? []), poi];
  return poi;
}

export async function deletePoi(slug: string, poiId: string): Promise<boolean> {
  const list = runtime[slug] ?? [];
  const idx = list.findIndex((p) => p.id === poiId);
  if (idx === -1) return false;
  runtime[slug] = list.filter((p) => p.id !== poiId);
  return true;
}

export async function findPoi(slug: string, poiId: string): Promise<Poi | null> {
  return (runtime[slug] ?? []).find((p) => p.id === poiId) ?? null;
}
