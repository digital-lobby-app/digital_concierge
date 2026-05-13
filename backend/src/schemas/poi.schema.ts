import { z } from 'zod';

export const poiCategory = z.enum(['restaurant', 'sports', 'attraction', 'shopping']);
export const poiSource = z.enum(['admin', 'guest']);

export const poiCreateSchema = z.object({
  category: poiCategory,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().trim().min(1).max(32),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(128).optional(),
  reviewerName: z.string().trim().min(1).max(16).optional(),
});

export type PoiCategory = z.infer<typeof poiCategory>;
export type PoiSource = z.infer<typeof poiSource>;
export type PoiCreateInput = z.infer<typeof poiCreateSchema>;
