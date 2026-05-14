import { z } from 'zod'
import { apiRequest } from '@/helpers/apiRequest'

const reviewType = z.enum(['map', 'guestbook'])
export type ReviewType = z.infer<typeof reviewType>

export const reviewSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  type: reviewType,
  poiId: z.string().nullable(),
  rating: z.number().int().min(1).max(5).nullable(),
  comment: z.string().min(1).max(1024),
  reviewerName: z.string().max(16).nullable(),
  createdAt: z.coerce.date(),
})
export type Review = z.infer<typeof reviewSchema>

const mapPayloadSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(128),
  reviewerName: z.string().trim().min(1).max(16).optional(),
})
const guestbookPayloadSchema = z.object({
  comment: z.string().trim().min(1).max(1024),
  reviewerName: z.string().trim().min(1).max(16).optional(),
})
export type MapReviewPayload = z.input<typeof mapPayloadSchema>
export type GuestbookReviewPayload = z.input<typeof guestbookPayloadSchema>

type CreateInput =
  | ({ type: 'map'; poiId: string } & z.output<typeof mapPayloadSchema>)
  | ({ type: 'guestbook' } & z.output<typeof guestbookPayloadSchema>)

async function createReview(slug: string, input: CreateInput): Promise<Review> {
  const data = await apiRequest<unknown>(`/hotels/${slug}/reviews`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return reviewSchema.parse(data)
}

async function deleteReview(slug: string, reviewId: string, userId: string): Promise<void> {
  await apiRequest<void>(`/hotels/${slug}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userId}` },
  })
}

export async function createMapReview(
  slug: string,
  poiId: string,
  payload: MapReviewPayload,
): Promise<Review> {
  const sanitized = mapPayloadSchema.parse(payload)
  return createReview(slug, { type: 'map', poiId, ...sanitized })
}

export async function deleteMapReview(
  slug: string,
  reviewId: string,
  userId: string,
): Promise<void> {
  return deleteReview(slug, reviewId, userId)
}

export async function createGuestbookReview(
  slug: string,
  payload: GuestbookReviewPayload,
): Promise<Review> {
  const sanitized = guestbookPayloadSchema.parse(payload)
  return createReview(slug, { type: 'guestbook', ...sanitized })
}

export async function deleteGuestbookReview(
  slug: string,
  reviewId: string,
  userId: string,
): Promise<void> {
  return deleteReview(slug, reviewId, userId)
}

export async function fetchGuestbookReviews(slug: string): Promise<Review[]> {
  const data = await apiRequest<unknown>(`/hotels/${slug}/reviews?type=guestbook`)
  return z.array(reviewSchema).parse(data)
}
