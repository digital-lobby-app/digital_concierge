import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHotelBySlug, fetchPoisBySlug, fetchSlugById, patchAboutModuleMe } from '@/services/hotel.service'
import type { Poi } from '@/services/hotel.service'

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
  const pois = ref<Poi[]>([])

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
      pois.value = await fetchPoisBySlug(s)
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

async function saveAboutContent(
  supabaseUserId: string,
  payload: {
    hotelName?: string
    welcomeMessage: string
    receptionPhone: string
    checkIn: string
    checkOut: string
    breakfast: string
    wifiName: string
    wifiPassword: string
  }
) {
  const updated = await patchAboutModuleMe(supabaseUserId, {
    hotelName: payload.hotelName,
    content: {
      welcomeMessage: payload.welcomeMessage,
      receptionPhone: payload.receptionPhone,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      breakfast: payload.breakfast,
      wifiName: payload.wifiName,
      wifiPassword: payload.wifiPassword,
    },
  })

  if (payload.hotelName) name.value = payload.hotelName

  if (aboutContent.value) {
    aboutContent.value = {
      ...aboutContent.value,
      content: { ...aboutContent.value.content, ...payload },
    }
  }

  return updated
}

  return { loaded, slug, name, description, latitude, longitude, mapZoom, aboutContent, mapContent, fetchBySlug, fetchBySession, saveAboutContent }
})
