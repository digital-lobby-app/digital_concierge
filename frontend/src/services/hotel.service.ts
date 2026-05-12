import { z } from 'zod'
import { apiRequest } from '@/helpers/apiRequest'

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