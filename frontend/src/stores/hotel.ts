import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHotelBySlug, fetchSlugById } from '@/services/hotel.service'

export const useHotelStore = defineStore('hotel', () => {
  const loaded = ref(false)
  const slug = ref<string>()
  const name = ref('')
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)
  const mapZoom = ref<number | null>(null)

  async function fetchBySlug(s: string) {
    try {
      const hotel = await fetchHotelBySlug(s)
      slug.value = s
      name.value = hotel.name
      latitude.value = hotel.latitude
      longitude.value = hotel.longitude
      mapZoom.value = hotel.mapZoom
      loaded.value = true
      return true
    } catch (err) {
      console.error('fetchBySlug failed:', err)
      return false
    }
  }

  async function fetchBySession(id: string) {
  try {
    const resolvedSlug = await fetchSlugById(id)
    const ok = await fetchBySlug(resolvedSlug)
    if (!ok) return false
    return true
  } catch (err) {
    console.error('fetchBySession failed:', err)
    return false
  }
}

  return { loaded, slug, name, latitude, longitude, mapZoom, fetchBySlug, fetchBySession }
})
