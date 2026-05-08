import { z } from 'zod';

export const hotelCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(50),
  description: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  logoUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  mapZoom: z.number().int().min(1).max(20).optional(),
});

export const hotelPatchSchema = hotelCreateSchema.partial().omit({ slug: true });

export type HotelCreate = z.infer<typeof hotelCreateSchema>;
export type HotelPatch = z.infer<typeof hotelPatchSchema>;
