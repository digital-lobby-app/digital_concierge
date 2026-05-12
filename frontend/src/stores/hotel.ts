import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHotelBySlug, fetchSlugById } from '@/services/hotel.service'

export const useHotelStore = defineStore('hotel', () => {
  const loaded = ref(false)
  const slug = ref<string>()
  const name = ref('')
  const description = ref<string>()
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)
  const mapZoom = ref<number | null>(null)
  const aboutContent = ref()
  const mapContent = ref()
  const guestBookContent = ref()

  async function fetchBySlug(s: string) {
    try {
      const hotel = await fetchHotelBySlug(s)
      aboutContent.value = hotel.modules.find((el) => el.view === 'about')
      mapContent.value = hotel.modules.find((el) => el.view === 'map')
      guestBookContent.value = hotel.modules.find((el) => el.view === 'guestbook')
      slug.value = s
      name.value = hotel.name
      description.value = hotel.description
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

  return { loaded, slug, name, description, latitude, longitude, mapZoom, aboutContent, mapContent, fetchBySlug, fetchBySession }
})
