import { z } from 'zod'
import { apiRequest } from '@/helpers/apiRequest'

const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  mapZoom: z.number(),
})

export type Hotel = z.infer<typeof hotelSchema>

export async function fetchHotelBySlug(slug: string): Promise<Hotel> {
  const url = `/hotels/${slug}`
  const data = await apiRequest<unknown>(url)
  const hotel = hotelSchema.parse(data)
  return hotel
}
