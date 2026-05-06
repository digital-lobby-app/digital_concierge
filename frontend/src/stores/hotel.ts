import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHotelStore = defineStore('hotel', () => {
  const loaded = ref(false)

  async function fetchBySlug(slug: string) {
    loaded.value = true
    return true // always resolves for now
  }

  async function fetchBySession() {
    loaded.value = true
  }

  return { loaded, fetchBySlug, fetchBySession }
})