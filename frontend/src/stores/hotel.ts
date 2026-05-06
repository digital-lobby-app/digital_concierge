import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHotelStore = defineStore('hotel', () => {
  const loaded = ref(false)
  const slug = ref('dev-hotel') // ← dev slug

  async function fetchBySlug(s: string) {
    slug.value = s
    loaded.value = true
    return true
  }

  async function fetchBySession() {
    slug.value = 'dev-hotel'
    loaded.value = true
  }

  return { loaded, slug, fetchBySlug, fetchBySession }
})