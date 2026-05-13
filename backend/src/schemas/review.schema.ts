import { z } from 'zod';

export const reviewType = z.enum(['map', 'guestbook']);
export type ReviewType = z.infer<typeof reviewType>;

const reviewerNameOptional = z.string().trim().min(1).max(16).optional();

export const reviewCreateSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('map'),
    poiId: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().min(1).max(128),
    reviewerName: reviewerNameOptional,
  }),
  z.object({
    type: z.literal('guestbook'),
    comment: z.string().trim().min(1).max(1024),
    reviewerName: reviewerNameOptional,
  }),
]);
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;

export const reviewListFilterSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('map'), poiId: z.string() }),
  z.object({ type: z.literal('guestbook') }),
]);
export type ReviewListFilter = z.infer<typeof reviewListFilterSchema>;
