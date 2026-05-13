import { z } from 'zod'
import { apiRequest } from '@/helpers/apiRequest'
import { reviewSchema } from '@/services/review.service'

// mudole

const aboutContentSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  wifiName: z.string(),
  wifiPassword: z.string(),
  breakfast: z.string(),
  receptionPhone: z.string(),
  welcomeMessage: z.string()
})

// TODO: fill these in once you can see payload
const mapContentSchema = z.record(z.string(), z.unknown())
const guestbookContentSchema = z.record(z.string(), z.unknown())

const moduleSchema = z.discriminatedUnion('view', [
  z.object({
    id: z.string().uuid(),
    hotelId: z.string(),
    position: z.number().int().nonnegative(),
    view: z.literal('about'),
    content: aboutContentSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  z.object({
    id: z.string().uuid(),
    hotelId: z.string(),
    position: z.number().int().nonnegative(),
    view: z.literal('map'),
    content: mapContentSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  z.object({
    id: z.string().uuid(),
    hotelId: z.string(),
    position: z.number().int().nonnegative(),
    view: z.literal('guestbook'),
    content: guestbookContentSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
])

// settings

const hotelSettingsSchema = z.object({
  id: z.string().uuid(),
  hotelId: z.string(),
  bgImages: z.string(),
  colorPalette: z.string(),
  fontPair: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

// pois

const poiSchema = z.object({
  id: z.string(),
  hotelId: z.string(),
  category: z.enum(['restaurant', 'sports', 'attraction', 'shopping']),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string().min(1).max(32),
  comment: z.string().max(128).nullable(),
  source: z.enum(['admin', 'guest']),
  reviews: z.array(reviewSchema).default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Poi = z.infer<typeof poiSchema>
export type PoiCategory = z.infer<typeof poiSchema>['category']
export type PoiCreateInput = {
  category: PoiCategory
  latitude: number
  longitude: number
  name: string
  rating?: number
  comment?: string
  reviewerName?: string
}

// hotel

const hotelSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  logoUrl: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  mapZoom: z.number(),
  modules: z.array(moduleSchema),
  settings: hotelSettingsSchema,
})

export type Hotel = z.infer<typeof hotelSchema>
export type HotelModule = z.infer<typeof moduleSchema>
export type HotelSettings = z.infer<typeof hotelSettingsSchema>



export async function fetchHotelBySlug(slug: string): Promise<Hotel> {
  const data = await apiRequest<unknown>(`/hotels/${slug}`)
  return hotelSchema.parse(data)
}

export async function fetchSlugById(userId: string): Promise<string> {
  const slug = await apiRequest<unknown>(`/hotels/me`, {
    headers: { Authorization: `Bearer ${userId}` },
  })
  return z.string().parse(slug)
}

export async function fetchPoisBySlug(slug: string): Promise<Poi[]> {
  const data = await apiRequest<unknown>(`/hotels/${slug}/pois`)
  return z.array(poiSchema).parse(data)
}

export async function createPoi(
  slug: string,
  input: PoiCreateInput,
  userId?: string
): Promise<Poi> {
  const data = await apiRequest<unknown>(`/hotels/${slug}/pois`, {
    method: 'POST',
    headers: userId !== undefined ? { Authorization: `Bearer ${userId}` } : {},
    body: JSON.stringify(input),
  })
  return poiSchema.parse(data)
}

export async function deletePoi(
  slug: string,
  poiId: string,
  userId: string
): Promise<void> {
  await apiRequest<void>(`/hotels/${slug}/pois/${poiId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userId}` },
  })
}
